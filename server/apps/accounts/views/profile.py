
from django.db import transaction

from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import StudentProfile, TeacherProfile, User
from ..serializers import (
    ProfileUserSerializer,
    StudentProfileSerializer,
    TeacherProfileSerializer,
)


class ProfileView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    def get_object(self):
        return self.request.user

    def get_profile(self, user):
        if user.role == User.Role.STUDENT:
            profile, _ = StudentProfile.objects.get_or_create(
                user=user
            )
            return profile

        if user.role == User.Role.TEACHER:
            profile, _ = TeacherProfile.objects.get_or_create(
                user=user
            )
            return profile

        return None

    def get_profile_serializer_class(self, user):
        if user.role == User.Role.STUDENT:
            return StudentProfileSerializer

        if user.role == User.Role.TEACHER:
            return TeacherProfileSerializer

        return None

    def build_response(self, user):
        user_data = ProfileUserSerializer(
            user,
            context={"request": self.request},
        ).data

        profile = self.get_profile(user)

        profile_data = None

        if profile:
            serializer_class = self.get_profile_serializer_class(user)

            profile_data = serializer_class(
                profile,
                context={"request": self.request},
            ).data

        return {
            **user_data,
            "profile": profile_data,
        }

    def get(self, request, *args, **kwargs):
        user = self.get_object()

        return Response(
            self.build_response(user),
            status=status.HTTP_200_OK,
        )

    @transaction.atomic
    def patch(self, request, *args, **kwargs):
        user = self.get_object()

        # -------------------------
        # Update User
        # -------------------------
        user_serializer = ProfileUserSerializer(
            user,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        user_serializer.is_valid(
            raise_exception=True
        )

        user_serializer.save()

        # -------------------------
        # Update Profile
        # -------------------------
        profile = self.get_profile(user)

        if profile:
            serializer_class = self.get_profile_serializer_class(
                user
            )

            profile_serializer = serializer_class(
                profile,
                data=request.data,
                partial=True,
                context={"request": request},
            )

            profile_serializer.is_valid(
                raise_exception=True
            )

            profile_serializer.save()

        # -------------------------
        # Return updated profile
        # -------------------------
        return Response(
            self.build_response(user),
            status=status.HTTP_200_OK,
        )
