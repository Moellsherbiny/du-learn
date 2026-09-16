from django.conf import settings
from django.core.validators import (
    MaxValueValidator,
    MinValueValidator,
)
from django.db import models


class Assessment(models.Model):
    class AssessmentType(models.TextChoices):
        QUIZ = "QUIZ", "Quiz"
        EXAM = "EXAM", "Exam"
        PRACTICE = "PRACTICE", "Practice"

    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="assessments",
    )

    lesson = models.ForeignKey(
        "lessons.Lesson",
        on_delete=models.CASCADE,
        related_name="assessments",
        null=True,
        blank=True,
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    type = models.CharField(
        max_length=20,
        choices=AssessmentType.choices,
        default=AssessmentType.QUIZ,
    )

    time_limit_minutes = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    passing_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=50,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )

    max_attempts = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    shuffle_questions = models.BooleanField(
        default=False,
    )

    shuffle_choices = models.BooleanField(
        default=False,
    )

    is_published = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

        indexes = [
            models.Index(
                fields=["course", "is_published"],
            ),
            models.Index(
                fields=["lesson", "is_published"],
            ),
        ]

    def __str__(self):
        return self.title


class Question(models.Model):
    class QuestionType(models.TextChoices):
        SINGLE_CHOICE = "SINGLE_CHOICE", "Single Choice"
        MULTIPLE_CHOICE = "MULTIPLE_CHOICE", "Multiple Choice"
        TRUE_FALSE = "TRUE_FALSE", "True / False"
        SHORT_TEXT = "SHORT_TEXT", "Short Text"

    assessment = models.ForeignKey(
        Assessment,
        on_delete=models.CASCADE,
        related_name="questions",
    )

    text = models.TextField()

    type = models.CharField(
        max_length=30,
        choices=QuestionType.choices,
        default=QuestionType.SINGLE_CHOICE,
    )

    points = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=1,
        validators=[
            MinValueValidator(0),
        ],
    )

    order = models.PositiveIntegerField(
        default=0,
    )

    explanation = models.TextField(
        blank=True,
    )

    class Meta:
        ordering = ["order", "id"]

        indexes = [
            models.Index(
                fields=["assessment", "order"],
            ),
        ]

    def __str__(self):
        return self.text[:80]

class Choice(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="choices",
    )

    text = models.CharField(
        max_length=1000,
    )

    is_correct = models.BooleanField(
        default=False,
    )

    order = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        ordering = ["order", "id"]

        indexes = [
            models.Index(
                fields=["question", "order"],
            ),
        ]

    def __str__(self):
        return self.text[:80]


class AssessmentAttempt(models.Model):
    class Status(models.TextChoices):
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        SUBMITTED = "SUBMITTED", "Submitted"
        EXPIRED = "EXPIRED", "Expired"
        ABANDONED = "ABANDONED", "Abandoned"

    assessment = models.ForeignKey(
        Assessment,
        on_delete=models.CASCADE,
        related_name="attempts",
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assessment_attempts",
        limit_choices_to={"role": "STUDENT"},
    )

    attempt_number = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.IN_PROGRESS,
    )

    score = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
    )

    max_score = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
    )

    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )

    passed = models.BooleanField(
        default=False,
    )

    started_at = models.DateTimeField(
        auto_now_add=True,
    )

    submitted_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-started_at"]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "assessment",
                    "student",
                    "attempt_number",
                ],
                name="unique_assessment_attempt_number",
            ),
        ]

        indexes = [
            models.Index(
                fields=["student", "assessment"],
            ),
            models.Index(
                fields=["student", "status"],
            ),
        ]

    def __str__(self):
        return (
            f"{self.student.email} - "
            f"{self.assessment.title} - "
            f"Attempt {self.attempt_number}"
        )


class Answer(models.Model):
    attempt = models.ForeignKey(
        AssessmentAttempt,
        on_delete=models.CASCADE,
        related_name="answers",
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.PROTECT,
        related_name="answers",
    )

    text_answer = models.TextField(
        blank=True,
    )

    is_correct = models.BooleanField(
        null=True,
        blank=True,
    )

    points_earned = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
    )

    answered_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["attempt", "question"],
                name="unique_answer_per_attempt_question",
            ),
        ]

    def __str__(self):
        return (
            f"{self.attempt.student.email} - "
            f"Question {self.question_id}"
        )


class AnswerChoice(models.Model):
    answer = models.ForeignKey(
        Answer,
        on_delete=models.CASCADE,
        related_name="selected_choices",
    )

    choice = models.ForeignKey(
        Choice,
        on_delete=models.PROTECT,
        related_name="answer_selections",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["answer", "choice"],
                name="unique_answer_choice",
            ),
        ]

    def __str__(self):
        return (
            f"Answer {self.answer_id} - "
            f"Choice {self.choice_id}"
        )