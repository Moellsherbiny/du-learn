from django.db import IntegrityError
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import (
    PermissionDenied,
    ValidationError,
)
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.models import User

from .models import Enrollment
from .permissions import IsEnrollmentOwnerTeacherOrAdmin
from .serializers import EnrollmentSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):

    queryset = (
        Enrollment.objects
        .select_related(
            "student",
            "course",
            "course__teacher",
        )
    )

    permission_classes = [
        IsAuthenticated,
        IsEnrollmentOwnerTeacherOrAdmin,
    ]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "student__email",
        "course__title",
        "course__slug",
    ]

    ordering_fields = [
        "enrolled_at",
        "updated_at",
        "expires_at",
        "status",
    ]

    ordering = [
        "-enrolled_at",
    ]

    # =========================================================
    # Queryset
    # =========================================================

    def get_queryset(self):
        user = self.request.user

        queryset = super().get_queryset()

        if user.role == "ADMIN":
            return queryset

        if user.role == "STUDENT":
            return queryset.filter(
                student=user,
            )

        if user.role == "TEACHER":
            return queryset.filter(
                course__teacher=user,
            )

        return queryset.none()

    # =========================================================
    # Serializer
    # =========================================================

    def get_serializer_class(self):
        return EnrollmentSerializer

    # =========================================================
    # Create
    # =========================================================

    def create(self, request, *args, **kwargs):
        user = request.user

        # -----------------------------------------------------
        # Teacher cannot create enrollments
        # -----------------------------------------------------

        if user.role == "TEACHER":
            raise PermissionDenied(
                "Teachers cannot create enrollments."
            )

        # -----------------------------------------------------
        # Get student
        # -----------------------------------------------------

        if user.role == "STUDENT":
            student = user

        elif user.role == "ADMIN":
            student_id = request.data.get(
                "student"
            )

            if not student_id:
                raise ValidationError(
                    {
                        "student": (
                            "Student is required."
                        )
                    }
                )

            student = (
                User.objects
                .filter(
                    id=student_id,
                    role="STUDENT",
                )
                .first()
            )

            if not student:
                raise ValidationError(
                    {
                        "student": (
                            "Student not found."
                        )
                    }
                )

        else:
            raise PermissionDenied(
                "You cannot create enrollments."
            )

        # -----------------------------------------------------
        # Serializer
        # -----------------------------------------------------

        serializer = EnrollmentSerializer(
            data=request.data,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        # -----------------------------------------------------
        # Create
        # -----------------------------------------------------

        try:
            enrollment = serializer.save(
                student=student,
                status=Enrollment.Status.ACTIVE,
            )

        except IntegrityError:
            return Response(
                {
                    "detail": (
                        "This student is already enrolled "
                        "in this course."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        response_serializer = EnrollmentSerializer(
            enrollment,
            context={
                "request": request,
            },
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )

    # =========================================================
    # Update
    # =========================================================

    def perform_update(self, serializer):
        enrollment = self.get_object()
        user = self.request.user

        # Student cannot update.
        if user.role == "STUDENT":
            raise PermissionDenied(
                "Students cannot modify enrollments."
            )

        # Teacher can only modify own courses.
        if (
            user.role == "TEACHER"
            and enrollment.course.teacher_id != user.id
        ):
            raise PermissionDenied(
                "You do not have permission "
                "to modify this enrollment."
            )

        new_status = serializer.validated_data.get(
            "status",
            enrollment.status,
        )

        now = timezone.now()

        if new_status == Enrollment.Status.COMPLETED:

            serializer.save(
                completed_at=(
                    enrollment.completed_at
                    or now
                ),
                suspended_at=None,
                cancelled_at=None,
            )

        elif new_status == Enrollment.Status.SUSPENDED:

            serializer.save(
                suspended_at=(
                    enrollment.suspended_at
                    or now
                ),
                completed_at=None,
                cancelled_at=None,
            )

        elif new_status == Enrollment.Status.CANCELLED:

            serializer.save(
                cancelled_at=(
                    enrollment.cancelled_at
                    or now
                ),
                completed_at=None,
                suspended_at=None,
            )

        elif new_status == Enrollment.Status.ACTIVE:

            serializer.save(
                completed_at=None,
                suspended_at=None,
                cancelled_at=None,
            )

        else:
            serializer.save()

    # =========================================================
    # Delete
    # =========================================================

    def perform_destroy(self, instance):
        user = self.request.user

        if user.role == "STUDENT":
            raise PermissionDenied(
                "Students cannot delete enrollments."
            )

        if (
            user.role == "TEACHER"
            and instance.course.teacher_id != user.id
        ):
            raise PermissionDenied(
                "You do not have permission "
                "to delete this enrollment."
            )

        instance.delete()

    # =========================================================
    # Complete
    # =========================================================

    @action(
        detail=True,
        methods=["post"],
    )
    def complete(self, request, pk=None):

        enrollment = self.get_object()

        if (
            enrollment.status
            == Enrollment.Status.COMPLETED
        ):
            return Response(
                {
                    "detail": (
                        "Enrollment is already completed."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        enrollment.status = (
            Enrollment.Status.COMPLETED
        )
        enrollment.completed_at = timezone.now()
        enrollment.suspended_at = None
        enrollment.cancelled_at = None

        enrollment.save(
            update_fields=[
                "status",
                "completed_at",
                "suspended_at",
                "cancelled_at",
                "updated_at",
            ]
        )

        return Response(
            EnrollmentSerializer(
                enrollment,
                context={
                    "request": request,
                },
            ).data
        )

    # =========================================================
    # Suspend
    # =========================================================

    @action(
        detail=True,
        methods=["post"],
    )
    def suspend(self, request, pk=None):

        enrollment = self.get_object()

        enrollment.status = (
            Enrollment.Status.SUSPENDED
        )
        enrollment.suspended_at = timezone.now()
        enrollment.completed_at = None
        enrollment.cancelled_at = None

        enrollment.save(
            update_fields=[
                "status",
                "suspended_at",
                "completed_at",
                "cancelled_at",
                "updated_at",
            ]
        )

        return Response(
            EnrollmentSerializer(
                enrollment,
                context={
                    "request": request,
                },
            ).data
        )

    # =========================================================
    # Cancel
    # =========================================================

    @action(
        detail=True,
        methods=["post"],
    )
    def cancel(self, request, pk=None):

        enrollment = self.get_object()

        enrollment.status = (
            Enrollment.Status.CANCELLED
        )
        enrollment.cancelled_at = timezone.now()
        enrollment.completed_at = None
        enrollment.suspended_at = None

        enrollment.save(
            update_fields=[
                "status",
                "cancelled_at",
                "completed_at",
                "suspended_at",
                "updated_at",
            ]
        )

        return Response(
            EnrollmentSerializer(
                enrollment,
                context={
                    "request": request,
                },
            ).data
        )