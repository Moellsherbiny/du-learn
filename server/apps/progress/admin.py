from django.contrib import admin

from .models import CourseProgress


@admin.register(CourseProgress)
class CourseProgressAdmin(admin.ModelAdmin):
    list_display = [
        "student",
        "course",
        "completed_lessons",
        "total_lessons",
        "progress_percentage",
        "last_lesson",
        "started_at",
        "completed_at",
        "updated_at",
    ]

    list_filter = [
        "course",
        "completed_at",
        "started_at",
    ]

    search_fields = [
        "student__email",
        "course__title",
        "last_lesson__title",
    ]

    autocomplete_fields = [
        "student",
        "course",
        "last_lesson",
    ]

    readonly_fields = [
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

    ordering = [
        "-updated_at",
    ]

    fieldsets = [
        (
            "Progress Information",
            {
                "fields": [
                    "student",
                    "course",
                    "completed_lessons",
                    "total_lessons",
                    "progress_percentage",
                    "last_lesson",
                ]
            },
        ),
        (
            "Dates",
            {
                "fields": [
                    "started_at",
                    "completed_at",
                    "created_at",
                    "updated_at",
                ]
            },
        ),
    ]