from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import User
from ..serializers import (
    ProfileUserSerializer,
    StudentProfileSerializer,
    TeacherProfileSerializer,
    UserSerializer,
)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get_profile(self, user):
        if user.role == User.Role.STUDENT:
            return user.student_profile

        if user.role == User.Role.TEACHER:
            return user.teacher_profile

        return None

    def get_profile_serializer(self, user):
        if user.role == User.Role.STUDENT:
            return StudentProfileSerializer

        if user.role == User.Role.TEACHER:
            return TeacherProfileSerializer

        return None

    def get(self, request):
        user = request.user

        profile = self.get_profile(user)
        serializer_class = self.get_profile_serializer(user)

        if profile is None or serializer_class is None:
            return Response(
                {
                    "detail": (
                        "هذا الحساب لا يملك "
                        "ملفًا شخصيًا."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "user": UserSerializer(user).data,
                "profile": serializer_class(
                    profile,
                ).data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        return self.update_profile(
            request,
            partial=True,
        )

    def put(self, request):
        return self.update_profile(
            request,
            partial=False,
        )

    def update_profile(
        self,
        request,
        partial=False,
    ):
        user = request.user

        profile = self.get_profile(user)
        serializer_class = self.get_profile_serializer(user)

        if profile is None or serializer_class is None:
            return Response(
                {
                    "detail": (
                        "هذا الحساب لا يملك "
                        "ملفًا شخصيًا."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        profile_serializer = serializer_class(
            profile,
            data=request.data,
            partial=partial,
        )

        profile_serializer.is_valid(
            raise_exception=True,
        )

        profile_serializer.save()

        return Response(
            {
                "user": UserSerializer(user).data,
                "profile": profile_serializer.data,
            },
            status=status.HTTP_200_OK,
        )