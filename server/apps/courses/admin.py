from django.contrib import admin

from .models import Course, CourseSection


class CourseSectionInline(admin.TabularInline):
    model = CourseSection
    extra = 1
    fields = [
        "title",
        "description",
        "order",
    ]
    ordering = ["order", "id"]


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "teacher",
        "category",
        "visibility",
        "created_at",
        "updated_at",
    ]

    list_filter = [
        "category",
        "visibility",
        "created_at",
    ]

    search_fields = [
        "title",
        "slug",
        "description",
        "teacher__email",
    ]

    autocomplete_fields = [
        "teacher",
    ]

    prepopulated_fields = {
        "slug": ("title",),
    }

    readonly_fields = [
        "created_at",
        "updated_at",
    ]

    ordering = [
        "-created_at",
    ]

    inlines = [
        CourseSectionInline,
    ]


@admin.register(CourseSection)
class CourseSectionAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "course",
        "order",
        "created_at",
        "updated_at",
    ]

    list_filter = [
        "course",
        "created_at",
    ]

    search_fields = [
        "title",
        "description",
        "course__title",
    ]

    autocomplete_fields = [
        "course",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]

    ordering = [
        "course",
        "order",
        "id",
    ]