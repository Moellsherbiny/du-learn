from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import serializers

from apps.lessons.models import Lesson, LessonContent


class LessonContentSerializer(serializers.ModelSerializer):
    lesson = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    class Meta:
        model = LessonContent

        fields = [
            "id",
            "lesson",
            "video_url",
            "text",
            "media_file",
            "material_file",
        ]

        read_only_fields = [
            "id",
            "lesson",
        ]

    def validate(self, attrs):
        lesson = self.instance.lesson if self.instance else None

        if lesson is None:
            lesson = self.context.get("lesson")

        if lesson is None:
            raise serializers.ValidationError(
                {
                    "lesson": "Lesson is required."
                }
            )

        lesson_type = lesson.type

        video_url = attrs.get(
            "video_url",
            self.instance.video_url
            if self.instance
            else "",
        )

        text = attrs.get(
            "text",
            self.instance.text
            if self.instance
            else "",
        )

        media_file = attrs.get(
            "media_file",
            self.instance.media_file
            if self.instance
            else None,
        )

        material_file = attrs.get(
            "material_file",
            self.instance.material_file
            if self.instance
            else None,
        )

        errors = {}

        if lesson_type == Lesson.LessonType.VIDEO:
            if not video_url:
                errors["video_url"] = (
                    "Video URL is required for VIDEO lessons."
                )

        elif lesson_type == Lesson.LessonType.TEXT:
            if not text or not text.strip():
                errors["text"] = (
                    "Text content is required for TEXT lessons."
                )

        elif lesson_type == Lesson.LessonType.MEDIA:
            if not media_file:
                errors["media_file"] = (
                    "Media file is required for MEDIA lessons."
                )

        elif lesson_type == Lesson.LessonType.MATERIAL:
            if not material_file:
                errors["material_file"] = (
                    "Material file is required for MATERIAL lessons."
                )

        if errors:
            raise serializers.ValidationError(errors)

        return attrs


class LessonListSerializer(serializers.ModelSerializer):
    section = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    has_content = serializers.SerializerMethodField()

    class Meta:
        model = Lesson

        fields = [
            "id",
            "section",
            "title",
            "description",
            "type",
            "order",
            "duration_seconds",
            "has_content",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "section",
            "has_content",
            "created_at",
            "updated_at",
        ]

    def get_has_content(self, obj):
        return hasattr(obj, "content")


class LessonDetailSerializer(serializers.ModelSerializer):
    section = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    content = LessonContentSerializer(
        read_only=True,
    )

    class Meta:
        model = Lesson

        fields = [
            "id",
            "section",
            "title",
            "description",
            "type",
            "order",
            "duration_seconds",
            "content",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "section",
            "content",
            "created_at",
            "updated_at",
        ]


class LessonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson

        fields = [
            "title",
            "description",
            "type",
            "order",
            "duration_seconds",
        ]

    def validate_order(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Order cannot be negative."
            )

        return value

    def validate_duration_seconds(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError(
                "Duration must be greater than zero."
            )

        return value