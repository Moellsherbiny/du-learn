from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers import PasswordResetVerifySerializer 
from django.contrib.auth.password_validation import validate_password

import secrets
from apps.security.services.turnstile import (
    validate_turnstile_request,
)

from ..services.emails import (
    send_password_reset_otp_email,
)

from ..services.otp import (
    OTPPurpose,
    generate_otp,
    verify_otp
)


User = get_user_model()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    turnstile_token = serializers.CharField(
        required=True,
        write_only=True,
        trim_whitespace=True,
    )


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetRequestSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        email = serializer.validated_data["email"].strip().lower()
        turnstile_token = serializer.validated_data["turnstile_token"]

        # 1. Verify Turnstile
        if not validate_turnstile_request(
            request,
            turnstile_token,
        ):
            return Response(
                {
                    "detail": "فشل التحقق الأمني. يرجى المحاولة مرة أخرى."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2. Find user
        try:
            user = User.objects.get(
                email__iexact=email,
                is_active=True,
            )
        except User.DoesNotExist:
            return Response(
                {
                    "detail": "لا يوجد حساب مرتبط بهذا البريد الإلكتروني."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # 3. Generate OTP
        try:
            otp = generate_otp(
                user.id,
                purpose=OTPPurpose.PASSWORD_RESET,
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        # 4. Send OTP
        try:
            send_password_reset_otp_email(
                user=user,
                otp=otp,
            )
        except Exception:
            # لو إرسال البريد فشل، لا نعتبر العملية ناجحة.
            # ونمسح OTP حتى لا يبقى رمز غير مُرسل صالحًا.
            from ..services.otp import clear_otp

            clear_otp(
                user.id,
                purpose=OTPPurpose.PASSWORD_RESET,
            )

            return Response(
                {
                    "detail": (
                        "تعذر إرسال رمز إعادة التعيين. "
                        "يرجى المحاولة مرة أخرى."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # 5. Success
        return Response(
            {
                "detail": (
                    "تم إرسال رمز إعادة تعيين كلمة المرور "
                    "إلى بريدك الإلكتروني."
                ),
            },
            status=status.HTTP_200_OK,
        )

RESET_TOKEN_EXPIRY_SECONDS = 10 * 60
RESET_TOKEN_PREFIX = "password_reset_token"


def _get_reset_token_key(token):
    return f"{RESET_TOKEN_PREFIX}:{token}"

class PasswordResetVerifyView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetVerifySerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        email = serializer.validated_data["email"].strip().lower()
        otp = serializer.validated_data["otp"].strip()

        try:
            user = User.objects.get(
                email__iexact=email,
                is_active=True,
            )
        except User.DoesNotExist:
            return Response(
                {
                    "detail": "رمز التحقق غير صحيح أو منتهي الصلاحية."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify password reset OTP
        is_valid, message = verify_otp(
            user.id,
            otp,
            purpose=OTPPurpose.PASSWORD_RESET,
        )

        if not is_valid:
            return Response(
                {
                    "detail": message,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Generate temporary reset token
        reset_token = secrets.token_urlsafe(32)

        cache.set(
            _get_reset_token_key(reset_token),
            {
                "user_id": user.id,
            },
            timeout=RESET_TOKEN_EXPIRY_SECONDS,
        )

        return Response(
            {
                "detail": "تم التحقق من الرمز بنجاح.",
                "reset_token": reset_token,
            },
            status=status.HTTP_200_OK,
        )

class PasswordResetConfirmSerializer(serializers.Serializer):
    reset_token = serializers.CharField(
        required=True,
        write_only=True,
        trim_whitespace=True,
    )

    new_password = serializers.CharField(
        required=True,
        write_only=True,
        min_length=8,
    )

    confirm_password = serializers.CharField(
        required=True,
        write_only=True,
    )

    def validate(self, attrs):
        new_password = attrs["new_password"]
        confirm_password = attrs["confirm_password"]

        if new_password != confirm_password:
            raise serializers.ValidationError(
                {
                    "confirm_password": [
                        "كلمتا المرور غير متطابقتين."
                    ]
                }
            )

        token = attrs["reset_token"].strip()

        if not token:
            raise serializers.ValidationError(
                {
                    "reset_token": [
                        "رمز إعادة التعيين غير صالح."
                    ]
                }
            )

        token_data = cache.get(
            _get_reset_token_key(token)
        )

        if not token_data:
            raise serializers.ValidationError(
                {
                    "reset_token": [
                        (
                            "جلسة إعادة تعيين كلمة المرور "
                            "منتهية أو غير صالحة."
                        )
                    ]
                }
            )

        user_id = token_data.get("user_id")

        if not user_id:
            cache.delete(
                _get_reset_token_key(token)
            )

            raise serializers.ValidationError(
                {
                    "reset_token": [
                        "رمز إعادة التعيين غير صالح."
                    ]
                }
            )

        try:
            user = User.objects.get(
                id=user_id,
                is_active=True,
            )
        except User.DoesNotExist:
            cache.delete(
                _get_reset_token_key(token)
            )

            raise serializers.ValidationError(
                {
                    "reset_token": [
                        "المستخدم غير صالح."
                    ]
                }
            )

        # Django password validation
        try:
            validate_password(
                new_password,
                user=user,
            )
        except serializers.ValidationError as exc:
            raise serializers.ValidationError(
                {
                    "new_password": exc.messages
                }
            )

        attrs["user"] = user
        attrs["reset_token"] = token

        return attrs


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        user = serializer.validated_data["user"]
        reset_token = serializer.validated_data["reset_token"]

        user.set_password(
            serializer.validated_data["new_password"]
        )

        user.save(
            update_fields=[
                "password",
            ]
        )

        # Reset token is single-use.
        cache.delete(
            _get_reset_token_key(reset_token)
        )

        return Response(
            {
                "detail": "تم تغيير كلمة المرور بنجاح."
            },
            status=status.HTTP_200_OK,
        )