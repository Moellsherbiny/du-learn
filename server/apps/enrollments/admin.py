from django.contrib import admin

from .models import Enrollment


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = [
        "student",
        "course",
        "status",
        "enrolled_at",
        "expires_at",
        "completed_at",
        "suspended_at",
        "cancelled_at",
        "updated_at",
    ]

    list_filter = [
        "status",
        "course",
        "enrolled_at",
        "expires_at",
    ]

    search_fields = [
        "student__email",
        "course__title",
        "course__slug",
    ]

    autocomplete_fields = [
        "student",
        "course",
    ]

    readonly_fields = [
        "enrolled_at",
        "completed_at",
        "suspended_at",
        "cancelled_at",
        "updated_at",
    ]

    ordering = [
        "-enrolled_at",
    ]

    fieldsets = [
        (
            "Enrollment",
            {
                "fields": [
                    "student",
                    "course",
                    "status",
                    "expires_at",
                ]
            },
        ),
        (
            "Status Dates",
            {
                "fields": [
                    "enrolled_at",
                    "completed_at",
                    "suspended_at",
                    "cancelled_at",
                    "updated_at",
                ]
            },
        ),
    ]