from rest_framework import serializers

from apps.courses.models import Course
from apps.lessons.models import Lesson

from .models import CourseProgress


class CourseProgressCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
        ]


class CourseProgressLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
        ]

class CourseProgressSerializer(serializers.ModelSerializer):
    course = CourseProgressCourseSerializer(read_only=True)
    last_lesson = CourseProgressLessonSerializer(read_only=True)

    class Meta:
        model = CourseProgress
        fields = [
            "id",
            "student",
            "course",
            "completed",
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
            "completed",
            "completed_lessons",
            "total_lessons",
            "progress_percentage",
            "last_lesson",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
        ]