from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class CourseProgress(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="course_progress",
        limit_choices_to={"role": "STUDENT"},
    )

    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="progress_records",
    )

    completed_lessons = models.PositiveIntegerField(
        default=0,
    )

    total_lessons = models.PositiveIntegerField(
        default=0,
    )

    progress_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )

    last_lesson = models.ForeignKey(
        "lessons.Lesson",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="last_for_course_progress",
    )

    started_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    completed_at = models.DateTimeField(
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
        ordering = ["-updated_at"]

        constraints = [
            models.UniqueConstraint(
                fields=["student", "course"],
                name="unique_student_course_progress",
            ),
        ]

        indexes = [
            models.Index(
                fields=["student", "course"],
            ),
            models.Index(
                fields=["student", "updated_at"],
            ),
        ]

    def __str__(self):
        return (
            f"{self.student.email} - "
            f"{self.course.title} - "
            f"{self.progress_percentage}%"
        )