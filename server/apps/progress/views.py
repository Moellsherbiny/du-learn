from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.progress.models import CourseProgress
from .serializers import CourseProgressSerializer
from .permissions import CourseProgressPermission


class CourseProgressViewSet(viewsets.ReadOnlyModelViewSet):
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

        if user.role == "STUDENT":
            return queryset.filter(student=user)

        if user.role == "TEACHER":
            return queryset.filter(
                course__teacher=user
            )

        if user.role == "ADMIN":
            return queryset

        return queryset.none()