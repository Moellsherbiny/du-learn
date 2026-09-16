from django.db import IntegrityError

from rest_framework import status, viewsets, serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.parsers import (
    FormParser,
    JSONParser,
    MultiPartParser,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.courses.models import CourseSection

from .models import Lesson, LessonContent
from .permissions import (
    LessonContentPermission,
    LessonPermission,
)
from .serializers import (
    LessonContentSerializer,
    LessonCreateSerializer,
    LessonDetailSerializer,
    LessonListSerializer,
)

class LessonContentViewSet(viewsets.ModelViewSet):
    """
    Lesson content API.

    Teacher:
        - View content of own lessons
        - Create
        - Update
        - Delete

    Student:
        - Read content only
    """

    permission_classes = [
        IsAuthenticated,
        LessonContentPermission,
    ]

    http_method_names = [
        "get",
        "post",
        "put",
        "patch",
        "delete",
        "head",
        "options",
    ]

    # =========================================================
    # Queryset
    # =========================================================

    def get_queryset(self):
        user = self.request.user

        queryset = (
            LessonContent.objects
            .select_related(
                "lesson",
                "lesson__section",
                "lesson__section__course",
            )
        )

        if user.role == "STUDENT":
            # Students can only access content
            # from courses they are actively enrolled in.
            queryset = queryset.filter(
                lesson__section__course__enrollments__student=user,
                lesson__section__course__enrollments__status="ACTIVE",
            ).distinct()

        elif user.role == "TEACHER":
            # Teachers can only manage their own courses.
            queryset = queryset.filter(
                lesson__section__course__teacher=user,
            )

        elif user.role == "ADMIN":
            pass

        else:
            queryset = queryset.none()

        return queryset

    # =========================================================
    # Create
    # =========================================================

    def perform_create(self, serializer):
        lesson = serializer.validated_data["lesson"]

        if (
            self.request.user.role == "TEACHER"
            and lesson.section.course.teacher_id
            != self.request.user.id
        ):
            raise PermissionDenied(
                "You can only manage content "
                "for your own lessons."
            )

        # OneToOne: a lesson can have only one content.
        if LessonContent.objects.filter(
            lesson=lesson
        ).exists():
            raise serializers.ValidationError(
                {
                    "lesson": (
                        "This lesson already has content."
                    )
                }
            )

        serializer.save()

    # =========================================================
    # Update
    # =========================================================

    def perform_update(self, serializer):
        lesson = serializer.instance.lesson

        if (
            self.request.user.role == "TEACHER"
            and lesson.section.course.teacher_id
            != self.request.user.id
        ):
            raise PermissionDenied(
                "You can only manage content "
                "for your own lessons."
            )

        serializer.save()
        
class LessonViewSet(viewsets.ModelViewSet):
    permission_classes = [
        IsAuthenticated,
        LessonPermission,
    ]

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "title",
        "description",
    ]

    ordering_fields = [
        "order",
        "created_at",
        "updated_at",
        "title",
        "duration_seconds",
    ]

    ordering = [
        "order",
        "id",
    ]

    def get_section(self):
        try:
            return (
                CourseSection.objects
                .select_related(
                    "course",
                )
                .get(
                    pk=self.kwargs["section_pk"],
                    course_id=self.kwargs["course_pk"],
                )
            )
        except CourseSection.DoesNotExist:
            from rest_framework.exceptions import NotFound

            raise NotFound(
                "Section does not exist in this course."
            )

    def get_queryset(self):
        user = self.request.user

        section = self.get_section()

        queryset = (
            Lesson.objects
            .filter(section=section)
            .select_related(
                "section",
                "section__course",
            )
            .prefetch_related(
                "content",
            )
        )

        if user.role == "ADMIN":
            return queryset

        if user.role == "TEACHER":
            if section.course.teacher_id == user.id:
                return queryset

            return Lesson.objects.none()

        if user.role == "STUDENT":
            if section.course.visibility == "PUBLIC":
                return queryset

            return Lesson.objects.none()

        return Lesson.objects.none()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return LessonDetailSerializer

        if self.action in [
            "create",
            "update",
            "partial_update",
        ]:
            return LessonCreateSerializer

        return LessonListSerializer

    def check_teacher_ownership(self):
        user = self.request.user

        if user.role == "ADMIN":
            return

        section = self.get_section()

        if (
            user.role != "TEACHER"
            or section.course.teacher_id != user.id
        ):
            raise PermissionDenied(
                "You do not have permission to manage "
                "lessons in this course."
            )

    def create(self, request, *args, **kwargs):
        self.check_teacher_ownership()

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        section = self.get_section()

        try:
            lesson = serializer.save(
                section=section,
            )

        except IntegrityError:
            return Response(
                {
                    "detail": (
                        "Could not create lesson."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        response_serializer = LessonDetailSerializer(
            lesson,
            context=self.get_serializer_context(),
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def perform_update(self, serializer):
        self.check_teacher_ownership()

        serializer.save()

    def perform_destroy(self, instance):
        self.check_teacher_ownership()

        instance.delete()