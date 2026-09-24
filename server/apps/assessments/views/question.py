
from rest_framework import status, viewsets
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.assessments.models import Assessment, Question

from ..permissions import QuestionPermission
from ..serializers import (
    QuestionCreateSerializer,
    QuestionListSerializer,
    StudentQuestionSerializer,
)


class QuestionViewSet(viewsets.ModelViewSet):
    """
    Nested Question API.

    URLs:

        GET
        /courses/{course_pk}/assessments/{assessment_pk}/questions/

        POST
        /courses/{course_pk}/assessments/{assessment_pk}/questions/

        GET
        /courses/{course_pk}/assessments/{assessment_pk}/questions/{pk}/

        PUT / PATCH
        /courses/{course_pk}/assessments/{assessment_pk}/questions/{pk}/

        DELETE
        /courses/{course_pk}/assessments/{assessment_pk}/questions/{pk}/


    Student:
        - Can view questions of accessible assessments.
        - Cannot see correct answers.
        - Cannot create/update/delete questions.

    Teacher:
        - Can create/update/delete questions
          for assessments belonging to their courses.

    Admin:
        - Full access.
    """

    permission_classes = [
        IsAuthenticated,
        QuestionPermission,
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

    filter_backends = [
        OrderingFilter,
        SearchFilter,
    ]

    search_fields = [
        "text",
        "explanation",
    ]

    ordering_fields = [
        "order",
        "points",
    ]

    ordering = [
        "order",
        "id",
    ]

    # =========================================================
    # Assessment
    # =========================================================

    def get_assessment(self):
        try:
            return (
                Assessment.objects
                .select_related(
                    "course",
                    "course__teacher",
                )
                .get(
                    pk=self.kwargs["assessment_pk"],
                )
            )

        except Assessment.DoesNotExist:
            raise NotFound(
                "Assessment does not exist."
            )

    # =========================================================
    # Queryset
    # =========================================================

    def get_queryset(self):
        assessment = self.get_assessment()

        return (
            Question.objects
            .filter(
                assessment=assessment,
            )
            .prefetch_related(
                "choices",
            )
            .order_by(
                "order",
                "id",
            )
        )

    # =========================================================
    # Serializer
    # =========================================================

    def get_serializer_class(self):
        # -----------------------------------------------------
        # Create / Update
        # -----------------------------------------------------

        if self.action in [
            "create",
            "update",
            "partial_update",
        ]:
            return QuestionCreateSerializer

        # -----------------------------------------------------
        # Student read
        # -----------------------------------------------------

        if self.request.user.role == "STUDENT":
            return StudentQuestionSerializer

        # -----------------------------------------------------
        # Teacher / Admin read
        # -----------------------------------------------------

        return QuestionListSerializer

    # =========================================================
    # Teacher Permission
    # =========================================================

    def check_teacher_permission(self):
        user = self.request.user
        assessment = self.get_assessment()

        # -----------------------------------------------------
        # Admin
        # -----------------------------------------------------

        if user.role == "ADMIN":
            return

        # -----------------------------------------------------
        # Teacher ownership
        # -----------------------------------------------------

        if (
            user.role != "TEACHER"
            or assessment.course.teacher_id != user.id
        ):
            raise PermissionDenied(
                "You do not have permission to manage "
                "this assessment."
            )

    # =========================================================
    # Create
    # =========================================================

    def create(self, request, *args, **kwargs):
        self.check_teacher_permission()

        assessment = self.get_assessment()

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        question = serializer.save(
            assessment=assessment,
        )

        # -----------------------------------------------------
        # Return according to user role
        # -----------------------------------------------------

        response_serializer = self.get_serializer(
            question,
            context=self.get_serializer_context(),
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )

    # =========================================================
    # Update
    # =========================================================

    def perform_update(self, serializer):
        self.check_teacher_permission()

        serializer.save()

    # =========================================================
    # Delete
    # =========================================================

    def perform_destroy(self, instance):
        self.check_teacher_permission()

        instance.delete()
