from rest_framework.permissions import BasePermission


class IsAdminOrTeacher(BasePermission):
    """
    Allows ADMIN and TEACHER users.
    """

    def has_permission(self, request, view):
        user = request.user

        return (
            user
            and user.is_authenticated
            and user.role in ["ADMIN", "TEACHER"]
        )


class IsCourseOwnerOrAdmin(BasePermission):
    """
    ADMIN can access everything.
    TEACHER can access only courses they own.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.role == "ADMIN":
            return True

        if user.role == "TEACHER":
            return obj.teacher_id == user.id

        return False