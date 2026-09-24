from decimal import Decimal

from django.db import transaction

from apps.assessments.models import Answer, Choice, Question


class AssessmentGradingService:
    """
    Handles assessment answer grading.

    Grading is intentionally separated from the ViewSet.
    """

    @staticmethod
    def grade_answer(answer: Answer) -> Answer:
        """
        Grade a single answer.

        SHORT_TEXT:
            Not automatically graded yet.

        SINGLE_CHOICE / MULTIPLE_CHOICE / TRUE_FALSE:
            Exact selected-choice matching.
        """

        question = answer.question

        # -----------------------------------------------------
        # SHORT TEXT
        # -----------------------------------------------------

        if question.type == Question.QuestionType.SHORT_TEXT:
            answer.is_correct = None
            answer.points_earned = Decimal("0")

            answer.save(
                update_fields=[
                    "is_correct",
                    "points_earned",
                ]
            )

            return answer

        # -----------------------------------------------------
        # Correct choices
        # -----------------------------------------------------

        correct_choice_ids = set(
            Choice.objects.filter(
                question=question,
                is_correct=True,
            ).values_list(
                "id",
                flat=True,
            )
        )

        # -----------------------------------------------------
        # Student selected choices
        # -----------------------------------------------------

        selected_choice_ids = set(
            answer.selected_choices.values_list(
                "choice_id",
                flat=True,
            )
        )

        # -----------------------------------------------------
        # No correct choices
        # -----------------------------------------------------

        if not correct_choice_ids:
            answer.is_correct = False
            answer.points_earned = Decimal("0")

            answer.save(
                update_fields=[
                    "is_correct",
                    "points_earned",
                ]
            )

            return answer

        # -----------------------------------------------------
        # Exact match
        # -----------------------------------------------------

        is_correct = (
            selected_choice_ids
            == correct_choice_ids
        )

        answer.is_correct = is_correct

        answer.points_earned = (
            question.points
            if is_correct
            else Decimal("0")
        )

        answer.save(
            update_fields=[
                "is_correct",
                "points_earned",
            ]
        )

        return answer

    # =========================================================
    # Grade Attempt
    # =========================================================

    @classmethod
    def grade_attempt(cls, attempt):
        """
        Grade all answers belonging to an attempt.

        Returns:
            {
                "score": Decimal,
                "max_score": Decimal,
                "percentage": Decimal,
                "passed": bool,
            }
        """

        answers = (
            Answer.objects
            .select_related("question")
            .prefetch_related("selected_choices")
            .filter(
                attempt=attempt,
            )
        )

        # -----------------------------------------------------
        # Grade every answer
        # -----------------------------------------------------

        for answer in answers:
            cls.grade_answer(answer)

        # -----------------------------------------------------
        # Calculate score
        # -----------------------------------------------------

        graded_answers = Answer.objects.filter(
            attempt=attempt,
        )

        score = sum(
            (
                answer.points_earned
                for answer in graded_answers
            ),
            Decimal("0"),
        )

        # -----------------------------------------------------
        # Calculate maximum score
        # -----------------------------------------------------

        max_score = sum(
            (
                question.points
                for question in attempt.assessment.questions.all()
            ),
            Decimal("0"),
        )

        # -----------------------------------------------------
        # Calculate percentage
        # -----------------------------------------------------

        if max_score > 0:
            percentage = (
                score / max_score
            ) * Decimal("100")
        else:
            percentage = Decimal("0")

        percentage = min(
            max(
                percentage,
                Decimal("0"),
            ),
            Decimal("100"),
        )

        # -----------------------------------------------------
        # Passed
        # -----------------------------------------------------

        passed = (
            percentage
            >= attempt.assessment.passing_score
        )

        return {
            "score": score,
            "max_score": max_score,
            "percentage": percentage,
            "passed": passed,
        }

