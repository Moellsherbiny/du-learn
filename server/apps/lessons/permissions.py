from rest_framework.permissions import BasePermission


class LessonPermission(BasePermission):
    """
    ADMIN:
        Full access.

    TEACHER:
        Manage lessons belonging to their courses.

    STUDENT:
        Read-only access to lessons
        from public courses.
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

        course = obj.section.course

        if user.role == "TEACHER":
            return course.teacher_id == user.id

        if user.role == "STUDENT":
            return (
                request.method in ["GET", "HEAD", "OPTIONS"]
                and course.visibility == "PUBLIC"
            )

        return False


class LessonContentPermission(BasePermission):
    """
    Content permissions are inherited from the lesson/course.
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

        course = obj.lesson.section.course

        if user.role == "TEACHER":
            return course.teacher_id == user.id

        if user.role == "STUDENT":
            return (
                request.method
                in ["GET", "HEAD", "OPTIONS"]
                and course.visibility == "PUBLIC"
            )

        return False