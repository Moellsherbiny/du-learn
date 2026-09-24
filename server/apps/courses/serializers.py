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

    teacher_name = serializers.SerializerMethodField()

    teacher_image = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "teacher",
            "teacher_name",
            "teacher_image",
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
            "teacher_name",
            "teacher_image",
            "slug",
            "created_at",
            "updated_at",
        ]

    def get_teacher_name(self, obj):
        teacher = obj.teacher

        if not teacher:
            return None

        full_name = f"{teacher.first_name} {teacher.last_name}".strip()

        return full_name or teacher.email

    def get_teacher_image(self, obj):
        teacher = obj.teacher

        if not teacher or not teacher.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                teacher.image.url
            )

        return teacher.image.url


class CourseDetailSerializer(serializers.ModelSerializer):
    teacher = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    teacher_name = serializers.SerializerMethodField()

    teacher_image = serializers.SerializerMethodField()

    sections = CourseSectionSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "teacher",
            "teacher_name",
            "teacher_image",
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
            "teacher_name",
            "teacher_image",
            "slug",
            "sections",
            "created_at",
            "updated_at",
        ]

    def get_teacher_name(self, obj):
        teacher = obj.teacher

        if not teacher:
            return None

        full_name = f"{teacher.first_name} {teacher.last_name}".strip()

        return full_name or teacher.email

    def get_teacher_image(self, obj):
        teacher = obj.teacher

        if not teacher or not teacher.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                teacher.image.url
            )

        return teacher.image.url