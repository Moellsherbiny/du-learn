
from rest_framework import status, viewsets
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.assessments.models import Choice, Question

from ..serializers import (
    ChoiceSerializer,
    StudentChoiceSerializer,
)


class ChoiceViewSet(viewsets.ModelViewSet):
    """
    Nested Choice API.

    URLs:

        GET    /courses/{course_pk}/assessments/{assessment_pk}/questions/{question_pk}/choices/
        POST   /courses/{course_pk}/assessments/{assessment_pk}/questions/{question_pk}/choices/

        GET    /courses/{course_pk}/assessments/{assessment_pk}/questions/{question_pk}/choices/{pk}/
        PUT    /courses/{course_pk}/assessments/{assessment_pk}/questions/{question_pk}/choices/{pk}/
        PATCH  /courses/{course_pk}/assessments/{assessment_pk}/questions/{question_pk}/choices/{pk}/
        DELETE /courses/{course_pk}/assessments/{assessment_pk}/questions/{question_pk}/choices/{pk}/

    Student:
        - Can read choices.
        - Cannot create/update/delete choices.
        - Cannot see is_correct.

    Teacher:
        - Can manage choices for questions belonging to own courses.

    Admin:
        - Full access.
    """

    permission_classes = [
        IsAuthenticated,
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

    ordering = [
        "order",
        "id",
    ]

    # =========================================================
    # Serializer
    # =========================================================

    def get_serializer_class(self):
        # -----------------------------------------------------
        # Student
        # -----------------------------------------------------

        if (
            self.request.user.role == "STUDENT"
            and self.action in [
                "list",
                "retrieve",
            ]
        ):
            return StudentChoiceSerializer

        # -----------------------------------------------------
        # Teacher / Admin
        # -----------------------------------------------------

        return ChoiceSerializer

    # =========================================================
    # Question
    # =========================================================

    def get_question(self):
        try:
            return (
                Question.objects
                .select_related(
                    "assessment",
                    "assessment__course",
                )
                .get(
                    pk=self.kwargs["question_pk"],
                    assessment_id=self.kwargs[
                        "assessment_pk"
                    ],
                )
            )

        except Question.DoesNotExist:
            raise NotFound(
                "Question does not exist."
            )

    # =========================================================
    # Queryset
    # =========================================================

    def get_queryset(self):
        question = self.get_question()

        queryset = Choice.objects.filter(
            question=question,
        )

        # -----------------------------------------------------
        # Students should never receive correct answers
        # -----------------------------------------------------

        if self.request.user.role == "STUDENT":
            queryset = queryset.only(
                "id",
                "question",
                "text",
                "order",
            )

        return queryset.order_by(
            "order",
            "id",
        )

    # =========================================================
    # Teacher Permission
    # =========================================================

    def check_teacher_permission(self):
        user = self.request.user
        question = self.get_question()

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
            or question.assessment.course.teacher_id
            != user.id
        ):
            raise PermissionDenied(
                "You do not have permission "
                "to manage this question."
            )

    # =========================================================
    # Create
    # =========================================================

    def create(self, request, *args, **kwargs):
        self.check_teacher_permission()

        question = self.get_question()

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        choice = serializer.save(
            question=question,
        )

        return Response(
            self.get_serializer(choice).data,
            status=status.HTTP_201_CREATED,
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
        self.check_teacher_permission()

        return super().update(
            request,
            *args,
            **kwargs,
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
        self.check_teacher_permission()

        return super().partial_update(
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
        self.check_teacher_permission()

        return super().destroy(
            request,
            *args,
            **kwargs,
        )

