
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from allauth.account.utils import user_pk_to_url_str
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import (
    LoginSerializer as DefaultLoginSerializer,
    PasswordResetSerializer,
    UserDetailsSerializer,
)

from rest_framework import serializers

from .services.emails import send_verification_otp_email
from .models import StudentProfile, TeacherProfile, User
from .services.otp import generate_otp


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
        )

        read_only_fields = (
            "id",
            "email",
            "role",
            "email_verified",
        )


class LoginSerializer(DefaultLoginSerializer):
    username = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    email = serializers.EmailField(
        required=True,
    )

    def validate(self, attrs):
        attrs["username"] = attrs["email"]

        return super().validate(attrs)


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

        otp = generate_otp(user.id)

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


class ProfileUserSerializer(serializers.ModelSerializer):
    class Meta:
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

        extra_kwargs = {
            "first_name": {
                "required": False,
                "max_length": 150,
            },
            "last_name": {
                "required": False,
                "max_length": 150,
            },
            "image": {
                "required": False,
                "allow_null": True,
            },
        }


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile

        fields = (
            "bio",
            "phone",
            "date_of_birth",
            "school",
            "grade_level",
            "city",
            "country",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "created_at",
            "updated_at",
        )

        extra_kwargs = {
            "bio": {
                "required": False,
                "allow_blank": True,
            },
            "phone": {
                "required": False,
                "allow_blank": True,
                "max_length": 30,
            },
            "date_of_birth": {
                "required": False,
                "allow_null": True,
            },
            "school": {
                "required": False,
                "allow_blank": True,
                "max_length": 255,
            },
            "grade_level": {
                "required": False,
                "allow_blank": True,
                "max_length": 100,
            },
            "city": {
                "required": False,
                "allow_blank": True,
                "max_length": 100,
            },
            "country": {
                "required": False,
                "allow_blank": True,
                "max_length": 100,
            },
        }


class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile

        fields = (
            "bio",
            "phone",
            "specialization",
            "qualification",
            "years_of_experience",
            "city",
            "country",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "created_at",
            "updated_at",
        )

        extra_kwargs = {
            "bio": {
                "required": False,
                "allow_blank": True,
            },
            "phone": {
                "required": False,
                "allow_blank": True,
                "max_length": 30,
            },
            "specialization": {
                "required": False,
                "allow_blank": True,
                "max_length": 255,
            },
            "qualification": {
                "required": False,
                "allow_blank": True,
                "max_length": 255,
            },
            "years_of_experience": {
                "required": False,
                "min_value": 0,
                "max_value": 60,
            },
            "city": {
                "required": False,
                "allow_blank": True,
                "max_length": 100,
            },
            "country": {
                "required": False,
                "allow_blank": True,
                "max_length": 100,
            },
        }






class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        required=True,
        write_only=True,
        trim_whitespace=False,
    )

    new_password = serializers.CharField(
        required=True,
        write_only=True,
        trim_whitespace=False,
    )

    confirm_password = serializers.CharField(
        required=True,
        write_only=True,
        trim_whitespace=False,
    )

    def validate_current_password(self, value):
        user = self.context["request"].user

        if not user.check_password(value):
            raise serializers.ValidationError(
                "كلمة المرور الحالية غير صحيحة."
            )

        return value

    def validate(self, attrs):
        new_password = attrs.get(
            "new_password"
        )
        confirm_password = attrs.get(
            "confirm_password"
        )

        if new_password != confirm_password:
            raise serializers.ValidationError(
                {
                    "confirm_password": [
                        "كلمتا المرور غير متطابقتين."
                    ]
                }
            )

        user = self.context["request"].user

        if user.check_password(new_password):
            raise serializers.ValidationError(
                {
                    "new_password": [
                        "كلمة المرور الجديدة يجب أن تختلف عن كلمة المرور الحالية."
                    ]
                }
            )

        validate_password(
            new_password,
            user=user,
        )

        return attrs


class PasswordResetVerifySerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    otp = serializers.CharField(
        required=True,
        max_length=6,
        min_length=6,
        trim_whitespace=True,
    )