from django.contrib import admin

from .models import Lesson, LessonContent


class LessonContentInline(admin.StackedInline):
    model = LessonContent
    extra = 0
    max_num = 1

    fields = [
        "video_url",
        "text",
        "media_file",
        "material_file",
    ]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "section",
        "type",
        "order",
        "duration_seconds",
        "created_at",
        "updated_at",
    ]

    list_filter = [
        "type",
        "section__course",
        "created_at",
    ]

    search_fields = [
        "title",
        "description",
        "section__title",
        "section__course__title",
    ]

    autocomplete_fields = [
        "section",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]

    ordering = [
        "section",
        "order",
        "id",
    ]

    inlines = [
        LessonContentInline,
    ]


@admin.register(LessonContent)
class LessonContentAdmin(admin.ModelAdmin):
    list_display = [
        "lesson",
        "lesson_type",
    ]

    list_filter = [
        "lesson__type",
        "lesson__section__course",
    ]

    search_fields = [
        "lesson__title",
        "lesson__section__title",
        "lesson__section__course__title",
        "text",
    ]

    autocomplete_fields = [
        "lesson",
    ]

    def lesson_type(self, obj):
        return obj.lesson.get_type_display()

    lesson_type.short_description = "Lesson Type"