from django.utils import timezone

from rest_framework import serializers

from .models import Enrollment
from apps.courses.models import Course


class EnrollmentSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
    )

    class Meta:
        model = Enrollment

        fields = [
            "id",
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

        read_only_fields = [
            "id",
            "student",
            "enrolled_at",
            "completed_at",
            "suspended_at",
            "cancelled_at",
            "updated_at",
        ]

    def validate_course(self, course):
        request = self.context.get("request")

        if not request:
            return course

        user = request.user

        # Admin can enroll students in any course.
        if user.role == "ADMIN":
            return course

        # Teachers cannot enroll themselves as students.
        if user.role != "STUDENT":
            raise serializers.ValidationError(
                "Only students can enroll in courses."
            )

        # Prevent enrolling in private courses.
        if course.visibility != Course.Visibility.PUBLIC:
            raise serializers.ValidationError(
                "You cannot enroll in a private course."
            )

        return course

    def validate(self, attrs):
        request = self.context.get("request")

        if not request:
            return attrs

        user = request.user

        course = attrs.get("course")

        if (
            self.instance is None
            and user.role == "STUDENT"
            and course is not None
        ):
            exists = Enrollment.objects.filter(
                student=user,
                course=course,
            ).exists()

            if exists:
                raise serializers.ValidationError(
                    {
                        "course": (
                            "You are already enrolled in this course."
                        )
                    }
                )

        return attrs