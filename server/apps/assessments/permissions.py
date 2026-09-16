from rest_framework.permissions import BasePermission


class AssessmentPermission(BasePermission):
    """
    ADMIN:
        Full access.

    TEACHER:
        Manage assessments belonging to their courses.

    STUDENT:
        Read published assessments only.
    """

    def has_permission(self, request, view):
        user = request.user

        return (
            user
            and user.is_authenticated
            and user.role in [
                "ADMIN",
                "TEACHER",
                "STUDENT",
            ]
        )

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        user = request.user

        if user.role == "ADMIN":
            return True

        if user.role == "TEACHER":
            return obj.course.teacher_id == user.id

        if user.role == "STUDENT":
            return (
                request.method
                in ["GET", "HEAD", "OPTIONS"]
                and obj.is_published
            )

        return False


class QuestionPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        return (
            user
            and user.is_authenticated
            and user.role in [
                "ADMIN",
                "TEACHER",
                "STUDENT",
            ]
        )

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        user = request.user

        if user.role == "ADMIN":
            return True

        if user.role == "TEACHER":
            return (
                obj.assessment.course.teacher_id
                == user.id
            )

        if user.role == "STUDENT":
            return (
                request.method
                in ["GET", "HEAD", "OPTIONS"]
                and obj.assessment.is_published
            )

        return False


class AttemptPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        return (
            user
            and user.is_authenticated
            and user.role in [
                "ADMIN",
                "TEACHER",
                "STUDENT",
            ]
        )

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        user = request.user

        if user.role == "ADMIN":
            return True

        if user.role == "TEACHER":
            return (
                obj.assessment.course.teacher_id
                == user.id
            )

        if user.role == "STUDENT":
            return obj.student_id == user.id

        return False