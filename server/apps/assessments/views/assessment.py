from django.db import transaction

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.assessments.models import Assessment
from apps.enrollments.models import Enrollment

from ..permissions import AssessmentPermission
from ..serializers import (
    AssessmentCreateSerializer,
    AssessmentDetailSerializer,
    AssessmentListSerializer,
    StudentAssessmentSerializer,
)


class AssessmentViewSet(viewsets.ModelViewSet):
    """
    Assessment CRUD API.

    Teacher:
        - Create assessments for owned courses
        - View own course assessments
        - Update assessments
        - Delete assessments
        - Publish / unpublish assessments

    Student:
        - View published assessments only
        - Only assessments from enrolled courses

    Admin:
        - Full access
    """

    permission_classes = [
        IsAuthenticated,
        AssessmentPermission,
    ]

    http_method_names = [
        "get",
        "post",
        "put",
        "patch",
        "delete",
        "head",
        "options",
    ]

    # =========================================================
    # Queryset
    # =========================================================

    def get_queryset(self):
        user = self.request.user
        

        queryset = (
            Assessment.objects
            .select_related(
                "course",
                "lesson",
            )
            .prefetch_related(
                "questions__choices",
            )
        )

        # -----------------------------------------------------
        # Student
        # -----------------------------------------------------

        if user.role == "STUDENT":
            queryset = queryset.filter(
                is_published=True,
                course__enrollments__student=user,
                course__enrollments__status="ACTIVE",
            ).distinct()

        # -----------------------------------------------------
        # Teacher
        # -----------------------------------------------------

        elif user.role == "TEACHER":
            queryset = queryset.filter(
                course__teacher=user,
            )

        # -----------------------------------------------------
        # Admin
        # -----------------------------------------------------

        elif user.role == "ADMIN":
            pass

        # -----------------------------------------------------
        # Unknown role
        # -----------------------------------------------------

        else:
            queryset = queryset.none()

        return queryset

    # =========================================================
    # Serializer
    # =========================================================

    def get_serializer_class(self):
        # Student retrieving an assessment
        # must NOT receive correct answers.
        if self.action == "retrieve":
            if self.request.user.role == "STUDENT":
                return StudentAssessmentSerializer

            return AssessmentDetailSerializer

        # Teacher/Admin create/update
        if self.action in [
            "create",
            "update",
            "partial_update",
        ]:
            return AssessmentCreateSerializer

        # List
        return AssessmentListSerializer

    # =========================================================
    # Serializer Context
    # =========================================================

    def get_serializer_context(self):
        context = super().get_serializer_context()

        course_id = (
            self.kwargs.get("course_pk")
            or self.request.data.get("course")
        )

        if course_id:
            from apps.courses.models import Course

            course = (
                Course.objects
                .filter(pk=course_id)
                .first()
            )

            if course:
                context["course"] = course

        return context

    # =========================================================
    # Create
    # =========================================================

    def create(self, request, *args, **kwargs):
        """
        Create an assessment.

        Expected URL:

            POST /courses/{course_pk}/assessments/
        """

        course_id = (
            self.kwargs.get("course_pk")
            or request.data.get("course")
        )

        if not course_id:
            return Response(
                {
                    "detail": "Course is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        from apps.courses.models import Course

        course = (
            Course.objects
            .filter(pk=course_id)
            .first()
        )

        if not course:
            return Response(
                {
                    "detail": "Course not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # -----------------------------------------------------
        # Teacher ownership
        # -----------------------------------------------------

        if (
            request.user.role == "TEACHER"
            and course.teacher_id != request.user.id
        ):
            raise PermissionDenied(
                "You can only create assessments for your own courses."
            )

        serializer = self.get_serializer(
            data=request.data,
            context={
                **self.get_serializer_context(),
                "course": course,
            },
        )

        serializer.is_valid(
            raise_exception=True
        )

        with transaction.atomic():
            assessment = serializer.save(
                course=course,
            )

        # -----------------------------------------------------
        # Return detail response
        # -----------------------------------------------------

        output_serializer = AssessmentDetailSerializer(
            assessment,
            context={
                "request": request,
            },
        )

        headers = self.get_success_headers(
            output_serializer.data
        )

        return Response(
            output_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    # =========================================================
    # Update
    # =========================================================

    def update(
        self,
        request,
        *args,
        **kwargs,
    ):
        """
        Update an assessment.

        Course cannot be changed after creation.
        """

        assessment = self.get_object()

        # -----------------------------------------------------
        # Prevent changing course
        # -----------------------------------------------------

        if "course" in request.data:
            return Response(
                {
                    "course": (
                        "Course cannot be changed "
                        "after assessment creation."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -----------------------------------------------------
        # Validate serializer
        # -----------------------------------------------------

        serializer = self.get_serializer(
            assessment,
            data=request.data,
            partial=kwargs.pop(
                "partial",
                False,
            ),
            context={
                **self.get_serializer_context(),
                "course": assessment.course,
            },
        )

        serializer.is_valid(
            raise_exception=True
        )

        with transaction.atomic():
            assessment = serializer.save()

        # -----------------------------------------------------
        # Return updated assessment
        # -----------------------------------------------------

        return Response(
            AssessmentDetailSerializer(
                assessment,
                context={
                    "request": request,
                },
            ).data,
            status=status.HTTP_200_OK,
        )

    # =========================================================
    # Partial Update
    # =========================================================

    def partial_update(
        self,
        request,
        *args,
        **kwargs,
    ):
        kwargs["partial"] = True

        return self.update(
            request,
            *args,
            **kwargs,
        )

    # =========================================================
    # Delete
    # =========================================================

    def destroy(
        self,
        request,
        *args,
        **kwargs,
    ):
        """
        Delete an assessment.

        Assessment cannot be deleted once students
        have started attempts.
        """

        assessment = self.get_object()

        # -----------------------------------------------------
        # Don't allow deleting assessment with attempts
        # -----------------------------------------------------

        if assessment.attempts.exists():
            return Response(
                {
                    "detail": (
                        "This assessment cannot be deleted "
                        "because it already has attempts."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        assessment.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

    # =========================================================
    # Publish
    # =========================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="publish",
    )
    def publish(
        self,
        request,
        pk=None,
    ):
        """
        Publish an assessment.

        An assessment cannot be published without questions.
        """

        assessment = self.get_object()

        # -----------------------------------------------------
        # Check questions
        # -----------------------------------------------------

        if not assessment.questions.exists():
            return Response(
                {
                    "detail": (
                        "Assessment cannot be published "
                        "without questions."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -----------------------------------------------------
        # Already published
        # -----------------------------------------------------

        if assessment.is_published:
            return Response(
                {
                    "detail": (
                        "Assessment is already published."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -----------------------------------------------------
        # Publish
        # -----------------------------------------------------

        assessment.is_published = True

        assessment.save(
            update_fields=[
                "is_published",
                "updated_at",
            ]
        )

        return Response(
            AssessmentDetailSerializer(
                assessment,
                context={
                    "request": request,
                },
            ).data,
            status=status.HTTP_200_OK,
        )

    # =========================================================
    # Unpublish
    # =========================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="unpublish",
    )
    def unpublish(
        self,
        request,
        pk=None,
    ):
        """
        Unpublish an assessment.
        """

        assessment = self.get_object()

        # -----------------------------------------------------
        # Already unpublished
        # -----------------------------------------------------

        if not assessment.is_published:
            return Response(
                {
                    "detail": (
                        "Assessment is already unpublished."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -----------------------------------------------------
        # Unpublish
        # -----------------------------------------------------

        assessment.is_published = False

        assessment.save(
            update_fields=[
                "is_published",
                "updated_at",
            ]
        )

        return Response(
            AssessmentDetailSerializer(
                assessment,
                context={
                    "request": request,
                },
            ).data,
            status=status.HTTP_200_OK,
        )

