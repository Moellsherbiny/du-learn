from rest_framework.permissions import BasePermission


class IsEnrollmentOwnerTeacherOrAdmin(BasePermission):
    """
    Student:
        - own enrollment only

    Teacher:
        - enrollments for their own courses

    Admin:
        - everything
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.role == "ADMIN":
            return True

        if user.role == "STUDENT":
            return obj.student_id == user.id

        if user.role == "TEACHER":
            return obj.course.teacher_id == user.id

        return False