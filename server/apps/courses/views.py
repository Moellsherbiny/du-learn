
from django.db import IntegrityError
from django.db.models import Q

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied

from .models import Course, CourseSection
from apps.enrollments.models import Enrollment
from apps.progress.models import CourseProgress
from apps.lessons.models import Lesson


from .permissions import IsAdminOrTeacher
from .serializers import (
    CourseDetailSerializer,
    CourseListSerializer,
    CourseSectionSerializer,
)


class CourseViewSet(viewsets.ModelViewSet):

    queryset = (
        Course.objects
        .select_related("teacher")
        .prefetch_related("sections")
    )

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
        "slug",
    ]

    ordering_fields = [
        "created_at",
        "updated_at",
        "title",
        "category",
        "visibility",
    ]

    ordering = [
        "-created_at",
    ]

    # ---------------------------------------------------------
    # Permissions
    # ---------------------------------------------------------

    def get_permissions(self):

        # Public endpoints
        if self.action == "public":
            return [
                AllowAny(),
            ]

        # Public single course
        if self.action == "public_detail":
            return [
                AllowAny(),
            ]

        # Public sections
        if self.action == "public_sections":
            return [
                AllowAny(),
            ]

        # Normal read endpoints
        if self.action in ["list", "retrieve"]:
            return [
                IsAuthenticated(),
            ]

        # Create / Update / Delete
        return [
            IsAuthenticated(),
            IsAdminOrTeacher(),
        ]

    # ---------------------------------------------------------
    # Serializer
    # ---------------------------------------------------------

    def get_serializer_class(self):

        if self.action in [
            "retrieve",
            "public_detail",
        ]:
            return CourseDetailSerializer

        return CourseListSerializer

    # ---------------------------------------------------------
    # Queryset
    # ---------------------------------------------------------

    def get_queryset(self):

        user = self.request.user

        queryset = super().get_queryset()

        # -----------------------------------------------------
        # PUBLIC LIST
        # -----------------------------------------------------

        if self.action == "public":
            return queryset.filter(
                visibility=Course.Visibility.PUBLIC
            )

        # -----------------------------------------------------
        # PUBLIC SINGLE COURSE
        # -----------------------------------------------------

        if self.action == "public_detail":
            return queryset.filter(
                visibility=Course.Visibility.PUBLIC
            )

        # -----------------------------------------------------
        # PUBLIC SECTIONS
        # -----------------------------------------------------

        if self.action == "public_sections":
            return queryset.filter(
                visibility=Course.Visibility.PUBLIC
            )

        # -----------------------------------------------------
        # Unauthenticated users
        # -----------------------------------------------------

        if not user.is_authenticated:
            return queryset.none()

        # -----------------------------------------------------
        # ADMIN
        # -----------------------------------------------------

        if user.role == "ADMIN":
            return queryset

        # -----------------------------------------------------
        # TEACHER
        # -----------------------------------------------------

        if user.role == "TEACHER":
            return queryset.filter(
                Q(
                    visibility=Course.Visibility.PUBLIC
                )
                | Q(
                    teacher=user
                )
            )

        # -----------------------------------------------------
        # STUDENT
        # -----------------------------------------------------

        if user.role == "STUDENT":
            return queryset.filter(
                visibility=Course.Visibility.PUBLIC
            )

        return queryset.none()

    # ---------------------------------------------------------
    # Create
    # ---------------------------------------------------------

    def perform_create(self, serializer):

        user = self.request.user

        serializer.save(
            teacher=user,
        )

    # ---------------------------------------------------------
    # Update
    # ---------------------------------------------------------

    def perform_update(self, serializer):

        serializer.save()

    # ---------------------------------------------------------
    # Delete
    # ---------------------------------------------------------

    def destroy(self, request, *args, **kwargs):

        instance = self.get_object()

        self.perform_destroy(instance)

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )

    # =========================================================
    # PUBLIC COURSES
    # =========================================================

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path="public",
    )
    def public(self, request):

        queryset = self.get_queryset()

        queryset = self.filter_queryset(queryset)

        serializer = CourseListSerializer(
            queryset,
            many=True,
            context=self.get_serializer_context(),
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    # =========================================================
    # PUBLIC SINGLE COURSE
    #
    # GET:
    # /api/courses/courses/public/<slug>/
    # =========================================================

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path=r"public/(?P<slug>[^/.]+)",
    )
    def public_detail(self, request, slug=None):

        course = (
            self.get_queryset()
            .filter(
                slug=slug,
                visibility=Course.Visibility.PUBLIC,
            )
            .first()
        )

        if not course:
            raise NotFound(
                "Course not found."
            )

        serializer = CourseDetailSerializer(
            course,
            context=self.get_serializer_context(),
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    # =========================================================
    # PUBLIC COURSE SECTIONS
    #
    # GET:
    # /api/courses/courses/public/<slug>/sections/
    # =========================================================

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path=r"public/(?P<slug>[^/.]+)/sections",
    )
    def public_sections(self, request, slug=None):

        course = (
            Course.objects
            .filter(
                slug=slug,
                visibility=Course.Visibility.PUBLIC,
            )
            .first()
        )

        if not course:
            raise NotFound(
                "Course not found."
            )

        sections = course.sections.all()

        serializer = CourseSectionSerializer(
            sections,
            many=True,
            context=self.get_serializer_context(),
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    # =========================================================
    # AUTHENTICATED COURSE SECTIONS
    #
    # GET:
    # /api/courses/courses/<slug>/sections/
    # =========================================================

    @action(
        detail=True,
        methods=["get"],
        permission_classes=[IsAuthenticated],
        url_path="sections",
    )
    def sections(self, request, pk=None):

        course = self.get_object()

        sections = course.sections.all()

        serializer = CourseSectionSerializer(
            sections,
            many=True,
            context=self.get_serializer_context(),
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
    

class CourseSectionViewSet(viewsets.ModelViewSet):

    serializer_class = CourseSectionSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    filter_backends = [
        OrderingFilter,
    ]

    ordering_fields = [
        "order",
        "created_at",
        "updated_at",
    ]

    ordering = [
        "order",
        "id",
    ]

    def get_course(self):

        return Course.objects.get(
            pk=self.kwargs["course_pk"],
        )

    def get_queryset(self):

        user = self.request.user

        course = self.get_course()

        # ADMIN
        if user.role == "ADMIN":
            return course.sections.all()

        # TEACHER
        if user.role == "TEACHER":

            if course.teacher_id == user.id:
                return course.sections.all()

            return CourseSection.objects.none()

        # STUDENT
        if user.role == "STUDENT":

            if course.visibility == Course.Visibility.PUBLIC:
                return course.sections.all()

            return CourseSection.objects.none()

        return CourseSection.objects.none()

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve",
        ]:
            return [
                IsAuthenticated(),
            ]

        return [
            IsAuthenticated(),
            IsAdminOrTeacher(),
        ]

    def perform_create(self, serializer):

        course = self.get_course()

        user = self.request.user

        if user.role == "TEACHER":

            if course.teacher_id != user.id:
                raise PermissionDenied(
                    "You do not have permission "
                    "to modify this course."
                )

        serializer.save(
            course=course,
        )

    def perform_update(self, serializer):

        course = self.get_course()

        user = self.request.user

        if user.role == "TEACHER":

            if course.teacher_id != user.id:
                raise PermissionDenied(
                    "You do not have permission "
                    "to modify this course."
                )

        serializer.save()

    def perform_destroy(self, instance):

        course = instance.course

        user = self.request.user

        if user.role == "TEACHER":

            if course.teacher_id != user.id:
                raise PermissionDenied(
                    "You do not have permission "
                    "to modify this course."
                )

        instance.delete()
