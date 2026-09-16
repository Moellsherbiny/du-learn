from datetime import timedelta
from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.assessments.models import (
    Answer,
    AnswerChoice,
    Assessment,
    AssessmentAttempt,
    Choice,
    Question,
)
from apps.enrollments.models import Enrollment

from ..permissions import AttemptPermission
from ..serializers import (
    AnswerSerializer,
    AssessmentAttemptSerializer,
    SubmitAnswerSerializer,
)


class AssessmentAttemptViewSet(viewsets.ModelViewSet):

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
        queryset = (
            AssessmentAttempt.objects
            .select_related(
                "assessment",
                "student",
            )
            .prefetch_related(
                "answers__answer_choices",
            )
        )

        if self.request.user.role == "STUDENT":
            queryset = queryset.filter(
                student=self.request.user
            )

        return queryset

    # =========================================================
    # Serializer
    # =========================================================

    def get_serializer_class(self):
        if self.action == "answer":
            return SubmitAnswerSerializer

        return AssessmentAttemptSerializer

    # =========================================================
    # Helpers
    # =========================================================

    def get_attempt(self, pk):
        attempt = self.get_queryset().filter(
            pk=pk
        ).first()

        if not attempt:
            raise NotFound(
                "Assessment attempt not found."
            )

        return attempt

    def is_expired(self, attempt):
        if not attempt.assessment.time_limit_minutes:
            return False

        expires_at = (
            attempt.started_at
            + timedelta(
                minutes=attempt.assessment.time_limit_minutes
            )
        )

        return timezone.now() >= expires_at

    def expire_attempt(self, attempt):
        attempt.status = (
            AssessmentAttempt.Status.EXPIRED
        )
        attempt.submitted_at = timezone.now()

        attempt.save(
            update_fields=[
                "status",
                "submitted_at",
                "updated_at",
            ]
        )

    def check_attempt(self, attempt):
        if (
            attempt.status
            != AssessmentAttempt.Status.IN_PROGRESS
        ):
            return Response(
                {
                    "detail": (
                        "This attempt is no longer active."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if self.is_expired(attempt):
            self.expire_attempt(attempt)

            return Response(
                {
                    "detail": "This attempt has expired."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return None

    # =========================================================
    # Start
    # =========================================================

    @action(
        detail=False,
        methods=["post"],
    )
    def start(self, request):

        if request.user.role != "STUDENT":
            raise PermissionDenied(
                "Only students can start an assessment."
            )

        assessment_id = request.data.get(
            "assessment_id"
        )

        if not assessment_id:
            return Response(
                {
                    "detail": "assessment_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        assessment = (
            Assessment.objects
            .filter(
                id=assessment_id,
                is_published=True,
            )
            .first()
        )

        if not assessment:
            raise NotFound(
                "Assessment not found."
            )

        # Student must be enrolled.
        enrolled = Enrollment.objects.filter(
            student=request.user,
            course=assessment.course,
            status="ACTIVE",
        ).exists()

        if not enrolled:
            raise PermissionDenied(
                "You are not enrolled in this course."
            )

        # Return existing active attempt.
        active_attempt = (
            AssessmentAttempt.objects
            .filter(
                assessment=assessment,
                student=request.user,
                status=(
                    AssessmentAttempt
                    .Status
                    .IN_PROGRESS
                ),
            )
            .first()
        )

        if active_attempt:

            if self.is_expired(active_attempt):
                self.expire_attempt(active_attempt)

            else:
                return Response(
                    AssessmentAttemptSerializer(
                        active_attempt,
                        context={
                            "request": request,
                        },
                    ).data
                )

        # Check max attempts.
        attempts_count = (
            AssessmentAttempt.objects
            .filter(
                assessment=assessment,
                student=request.user,
            )
            .count()
        )

        if (
            assessment.max_attempts is not None
            and attempts_count
            >= assessment.max_attempts
        ):
            return Response(
                {
                    "detail": (
                        "Maximum attempts reached."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        questions = assessment.questions.all()

        if not questions.exists():
            return Response(
                {
                    "detail": (
                        "Assessment has no questions."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        max_score = sum(
            question.points
            for question in questions
        )

        attempt = AssessmentAttempt.objects.create(
            assessment=assessment,
            student=request.user,
            attempt_number=attempts_count + 1,
            status=(
                AssessmentAttempt
                .Status
                .IN_PROGRESS
            ),
            score=Decimal("0"),
            max_score=max_score,
            percentage=Decimal("0"),
            passed=False,
        )

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
    )
    def answer(self, request, pk=None):

        attempt = self.get_attempt(pk)

        if attempt.student_id != request.user.id:
            raise PermissionDenied(
                "You cannot answer this attempt."
            )

        error = self.check_attempt(attempt)

        if error:
            return error

        serializer = SubmitAnswerSerializer(
            data=request.data,
            context={
                "attempt": attempt,
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True
        )

        question = serializer.validated_data[
            "question"
        ]

        choices = serializer.validated_data.get(
            "choices",
            []
        )

        text_answer = serializer.validated_data.get(
            "text_answer",
            ""
        )

        answer, _ = Answer.objects.update_or_create(
            attempt=attempt,
            question=question,
            defaults={
                "text_answer": text_answer,
            },
        )

        AnswerChoice.objects.filter(
            answer=answer
        ).delete()

        if choices:
            AnswerChoice.objects.bulk_create(
                [
                    AnswerChoice(
                        answer=answer,
                        choice=choice,
                    )
                    for choice in choices
                ]
            )

        self.grade_answer(
            answer,
            question,
            choices,
        )

        return Response(
            AnswerSerializer(
                answer,
                context={
                    "request": request,
                },
            ).data
        )

    # =========================================================
    # Grade
    # =========================================================

    def grade_answer(
        self,
        answer,
        question,
        choices,
    ):

        if (
            question.type
            == Question.QuestionType.SHORT_TEXT
        ):
            answer.is_correct = None
            answer.points_earned = 0

        else:
            correct_ids = set(
                Choice.objects.filter(
                    question=question,
                    is_correct=True,
                ).values_list(
                    "id",
                    flat=True,
                )
            )

            selected_ids = {
                choice.id
                for choice in choices
            }

            answer.is_correct = (
                selected_ids == correct_ids
            )

            answer.points_earned = (
                question.points
                if answer.is_correct
                else 0
            )

        answer.save(
            update_fields=[
                "is_correct",
                "points_earned",
            ]
        )

    # =========================================================
    # Submit
    # =========================================================

    @action(
        detail=True,
        methods=["post"],
    )
    def submit(self, request, pk=None):

        attempt = self.get_attempt(pk)

        if attempt.student_id != request.user.id:
            raise PermissionDenied(
                "You cannot submit this attempt."
            )

        error = self.check_attempt(attempt)

        if error:
            return error

        answers = Answer.objects.filter(
            attempt=attempt
        )

        score = sum(
            (
                answer.points_earned or 0
                for answer in answers
            ),
            Decimal("0"),
        )

        max_score = sum(
            (
                question.points
                for question
                in attempt.assessment.questions.all()
            ),
            Decimal("0"),
        )

        percentage = (
            (score * Decimal("100")) / max_score
            if max_score
            else Decimal("0")
        )

        passed = (
            percentage
            >= attempt.assessment.passing_score
        )

        attempt.score = score
        attempt.max_score = max_score
        attempt.percentage = percentage
        attempt.passed = passed
        attempt.status = (
            AssessmentAttempt
            .Status
            .SUBMITTED
        )
        attempt.submitted_at = timezone.now()

        attempt.save(
            update_fields=[
                "score",
                "max_score",
                "percentage",
                "passed",
                "status",
                "submitted_at",
                "updated_at",
            ]
        )

        return Response(
            AssessmentAttemptSerializer(
                attempt,
                context={
                    "request": request,
                },
            ).data
        )

    # =========================================================
    # Abandon
    # =========================================================

    @action(
        detail=True,
        methods=["post"],
    )
    def abandon(self, request, pk=None):

        attempt = self.get_attempt(pk)

        if attempt.student_id != request.user.id:
            raise PermissionDenied(
                "You cannot abandon this attempt."
            )

        error = self.check_attempt(attempt)

        if error:
            return error

        attempt.status = (
            AssessmentAttempt
            .Status
            .ABANDONED
        )

        attempt.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            AssessmentAttemptSerializer(
                attempt,
                context={
                    "request": request,
                },
            ).data
        )