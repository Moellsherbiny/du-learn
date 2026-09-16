from django.core.exceptions import ValidationError
from django.db import models

from apps.courses.models import CourseSection


class Lesson(models.Model):
    class LessonType(models.TextChoices):
        VIDEO = "VIDEO", "Video"
        TEXT = "TEXT", "Text"
        MEDIA = "MEDIA", "Media"
        MATERIAL = "MATERIAL", "Material"

    section = models.ForeignKey(
        CourseSection,
        on_delete=models.CASCADE,
        related_name="lessons",
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    type = models.CharField(
        max_length=20,
        choices=LessonType.choices,
    )

    order = models.PositiveIntegerField(
        default=0,
    )

    duration_seconds = models.PositiveIntegerField(
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
        ordering = ["order", "id"]
        indexes = [
            models.Index(
                fields=["section", "order"],
            ),
            
        ]

    def __str__(self):
        return self.title


class LessonContent(models.Model):
    lesson = models.OneToOneField(
        Lesson,
        on_delete=models.CASCADE,
        related_name="content",
    )

    video_url = models.URLField(
        blank=True,
    )

    text = models.TextField(
        blank=True,
    )

    media_file = models.FileField(
        upload_to="lessons/media/",
        blank=True,
        null=True,
    )

    material_file = models.FileField(
        upload_to="lessons/materials/",
        blank=True,
        null=True,
    )

    def clean(self):
        errors = {}

        if self.lesson.type == Lesson.LessonType.VIDEO:
            if not self.video_url:
                errors["video_url"] = (
                    "Video URL is required."
                )

        elif self.lesson.type == Lesson.LessonType.TEXT:
            if not self.text.strip():
                errors["text"] = (
                    "Text content is required."
                )

        elif self.lesson.type == Lesson.LessonType.MEDIA:
            if not self.media_file:
                errors["media_file"] = (
                    "Media file is required."
                )

        elif self.lesson.type == Lesson.LessonType.MATERIAL:
            if not self.material_file:
                errors["material_file"] = (
                    "Material file is required."
                )

        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return f"Content - {self.lesson.title}"