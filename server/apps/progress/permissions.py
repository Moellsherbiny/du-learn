from rest_framework.permissions import BasePermission


class CourseProgressPermission(BasePermission):
    """
    ADMIN:
        Full access.

    TEACHER:
        Access progress for courses they own.

    STUDENT:
        Read-only access to their own progress.
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

        if user.role == "STUDENT":
            return obj.student_id == user.id

        if user.role == "TEACHER":
            return obj.course.teacher_id == user.id

        return False