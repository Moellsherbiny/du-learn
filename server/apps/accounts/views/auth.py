from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import User
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated
from allauth.account.utils import user_pk_to_url_str
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import (
    LoginSerializer as DefaultLoginSerializer,
    PasswordResetSerializer,
    UserDetailsSerializer,
)

from rest_framework import serializers
from ..otp import generate_otp
from ..emails import send_verification_otp_email




class UserSerializer(UserDetailsSerializer):
    email_verified = serializers.BooleanField(
        read_only=True,
    )

    class Meta(UserDetailsSerializer.Meta):
        model = User

        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "email_verified",
            "image",
        )

        read_only_fields = (
            "id",
            "email",
            "role",
            "email_verified",
        )

class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not isinstance(email, str) or not email.strip():
            return Response(
                {
                    "detail": "البريد الإلكتروني مطلوب."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(password, str) or not password:
            return Response(
                {
                    "detail": "كلمة المرور مطلوبة."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = email.strip().lower()

        user = authenticate(
            request=request,
            username=email,
            password=password,
        )

        if user is None:
            return Response(
                {
                    "detail": (
                        "البريد الإلكتروني أو "
                        "كلمة المرور غير صحيحة."
                    )
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {
                    "detail": "هذا الحساب غير نشط."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        access_token = str(access)
        refresh_token = str(refresh)

        response = Response(
            {
                "access": access_token,
                "refresh": refresh_token,
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

        rest_auth = getattr(
            settings,
            "REST_AUTH",
            {},
        )

        access_cookie = rest_auth.get(
            "JWT_AUTH_COOKIE",
            "access_token",
        )

        refresh_cookie = rest_auth.get(
            "JWT_AUTH_REFRESH_COOKIE",
            "refresh_token",
        )

        response.set_cookie(
            key=access_cookie,
            value=access_token,
            httponly=True,
            secure=rest_auth.get(
                "JWT_AUTH_SECURE",
                False,
            ),
            samesite=rest_auth.get(
                "JWT_AUTH_SAMESITE",
                "Lax",
            ),
            path="/",
        )

        response.set_cookie(
            key=refresh_cookie,
            value=refresh_token,
            httponly=True,
            secure=rest_auth.get(
                "JWT_AUTH_SECURE",
                False,
            ),
            samesite=rest_auth.get(
                "JWT_AUTH_SAMESITE",
                "Lax",
            ),
            path="/",
        )

        return response  

class RegistrationSerializer(RegisterSerializer):
    username = None

    email = serializers.EmailField(
        required=True,
    )

    first_name = serializers.CharField(
        required=True,
        max_length=150,
    )

    last_name = serializers.CharField(
        required=True,
        max_length=150,
    )

    def get_cleaned_data(self):
        data = super().get_cleaned_data()

        data["email"] = self.validated_data.get("email")
        data["first_name"] = self.validated_data.get(
            "first_name"
        )
        data["last_name"] = self.validated_data.get(
            "last_name"
        )

        return data

    def save(self, request):
        user = super().save(request)

        user.first_name = self.validated_data[
            "first_name"
        ]
        user.last_name = self.validated_data[
            "last_name"
        ]
        user.email_verified = False

        user.save(
            update_fields=[
                "first_name",
                "last_name",
                "email_verified",
            ]
        )

        # Generate a new OTP.
        otp = generate_otp(user.id)

        # Send OTP to the user's email.
        send_verification_otp_email(
            user=user,
            otp=otp,
        )

        return user


class CustomPasswordResetSerializer(
    PasswordResetSerializer
):
    def get_email_options(self):
        frontend_url = getattr(
            settings,
            "FRONTEND_URL",
            "http://localhost:3000",
        ).rstrip("/")

        def url_generator(
            request,
            user,
            temp_key,
        ):
            uid = user_pk_to_url_str(user)

            return (
                f"{frontend_url}/reset-password/"
                f"{uid}/{temp_key}"
            )

        return {
            "url_generator": url_generator,
        }


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response(
            {"detail": "تم تسجيل الخروج بنجاح."},
            status=status.HTTP_200_OK,
        )

        access_cookie = getattr(
            settings,
            "REST_AUTH",
            {},
        ).get("JWT_AUTH_COOKIE", "access_token")

        refresh_cookie = getattr(
            settings,
            "REST_AUTH",
            {},
        ).get("JWT_AUTH_REFRESH_COOKIE", "refresh_token")

        response.delete_cookie(
            access_cookie,
            path="/",
        )

        response.delete_cookie(
            refresh_cookie,
            path="/",
        )

        return response



class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
       
        return Response(
            UserSerializer(request.user).data,
            status=status.HTTP_200_OK,
        )

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        rest_auth = getattr(settings, "REST_AUTH", {})

        refresh_cookie = rest_auth.get(
            "JWT_AUTH_REFRESH_COOKIE",
            "refresh_token",
        )

        refresh_token = request.COOKIES.get(refresh_cookie)
        if not refresh_token:
            return Response(
                {"detail": "Refresh token غير موجود."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = TokenRefreshSerializer(
            data={
                "refresh": refresh_token,
            }
        )

        try:
            serializer.is_valid(raise_exception=True)

        except TokenError as exc:
            print("🔥 REFRESH TOKEN ERROR:", str(exc))

            return Response(
                {
                    "detail": "Refresh token غير صالح أو منتهي.",
                    "error": str(exc),
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        access_token = serializer.validated_data["access"]

        response = Response(
            {
                "access": access_token,
            },
            status=status.HTTP_200_OK,
        )

        access_cookie = rest_auth.get(
            "JWT_AUTH_COOKIE",
            "access_token",
        )

        response.set_cookie(
            key=access_cookie,
            value=access_token,
            httponly=True,
            secure=rest_auth.get(
                "JWT_AUTH_SECURE",
                False,
            ),
            samesite=rest_auth.get(
                "JWT_AUTH_SAMESITE",
                "Lax",
            ),
            path="/",
        )

        return response