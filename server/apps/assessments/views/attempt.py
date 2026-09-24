
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.assessments.models import AssessmentAttempt

from ..permissions import AttemptPermission
from ..serializers import (
    AnswerSerializer,
    AssessmentAttemptSerializer,
    SubmitAnswerSerializer,
)
from ..services.attempt_service import (
    AssessmentAttemptService,
)


class AssessmentAttemptViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    Assessment Attempts API.

    Business logic is handled by AssessmentAttemptService.

    Endpoints:

        GET
        /assessment-attempts/

        GET
        /assessment-attempts/{id}/

        POST
        /assessment-attempts/start/

        POST
        /assessment-attempts/{id}/answer/

        POST
        /assessment-attempts/{id}/submit/

        POST
        /assessment-attempts/{id}/abandon/
    """

    permission_classes = [
        IsAuthenticated,
        AttemptPermission,
    ]

    http_method_names = [
        "get",
        "post",
        "head",
        "options",
    ]

    # =========================================================
    # Queryset
    # =========================================================

    def get_queryset(self):
        user = self.request.user

        queryset = (
            AssessmentAttempt.objects
            .select_related(
                "assessment",
                "assessment__course",
                "assessment__lesson",
                "student",
            )
            .prefetch_related(
                "answers__selected_choices",
            )
            .order_by(
                "-created_at",
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
                assessment__course__teacher=user,
            )

        # -----------------------------------------------------
        # Admin
        # -----------------------------------------------------

        if user.role == "ADMIN":
            return queryset

        # -----------------------------------------------------
        # Unknown role
        # -----------------------------------------------------

        return queryset.none()

    # =========================================================
    # Serializer
    # =========================================================

    def get_serializer_class(self):
        if self.action == "answer":
            return SubmitAnswerSerializer

        return AssessmentAttemptSerializer

    # =========================================================
    # Start Attempt
    # =========================================================

    @action(
        detail=False,
        methods=["post"],
        url_path="start",
    )
    def start(self, request):
        """
        Start an assessment attempt.

        If the student already has an active attempt,
        the existing attempt is returned.
        """

        # -----------------------------------------------------
        # Student only
        # -----------------------------------------------------

        if request.user.role != "STUDENT":
            raise PermissionDenied(
                "Only students can start assessment attempts."
            )

        # -----------------------------------------------------
        # Assessment ID
        # -----------------------------------------------------

        assessment_id = request.data.get(
            "assessment_id"
        )

        if not assessment_id:
            return Response(
                {
                    "detail": (
                        "assessment_id is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -----------------------------------------------------
        # Start / get attempt
        # -----------------------------------------------------

        attempt = AssessmentAttemptService.start(
            student=request.user,
            assessment_id=assessment_id,
        )

        # -----------------------------------------------------
        # Response
        # -----------------------------------------------------

        return Response(
            AssessmentAttemptSerializer(
                attempt,
                context={
                    "request": request,
                },
            ).data,
            status=status.HTTP_201_CREATED,
        )

    # =========================================================
    # Answer
    # =========================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="answer",
    )
    def answer(
        self,
        request,
        pk=None,
    ):
        """
        Save/update an answer.

        IMPORTANT:
        Answer is saved only.
        It is NOT graded here.
        """

        attempt = self.get_object()

        # -----------------------------------------------------
        # Student ownership
        # -----------------------------------------------------

        if (
            request.user.role == "STUDENT"
            and attempt.student_id != request.user.id
        ):
            raise PermissionDenied(
                "You can only answer your own attempt."
            )

        # -----------------------------------------------------
        # Validate payload
        # -----------------------------------------------------

        serializer = SubmitAnswerSerializer(
            data=request.data,
            context={
                "request": request,
                "attempt": attempt,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        question = serializer.validated_data[
            "question"
        ]

        choices = serializer.validated_data.get(
            "choices",
            [],
        )

        text_answer = serializer.validated_data.get(
            "text_answer",
            "",
        )

        # -----------------------------------------------------
        # Save answer through service
        # -----------------------------------------------------

        answer, created = (
            AssessmentAttemptService.save_answer(
                attempt=attempt,
                question=question,
                choices=choices,
                text_answer=text_answer,
            )
        )

        # -----------------------------------------------------
        # Return answer
        # -----------------------------------------------------

        return Response(
            AnswerSerializer(
                answer,
                context={
                    "request": request,
                },
            ).data,
            status=(
                status.HTTP_201_CREATED
                if created
                else status.HTTP_200_OK
            ),
        )

    # =========================================================
    # Submit
    # =========================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="submit",
    )
    def submit(
        self,
        request,
        pk=None,
    ):
        """
        Submit an assessment attempt.

        All answers are graded by the service.
        """

        attempt = self.get_object()

        # -----------------------------------------------------
        # Student ownership
        # -----------------------------------------------------

        if (
            request.user.role == "STUDENT"
            and attempt.student_id != request.user.id
        ):
            raise PermissionDenied(
                "You can only submit your own attempt."
            )

        # -----------------------------------------------------
        # Submit through service
        # -----------------------------------------------------

        attempt = AssessmentAttemptService.submit(
            attempt=attempt,
        )

        # -----------------------------------------------------
        # Return result
        # -----------------------------------------------------

        return Response(
            AssessmentAttemptSerializer(
                attempt,
                context={
                    "request": request,
                },
            ).data,
            status=status.HTTP_200_OK,
        )

    # =========================================================
    # Abandon
    # =========================================================

    @action(
        detail=True,
        methods=["post"],
        url_path="abandon",
    )
    def abandon(
        self,
        request,
        pk=None,
    ):
        """
        Abandon an active assessment attempt.
        """

        attempt = self.get_object()

        # -----------------------------------------------------
        # Student ownership
        # -----------------------------------------------------

        if (
            request.user.role == "STUDENT"
            and attempt.student_id != request.user.id
        ):
            raise PermissionDenied(
                "You can only abandon your own attempt."
            )

        # -----------------------------------------------------
        # Abandon through service
        # -----------------------------------------------------

        attempt = AssessmentAttemptService.abandon(
            attempt,
        )

        # -----------------------------------------------------
        # Return result
        # -----------------------------------------------------

        return Response(
            AssessmentAttemptSerializer(
                attempt,
                context={
                    "request": request,
                },
            ).data,
            status=status.HTTP_200_OK,
        )
