from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from rest_framework.exceptions import (
    NotFound,
    PermissionDenied,
    ValidationError,
)

from apps.assessments.models import (
    Answer,
    AnswerChoice,
    Assessment,
    AssessmentAttempt,
)
from apps.enrollments.models import Enrollment

from .grading_service import AssessmentGradingService


class AssessmentAttemptService:
    """
    Business logic for assessment attempts.
    """

    # =========================================================
    # Get Assessment
    # =========================================================

    @staticmethod
    def get_assessment(assessment_id):
        try:
            return (
                Assessment.objects
                .select_related("course")
                .prefetch_related("questions")
                .get(
                    pk=assessment_id,
                )
            )
        except Assessment.DoesNotExist:
            raise NotFound(
                "Assessment does not exist."
            )

    # =========================================================
    # Enrollment
    # =========================================================

    @staticmethod
    def check_enrollment(
        student,
        assessment,
    ):
        enrolled = Enrollment.objects.filter(
            student=student,
            course=assessment.course,
            status="ACTIVE",
        ).exists()

        if not enrolled:
            raise PermissionDenied(
                "You are not enrolled in this course."
            )

        return True

    # =========================================================
    # Expiration
    # =========================================================

    @staticmethod
    def is_expired(attempt):
        time_limit = (
            attempt.assessment.time_limit_minutes
        )

        if not time_limit:
            return False

        expires_at = (
            attempt.started_at
            + timezone.timedelta(
                minutes=time_limit,
            )
        )

        return timezone.now() >= expires_at

    # =========================================================
    # Expire Attempt
    # =========================================================

    @staticmethod
    def expire_attempt(attempt):
        if (
            attempt.status
            != AssessmentAttempt.Status.IN_PROGRESS
        ):
            return attempt

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

        return attempt

    # =========================================================
    # Validate Active Attempt
    # =========================================================

    @classmethod
    def ensure_active(cls, attempt):
        if (
            attempt.status
            != AssessmentAttempt.Status.IN_PROGRESS
        ):
            raise PermissionDenied(
                "This assessment attempt is no longer active."
            )

        if cls.is_expired(attempt):
            cls.expire_attempt(attempt)

            raise PermissionDenied(
                "This assessment attempt has expired."
            )

        return attempt

    # =========================================================
    # Start Attempt
    # =========================================================

    @classmethod
    @transaction.atomic
    def start(
        cls,
        *,
        student,
        assessment_id,
    ):
        # -----------------------------------------------------
        # Assessment
        # -----------------------------------------------------

        assessment = cls.get_assessment(
            assessment_id
        )

        # -----------------------------------------------------
        # Published
        # -----------------------------------------------------

        if not assessment.is_published:
            raise NotFound(
                "Assessment does not exist or is not published."
            )

        # -----------------------------------------------------
        # Enrollment
        # -----------------------------------------------------

        cls.check_enrollment(
            student,
            assessment,
        )

        # -----------------------------------------------------
        # Existing active attempt
        # -----------------------------------------------------

        active_attempt = (
            AssessmentAttempt.objects
            .filter(
                assessment=assessment,
                student=student,
                status=AssessmentAttempt.Status.IN_PROGRESS,
            )
            .first()
        )

        if active_attempt:

            if cls.is_expired(active_attempt):
                cls.expire_attempt(
                    active_attempt
                )
            else:
                return active_attempt

        # -----------------------------------------------------
        # Max attempts
        # -----------------------------------------------------

        attempts_count = (
            AssessmentAttempt.objects
            .filter(
                assessment=assessment,
                student=student,
            )
            .count()
        )

        if (
            assessment.max_attempts is not None
            and attempts_count
            >= assessment.max_attempts
        ):
            raise ValidationError(
                {
                    "detail": (
                        "You have reached the maximum "
                        "number of attempts for this assessment."
                    )
                }
            )

        # -----------------------------------------------------
        # Questions
        # -----------------------------------------------------

        questions = assessment.questions.all()

        if not questions.exists():
            raise ValidationError(
                {
                    "detail": (
                        "This assessment does not contain "
                        "any questions."
                    )
                }
            )

        # -----------------------------------------------------
        # Max score
        # -----------------------------------------------------

        max_score = sum(
            (
                question.points
                for question in questions
            ),
            Decimal("0"),
        )

        # -----------------------------------------------------
        # Create attempt
        # -----------------------------------------------------

        attempt = AssessmentAttempt.objects.create(
            assessment=assessment,
            student=student,
            attempt_number=attempts_count + 1,
            status=AssessmentAttempt.Status.IN_PROGRESS,
            score=Decimal("0"),
            max_score=max_score,
            percentage=Decimal("0"),
            passed=False,
        )

        return attempt

    # =========================================================
    # Save Answer
    # =========================================================

    @classmethod
    @transaction.atomic
    def save_answer(
        cls,
        *,
        attempt,
        question,
        choices=None,
        text_answer="",
    ):
        """
        Save/update an answer.

        IMPORTANT:
        This method does NOT grade the answer.
        """

        cls.ensure_active(attempt)

        choices = choices or []

        # -----------------------------------------------------
        # Create/update answer
        # -----------------------------------------------------

        answer, created = (
            Answer.objects.update_or_create(
                attempt=attempt,
                question=question,
                defaults={
                    "text_answer": text_answer,
                    "is_correct": None,
                    "points_earned": Decimal("0"),
                },
            )
        )

        # -----------------------------------------------------
        # Delete previous choices
        # -----------------------------------------------------

        AnswerChoice.objects.filter(
            answer=answer,
        ).delete()

        # -----------------------------------------------------
        # Save selected choices
        # -----------------------------------------------------

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

        return answer, created

    # =========================================================
    # Submit Attempt
    # =========================================================

    @classmethod
    @transaction.atomic
    def submit(
        cls,
        *,
        attempt,
    ):
        """
        Grade and submit an attempt.
        """

        cls.ensure_active(attempt)

        # -----------------------------------------------------
        # Grade
        # -----------------------------------------------------

        result = (
            AssessmentGradingService.grade_attempt(
                attempt
            )
        )

        # -----------------------------------------------------
        # Update attempt
        # -----------------------------------------------------

        attempt.score = result["score"]
        attempt.max_score = result["max_score"]
        attempt.percentage = result["percentage"]
        attempt.passed = result["passed"]

        attempt.status = (
            AssessmentAttempt.Status.SUBMITTED
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

        return attempt

    # =========================================================
    # Abandon
    # =========================================================

    @classmethod
    def abandon(cls, attempt):
        """
        Abandon an active attempt.
        """

        if (
            attempt.status
            != AssessmentAttempt.Status.IN_PROGRESS
        ):
            raise ValidationError(
                {
                    "detail": (
                        "This assessment attempt "
                        "is no longer active."
                    )
                }
            )

        attempt.status = (
            AssessmentAttempt.Status.ABANDONED
        )

        attempt.submitted_at = timezone.now()

        attempt.save(
            update_fields=[
                "status",
                "submitted_at",
                "updated_at",
            ]
        )

        return attempt

