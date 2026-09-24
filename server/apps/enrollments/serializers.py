
from rest_framework import serializers

from apps.courses.models import Course
from apps.courses.serializers import CourseListSerializer

from .models import Enrollment


class EnrollmentSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )

    course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
    )

    course_details = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment

        fields = [
            "id",
            "student",
            "course",
            "course_details",
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
            "course_details",
            "enrolled_at",
            "completed_at",
            "suspended_at",
            "cancelled_at",
            "updated_at",
        ]

    def get_course_details(self, obj):
        return CourseListSerializer(
            obj.course,
            context=self.context,
        ).data

    # ------------------------------------------------------------------
    # Course validation
    # ------------------------------------------------------------------

    def validate_course(self, course):
        request = self.context.get("request")

        if not request:
            return course

        user = request.user

        # Admin can enroll students in any course.
        if user.role == "ADMIN":
            return course

        # Only students can enroll.
        if user.role != "STUDENT":
            raise serializers.ValidationError(
                "Only students can enroll in courses."
            )

        # Students can only enroll in public courses.
        if course.visibility != Course.Visibility.PUBLIC:
            raise serializers.ValidationError(
                "You cannot enroll in a private course."
            )

        return course

    # ------------------------------------------------------------------
    # Enrollment validation
    # ------------------------------------------------------------------

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
