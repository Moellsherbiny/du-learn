
from apps.assessments.models import Assessment, AssessmentAttempt


class LearningAssessmentService:
    """
    Handles assessment-related logic for the learning flow.

    This service is responsible for:
    - Finding the assessment associated with a lesson.
    - Checking the student's submitted attempts.
    - Returning the assessment state required by the learning API.

    Completion validation can be added later without putting
    assessment logic directly inside the ViewSet.
    """

    @staticmethod
    def get_lesson_assessment(*, student, lesson):
        """
        Return the published assessment associated with the lesson
        and the student's latest submitted attempt.

        Returns:
            dict | None
        """

        assessment = (
            Assessment.objects
            .filter(
                course=lesson.section.course,
                lesson=lesson,
                is_published=True,
            )
            .order_by("id")
            .first()
        )

        # Lesson has no assessment.
        if not assessment:
            return None

        attempt = (
            AssessmentAttempt.objects
            .filter(
                assessment=assessment,
                student=student,
                status=AssessmentAttempt.Status.SUBMITTED,
            )
            .order_by("-submitted_at", "-id")
            .first()
        )

        return {
            "id": assessment.id,
            "title": assessment.title,
            "passed": bool(attempt and attempt.passed),
            "percentage": (
                float(attempt.percentage)
                if attempt
                else 0
            ),
        }

