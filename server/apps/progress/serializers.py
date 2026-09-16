from rest_framework import serializers

from .models import CourseProgress


class CourseProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseProgress

        fields = [
            "id",
            "student",
            "course",
            "completed_lessons",
            "total_lessons",
            "progress_percentage",
            "last_lesson",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "student",
            "course",
            "completed_lessons",
            "total_lessons",
            "progress_percentage",
            "last_lesson",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
        ]