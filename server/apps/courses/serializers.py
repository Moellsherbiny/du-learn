from rest_framework import serializers

from .models import Course, CourseSection


class CourseSectionSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    class Meta:
        model = CourseSection
        fields = [
            "id",
            "course",
            "title",
            "description",
            "order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "course",
            "created_at",
            "updated_at",
        ]

    def validate_order(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Order must be greater than or equal to 0."
            )

        return value


class CourseListSerializer(serializers.ModelSerializer):
    teacher = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "teacher",
            "title",
            "slug",
            "description",
            "thumbnail",
            "visibility",
            "category",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "teacher",
            "slug",
            "created_at",
            "updated_at",
        ]


class CourseDetailSerializer(serializers.ModelSerializer):
    teacher = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    sections = CourseSectionSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "teacher",
            "title",
            "slug",
            "description",
            "thumbnail",
            "visibility",
            "category",
            "sections",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "teacher",
            "slug",
            "sections",
            "created_at",
            "updated_at",
        ]