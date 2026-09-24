
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.progress.models import CourseProgress

from ..permissions import CourseProgressPermission
from ..serializers import CourseProgressSerializer


class CourseProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Course-level progress.

    Responsible for:
    - Listing progress records
    - Retrieving a single progress record
    """

    permission_classes = [
        IsAuthenticated,
        CourseProgressPermission,
    ]

    serializer_class = CourseProgressSerializer

    def get_queryset(self):
        user = self.request.user

        queryset = (
            CourseProgress.objects
            .select_related(
                "student",
                "course",
                "last_lesson",
            )
        )

        # -----------------------------------------------------
        # Student
        # -----------------------------------------------------

        if user.role == "STUDENT":
            return queryset.filter(
                student=user,
            )

        # -----------------------------------------------------
        # Teacher
        # -----------------------------------------------------

        if user.role == "TEACHER":
            return queryset.filter(
                course__teacher=user,
            )

        # -----------------------------------------------------
        # Admin
        # -----------------------------------------------------

        if user.role == "ADMIN":
            return queryset

        return queryset.none()
