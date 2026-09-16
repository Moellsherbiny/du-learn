from ..models import User
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from ..otp import generate_otp, verify_otp
from ..emails import send_verification_otp_email

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not isinstance(email, str) or not email.strip():
            return Response(
                {
                    "detail": "البريد الإلكتروني مطلوب.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(otp, str) or not otp.strip():
            return Response(
                {
                    "detail": "رمز التأكيد مطلوب.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = email.strip().lower()
        otp = otp.strip()

        if len(otp) != 6 or not otp.isdigit():
            return Response(
                {
                    "detail": (
                        "رمز التأكيد يجب أن يتكون "
                        "من 6 أرقام."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(
                email__iexact=email,
            )
        except User.DoesNotExist:
            return Response(
                {
                    "detail": "رمز التأكيد غير صالح.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.email_verified:
            return Response(
                {
                    "detail": (
                        "البريد الإلكتروني مؤكد بالفعل."
                    ),
                },
                status=status.HTTP_200_OK,
            )

        success, message = verify_otp(
            user.id,
            otp,
        )

        if not success:
            return Response(
                {
                    "detail": message,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.email_verified = True

        user.save(
            update_fields=[
                "email_verified",
            ],
        )

        return Response(
            {
                "detail": (
                    "تم تأكيد البريد الإلكتروني بنجاح."
                ),
            },
            status=status.HTTP_200_OK,
        )


class ResendVerificationOTPView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email")

        if not isinstance(email, str) or not email.strip():
            return Response(
                {
                    "detail": "البريد الإلكتروني مطلوب.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = email.strip().lower()

        try:
            user = User.objects.get(
                email__iexact=email,
            )
        except User.DoesNotExist:
            # لا نكشف إذا كان البريد مسجلًا أم لا.
            return Response(
                {
                    "detail": (
                        "إذا كان البريد الإلكتروني "
                        "مسجلًا، فسيتم إرسال رمز تأكيد جديد."
                    ),
                },
                status=status.HTTP_200_OK,
            )

        if user.email_verified:
            return Response(
                {
                    "detail": (
                        "البريد الإلكتروني مؤكد بالفعل."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            otp = generate_otp(user.id)

        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        try:
            send_verification_otp_email(
                user=user,
                otp=otp,
            )
        except Exception:
            return Response(
                {
                    "detail": (
                        "تعذر إرسال رمز التأكيد. "
                        "حاول مرة أخرى لاحقًا."
                    ),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "detail": (
                    "تم إرسال رمز تأكيد جديد "
                    "إلى بريدك الإلكتروني."
                ),
            },
            status=status.HTTP_200_OK,
        )
