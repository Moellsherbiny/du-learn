from django.contrib import admin

from .models import (
    Answer,
    AnswerChoice,
    Assessment,
    AssessmentAttempt,
    Choice,
    Question,
)


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 1

    fields = [
        "text",
        "is_correct",
        "order",
    ]

    ordering = [
        "order",
        "id",
    ]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = [
        "short_text",
        "assessment",
        "type",
        "points",
        "order",
    ]

    list_filter = [
        "type",
        "assessment__type",
        "assessment__course",
    ]

    search_fields = [
        "text",
        "assessment__title",
        "assessment__course__title",
    ]

    autocomplete_fields = [
        "assessment",
    ]

    readonly_fields = []

    ordering = [
        "assessment",
        "order",
        "id",
    ]

    inlines = [
        ChoiceInline,
    ]

    @admin.display(description="Question")
    def short_text(self, obj):
        return obj.text[:100]


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1

    fields = [
        "text",
        "type",
        "points",
        "order",
        "explanation",
    ]

    ordering = [
        "order",
        "id",
    ]


class AssessmentAttemptInline(admin.TabularInline):
    model = AssessmentAttempt
    extra = 0

    fields = [
        "student",
        "attempt_number",
        "status",
        "score",
        "max_score",
        "percentage",
        "passed",
        "started_at",
        "submitted_at",
    ]

    readonly_fields = [
        "attempt_number",
        "score",
        "max_score",
        "percentage",
        "passed",
        "started_at",
        "submitted_at",
    ]

    autocomplete_fields = [
        "student",
    ]

    ordering = [
        "-started_at",
    ]


@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "course",
        "lesson",
        "type",
        "passing_score",
        "max_attempts",
        "is_published",
        "created_at",
    ]

    list_filter = [
        "type",
        "is_published",
        "shuffle_questions",
        "shuffle_choices",
        "course",
        "created_at",
    ]

    search_fields = [
        "title",
        "description",
        "course__title",
        "lesson__title",
    ]

    autocomplete_fields = [
        "course",
        "lesson",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]

    ordering = [
        "-created_at",
    ]

    fieldsets = [
        (
            "Basic Information",
            {
                "fields": [
                    "course",
                    "lesson",
                    "title",
                    "description",
                    "type",
                ]
            },
        ),
        (
            "Assessment Settings",
            {
                "fields": [
                    "time_limit_minutes",
                    "passing_score",
                    "max_attempts",
                ]
            },
        ),
        (
            "Question Settings",
            {
                "fields": [
                    "shuffle_questions",
                    "shuffle_choices",
                ]
            },
        ),
        (
            "Publishing",
            {
                "fields": [
                    "is_published",
                ]
            },
        ),
        (
            "Timestamps",
            {
                "fields": [
                    "created_at",
                    "updated_at",
                ]
            },
        ),
    ]

    inlines = [
        QuestionInline,
        AssessmentAttemptInline,
    ]


class AnswerChoiceInline(admin.TabularInline):
    model = AnswerChoice
    extra = 0

    fields = [
        "choice",
    ]

    autocomplete_fields = [
        "choice",
    ]


@admin.register(AssessmentAttempt)
class AssessmentAttemptAdmin(admin.ModelAdmin):
    list_display = [
        "student",
        "assessment",
        "attempt_number",
        "status",
        "score",
        "max_score",
        "percentage",
        "passed",
        "started_at",
        "submitted_at",
    ]

    list_filter = [
        "status",
        "passed",
        "assessment__type",
        "assessment__course",
        "started_at",
    ]

    search_fields = [
        "student__email",
        "assessment__title",
        "assessment__course__title",
    ]

    autocomplete_fields = [
        "assessment",
        "student",
    ]

    readonly_fields = [
        "attempt_number",
        "score",
        "max_score",
        "percentage",
        "passed",
        "started_at",
        "submitted_at",
        "created_at",
        "updated_at",
    ]

    ordering = [
        "-started_at",
    ]


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = [
        "attempt",
        "question",
        "is_correct",
        "points_earned",
        "answered_at",
    ]

    list_filter = [
        "is_correct",
        "answered_at",
    ]

    search_fields = [
        "attempt__student__email",
        "attempt__assessment__title",
        "question__text",
        "text_answer",
    ]

    autocomplete_fields = [
        "attempt",
        "question",
    ]

    readonly_fields = [
        "is_correct",
        "points_earned",
        "answered_at",
    ]

    inlines = [
        AnswerChoiceInline,
    ]

    ordering = [
        "-answered_at",
    ]


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = [
        "short_text",
        "question",
        "is_correct",
        "order",
    ]

    list_filter = [
        "is_correct",
        "question__type",
        "question__assessment__course",
    ]

    search_fields = [
        "text",
        "question__text",
        "question__assessment__title",
    ]

    autocomplete_fields = [
        "question",
    ]

    ordering = [
        "question",
        "order",
        "id",
    ]

    @admin.display(description="Choice")
    def short_text(self, obj):
        return obj.text[:100]


@admin.register(AnswerChoice)
class AnswerChoiceAdmin(admin.ModelAdmin):
    list_display = [
        "answer",
        "choice",
    ]

    search_fields = [
        "answer__attempt__student__email",
        "answer__attempt__assessment__title",
        "choice__text",
    ]

    autocomplete_fields = [
        "answer",
        "choice",
    ]