from decimal import Decimal
from rest_framework import serializers

from apps.assessments.models import (
    Answer,
    AnswerChoice,
    Assessment,
    AssessmentAttempt,
    Choice,
    Question,
)

from apps.lessons.models import Lesson

# =========================================================
# Choice
# =========================================================

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice

        fields = [
            "id",
            "question",
            "text",
            "is_correct",
            "order",
        ]

        read_only_fields = [
            "id",
            "question",
        ]


# =========================================================
# Question
# =========================================================

class QuestionListSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Question

        fields = [
            "id",
            "assessment",
            "text",
            "type",
            "points",
            "order",
            "explanation",
            "choices",
        ]

        read_only_fields = [
            "id",
            "assessment",
            "choices",
        ]


class QuestionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question

        fields = [
            "text",
            "type",
            "points",
            "order",
            "explanation",
        ]

        extra_kwargs = {
            "explanation": {
                "required": False,
            },
        }


# =========================================================
# Assessment
# =========================================================

class AssessmentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment

        fields = [
            "id",
            "course",
            "lesson",
            "title",
            "description",
            "type",
            "time_limit_minutes",
            "passing_score",
            "max_attempts",
            "shuffle_questions",
            "shuffle_choices",
            "is_published",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "course",
            "created_at",
            "updated_at",
        ]


class AssessmentDetailSerializer(serializers.ModelSerializer):
    questions = QuestionListSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Assessment

        fields = [
            "id",
            "course",
            "lesson",
            "title",
            "description",
            "type",
            "time_limit_minutes",
            "passing_score",
            "max_attempts",
            "shuffle_questions",
            "shuffle_choices",
            "is_published",
            "questions",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "course",
            "questions",
            "created_at",
            "updated_at",
        ]


class AssessmentCreateSerializer(serializers.ModelSerializer):
    lesson = serializers.PrimaryKeyRelatedField(
        queryset=Lesson.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Assessment

        fields = [
            "title",
            "description",
            "type",
            "lesson",
            "time_limit_minutes",
            "passing_score",
            "max_attempts",
            "shuffle_questions",
            "shuffle_choices",
            "is_published",
        ]

    def validate_time_limit_minutes(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError(
                "Time limit must be greater than zero."
            )

        return value

    def validate_max_attempts(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError(
                "Max attempts must be greater than zero."
            )

        return value

    def validate(self, attrs):
        lesson = attrs.get("lesson")

        if lesson:
            course = self.context["course"]

            if lesson.section.course_id != course.id:
                raise serializers.ValidationError(
                    {
                        "lesson": (
                            "Lesson must belong to the selected course."
                        )
                    }
                )

        return attrs


# =========================================================
# AnswerChoice
# =========================================================

class AnswerChoiceSerializer(serializers.ModelSerializer):
    choice = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    class Meta:
        model = AnswerChoice

        fields = [
            "id",
            "answer",
            "choice",
        ]

        read_only_fields = [
            "id",
            "answer",
        ]


# =========================================================
# Answer
# =========================================================

class AnswerSerializer(serializers.ModelSerializer):
    selected_choices = AnswerChoiceSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Answer

        fields = [
            "id",
            "attempt",
            "question",
            "text_answer",
            "is_correct",
            "points_earned",
            "answered_at",
            "selected_choices",
        ]

        read_only_fields = [
            "id",
            "attempt",
            "is_correct",
            "points_earned",
            "answered_at",
            "selected_choices",
        ]


class SubmitAnswerSerializer(serializers.Serializer):
    question = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.all(),
    )

    text_answer = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    choices = serializers.PrimaryKeyRelatedField(
        queryset=Choice.objects.all(),
        many=True,
        required=False,
    )

    def validate(self, attrs):
        question = attrs["question"]
        choices = attrs.get("choices", [])

        attempt = self.context["attempt"]

        if question.assessment_id != attempt.assessment_id:
            raise serializers.ValidationError(
                {
                    "question": (
                        "Question does not belong "
                        "to this assessment."
                    )
                }
            )

        for choice in choices:
            if choice.question_id != question.id:
                raise serializers.ValidationError(
                    {
                        "choices": (
                            "Selected choice does not belong "
                            "to this question."
                        )
                    }
                )

        if question.type == Question.QuestionType.SHORT_TEXT:
            if not attrs.get("text_answer", "").strip():
                raise serializers.ValidationError(
                    {
                        "text_answer": (
                            "Text answer is required."
                        )
                    }
                )

        else:
            if not choices:
                raise serializers.ValidationError(
                    {
                        "choices": (
                            "At least one choice is required."
                        )
                    }
                )

        return attrs


# =========================================================
# Assessment Attempt
# =========================================================

class AssessmentAttemptSerializer(serializers.ModelSerializer):
    assessment = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    student = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    answers = AnswerSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = AssessmentAttempt

        fields = [
            "id",
            "assessment",
            "student",
            "attempt_number",
            "status",
            "score",
            "max_score",
            "percentage",
            "passed",
            "started_at",
            "submitted_at",
            "created_at",
            "updated_at",
            "answers",
        ]

        read_only_fields = [
            "id",
            "assessment",
            "student",
            "attempt_number",
            "status",
            "score",
            "max_score",
            "percentage",
            "passed",
            "started_at",
            "submitted_at",
            "created_at",
            "updated_at",
            "answers",
        ]


# =========================================================
# Student Choice
# =========================================================

class StudentChoiceSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = Choice

        fields = [
            "id",
            "text",
            "order",
        ]


# =========================================================
# Student Question
# =========================================================

class StudentQuestionSerializer(
    serializers.ModelSerializer
):
    choices = StudentChoiceSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Question

        fields = [
            "id",
            "text",
            "type",
            "points",
            "order",
            "choices",
        ]

        read_only_fields = [
            "id",
            "choices",
        ]


# =========================================================
# Student Assessment
# =========================================================

class StudentAssessmentSerializer(
    serializers.ModelSerializer
):
    questions = StudentQuestionSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Assessment

        fields = [
            "id",
            "course",
            "lesson",
            "title",
            "description",
            "type",
            "time_limit_minutes",
            "passing_score",
            "max_attempts",
            "shuffle_questions",
            "shuffle_choices",
            "questions",
        ]

        read_only_fields = [
            "id",
            "course",
            "lesson",
            "questions",
        ]

