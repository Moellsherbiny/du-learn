
from django.db.models import Prefetch
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.courses.models import Course
from apps.enrollments.models import Enrollment
from apps.lessons.models import Lesson
from apps.progress.models import CourseProgress, LessonProgress

from .permissions import CourseProgressPermission
from .serializers import CourseProgressSerializer


class CourseProgressViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [
        IsAuthenticated,
        CourseProgressPermission,
    ]

    serializer_class = CourseProgressSerializer

    def get_queryset(self):
        user = self.request.user

        queryset = (
            CourseProgress.objects
            .select_related(
                "student",
                "course",
                "last_lesson",
            )
        )

        if user.role == "STUDENT":
            return queryset.filter(student=user)

        if user.role == "TEACHER":
            return queryset.filter(
                course__teacher=user
            )

        if user.role == "ADMIN":
            return queryset

        return queryset.none()

    # =========================================================
    # LEARNING WORKSPACE
    #
    # GET:
    # /api/progress/course-progress/<slug>/learn/
    # =========================================================

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated],
        url_path=r"(?P<slug>[^/.]+)/learn",
    )
    def learn(self, request, slug=None):
        user = request.user

        # -----------------------------------------------------
        # Course
        # -----------------------------------------------------

        course = (
            Course.objects
            .select_related("teacher")
            .prefetch_related(
                "sections__lessons__content",
            )
            .filter(slug=slug)
            .first()
        )

        if not course:
            raise NotFound("Course not found.")

        # -----------------------------------------------------
        # Enrollment
        # -----------------------------------------------------

        enrollment = (
            Enrollment.objects
            .filter(
                student_id=user.id,
                course_id=course.id,
            )
            .first()
        )

        if not enrollment:
            return Response(
                {
                    "detail": "You are not enrolled in this course."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # -----------------------------------------------------
        # Enrollment status
        # -----------------------------------------------------

        if enrollment.status not in [
            Enrollment.Status.ACTIVE,
            Enrollment.Status.COMPLETED,
        ]:
            return Response(
                {
                    "detail": (
                        "You cannot access this course "
                        "with the current enrollment status."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # -----------------------------------------------------
        # Course Progress
        # -----------------------------------------------------

        progress = (
            CourseProgress.objects
            .select_related("last_lesson")
            .filter(
                student_id=user.id,
                course_id=course.id,
            )
            .first()
        )

        # -----------------------------------------------------
        # All lessons for this course
        # -----------------------------------------------------

        sections = course.sections.all().order_by(
            "order",
            "id",
        )

        # -----------------------------------------------------
        # Lesson Progress
        #
        # Get all completed lessons for this student
        # in this course in ONE query.
        # -----------------------------------------------------

        lesson_progress_map = {
            item.lesson_id: item.completed
            for item in LessonProgress.objects.filter(
                student_id=user.id,
                lesson__section__course_id=course.id,
            )
        }

        # -----------------------------------------------------
        # Current lesson
        # -----------------------------------------------------

        current_lesson = (
            progress.last_lesson
            if progress and progress.last_lesson
            else None
        )

        total_lessons = 0
        completed_lessons = 0

        sections_data = []

        # This controls sequential locking.
        #
        # First lesson:
        #     previous_completed = True
        #
        # Next lessons:
        #     previous_completed = whether previous lesson
        #     was completed.
        #
        previous_completed = True

        # -----------------------------------------------------
        # Sections
        # -----------------------------------------------------

        for section in sections:

            lessons = section.lessons.all().order_by(
                "order",
                "id",
            )

            lessons_data = []

            for lesson in lessons:

                total_lessons += 1

                # ---------------------------------------------
                # Lesson completion
                # ---------------------------------------------

                is_completed = lesson_progress_map.get(
                    lesson.id,
                    False,
                )

                if is_completed:
                    completed_lessons += 1

                # ---------------------------------------------
                # Lesson lock
                #
                # First lesson is unlocked.
                # Every next lesson requires the previous
                # lesson to be completed.
                # ---------------------------------------------

                is_locked = not previous_completed

                # ---------------------------------------------
                # Current lesson
                # ---------------------------------------------

                is_current = (
                    current_lesson is not None
                    and lesson.id == current_lesson.id
                )

                # ---------------------------------------------
                # Content
                # ---------------------------------------------

                content = getattr(
                    lesson,
                    "content",
                    None,
                )

                lesson_data = {
                    "id": lesson.id,
                    "title": lesson.title,
                    "description": (
                        lesson.description
                        or None
                    ),
                    "content_type": lesson.type,

                    "content": (
                        content.text
                        if (
                            content
                            and lesson.type
                            == Lesson.LessonType.TEXT
                        )
                        else None
                    ),

                    "video_url": (
                        content.video_url
                        if (
                            content
                            and lesson.type
                            == Lesson.LessonType.VIDEO
                        )
                        else None
                    ),

                    "media_url": (
                        request.build_absolute_uri(
                            content.media_file.url
                        )
                        if (
                            content
                            and lesson.type
                            == Lesson.LessonType.MEDIA
                            and content.media_file
                        )
                        else None
                    ),

                    "material_url": (
                        request.build_absolute_uri(
                            content.material_file.url
                        )
                        if (
                            content
                            and lesson.type
                            == Lesson.LessonType.MATERIAL
                            and content.material_file
                        )
                        else None
                    ),

                    "order": lesson.order,

                    # -------------------------------
                    # Learning state
                    # -------------------------------

                    "is_locked": is_locked,
                    "is_completed": is_completed,
                    "is_current": is_current,
                }

                lessons_data.append(lesson_data)

                # ---------------------------------------------
                # IMPORTANT
                #
                # The current lesson's completion determines
                # whether the NEXT lesson can open.
                # ---------------------------------------------

                previous_completed = is_completed

            sections_data.append(
                {
                    "id": section.id,
                    "title": section.title,
                    "description": (
                        section.description
                        or None
                    ),
                    "order": section.order,
                    "lessons": lessons_data,
                }
            )

        # -----------------------------------------------------
        # Calculate course progress
        # -----------------------------------------------------

        if total_lessons > 0:
            progress_percentage = (
                completed_lessons / total_lessons
            ) * 100
        else:
            progress_percentage = 0

        # -----------------------------------------------------
        # Keep CourseProgress synchronized
        # -----------------------------------------------------

        if progress:
            progress.completed_lessons = completed_lessons
            progress.total_lessons = total_lessons
            progress.progress_percentage = round(
                progress_percentage,
                2,
            )

            progress.completed = (
                total_lessons > 0
                and completed_lessons == total_lessons
            )

            if progress.completed:
                if not progress.completed_at:
                    progress.completed_at = timezone.now()
            else:
                progress.completed_at = None

            progress.save(
                update_fields=[
                    "completed",
                    "completed_lessons",
                    "total_lessons",
                    "progress_percentage",
                    "completed_at",
                    "updated_at",
                ]
            )

        # -----------------------------------------------------
        # Course data
        # -----------------------------------------------------

        teacher = course.teacher

        teacher_name = None

        if teacher:
            teacher_name = (
                f"{teacher.first_name} "
                f"{teacher.last_name}"
            ).strip()

            if not teacher_name:
                teacher_name = teacher.email

        teacher_image = None

        if teacher and teacher.image:
            teacher_image = request.build_absolute_uri(
                teacher.image.url
            )

        thumbnail = None

        if course.thumbnail:
            thumbnail = request.build_absolute_uri(
                course.thumbnail.url
            )

        course_data = {
            "id": course.id,
            "teacher": (
                course.teacher_id
                if course.teacher
                else None
            ),
            "teacher_name": teacher_name,
            "teacher_image": teacher_image,
            "title": course.title,
            "slug": course.slug,
            "description": course.description,
            "thumbnail": thumbnail,
            "visibility": course.visibility,
            "category": course.category,
            "created_at": course.created_at,
            "updated_at": course.updated_at,
        }

        # -----------------------------------------------------
        # Current lesson
        # -----------------------------------------------------

        current_lesson_data = None

        if current_lesson:

            content = getattr(
                current_lesson,
                "content",
                None,
            )

            current_lesson_completed = lesson_progress_map.get(
                current_lesson.id,
                False,
            )

            current_lesson_data = {
                "id": current_lesson.id,
                "title": current_lesson.title,
                "description": (
                    current_lesson.description
                    or None
                ),
                "content_type": current_lesson.type,

                "content": (
                    content.text
                    if (
                        content
                        and current_lesson.type
                        == Lesson.LessonType.TEXT
                    )
                    else None
                ),

                "video_url": (
                    content.video_url
                    if (
                        content
                        and current_lesson.type
                        == Lesson.LessonType.VIDEO
                    )
                    else None
                ),

                "media_url": (
                    request.build_absolute_uri(
                        content.media_file.url
                    )
                    if (
                        content
                        and current_lesson.type
                        == Lesson.LessonType.MEDIA
                        and content.media_file
                    )
                    else None
                ),

                "material_url": (
                    request.build_absolute_uri(
                        content.material_file.url
                    )
                    if (
                        content
                        and current_lesson.type
                        == Lesson.LessonType.MATERIAL
                        and content.material_file
                    )
                    else None
                ),

                "order": current_lesson.order,

                "is_locked": False,
                "is_completed": current_lesson_completed,
                "is_current": True,
            }

        # -----------------------------------------------------
        # Response
        # -----------------------------------------------------

        return Response(
            {
                "course": course_data,

                "enrollment": {
                    "id": enrollment.id,
                    "status": enrollment.status,
                    "enrolled_at": enrollment.enrolled_at,
                },

                "progress": {
                    "completed": (
                        progress.completed
                        if progress
                        else (
                            total_lessons > 0
                            and completed_lessons == total_lessons
                        )
                    ),
                    "completed_lessons": completed_lessons,
                    "total_lessons": total_lessons,
                    "percentage": round(
                        progress_percentage,
                        2,
                    ),
                },

                "sections": sections_data,

                "current_lesson": current_lesson_data,
            },
            status=status.HTTP_200_OK,
        )
