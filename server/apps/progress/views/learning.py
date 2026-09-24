
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.courses.models import Course
from apps.lessons.models import Lesson

from ..services.learning import LearningService
from ..services.learning_assessment import LearningAssessmentService


class LearningViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, pk=None):
        """
        GET /api/progress/learning/<course_slug>/
        """

        course = (
            Course.objects
            .prefetch_related(
                "sections__lessons__content",
            )
            .filter(slug=pk)
            .first()
        )

        if not course:
            raise NotFound("Course not found.")

        enrollment = LearningService.get_enrollment(
            student=request.user,
            course=course,
        )

        if not enrollment:
            return Response(
                {
                    "detail": "You are not enrolled in this course."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if enrollment.status not in [
            enrollment.Status.ACTIVE,
            enrollment.Status.COMPLETED,
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

        lessons = LearningService.get_course_lessons(course)

        # Get or create course progress
        from apps.progress.models import CourseProgress, LessonProgress

        course_progress, _ = (
            CourseProgress.objects
            .get_or_create(
                student_id=request.user.id,
                course_id=course.id,
            )
        )

        lesson_progress_map = {
            progress.lesson_id: progress
            for progress in LessonProgress.objects.filter(
                student_id=request.user.id,
                lesson_id__in=[lesson.id for lesson in lessons],
            )
        }

        # Current lesson
        current_lesson = None

        for index, lesson in enumerate(lessons):
            progress = lesson_progress_map.get(lesson.id)

            if progress and progress.completed:
                continue

            current_lesson = lesson
            break

        # If everything is completed, use last lesson
        if not current_lesson and lessons:
            current_lesson = lessons[-1]

        sections_data = []

        for section in course.sections.all():
            section_lessons = []

            for lesson in section.lessons.all():
                lesson_index = LearningService.get_lesson_index(
                    lessons,
                    lesson.id,
                )

                progress = lesson_progress_map.get(lesson.id)

                is_completed = bool(
                    progress and progress.completed
                )

                is_locked = (
                    LearningService.is_lesson_locked(
                        student=request.user,
                        lessons=lessons,
                        lesson_index=lesson_index,
                    )
                    if lesson_index is not None
                    else True
                )
                assessment_data = (
                    LearningAssessmentService.get_lesson_assessment(
                        student=request.user,
                        lesson=lesson,
                    )
                )
                section_lessons.append(
                    {
                        "id": lesson.id,
                        "title": lesson.title,
                        "description": lesson.description,
                        "type": lesson.type,
                        "order": lesson.order,
                        "duration_seconds": lesson.duration_seconds,
                        "is_completed": is_completed,
                        "is_locked": is_locked,
                        "is_current": (
                            current_lesson is not None
                            and lesson.id == current_lesson.id
                        ),
                        "assessment": assessment_data,
                        "content": {
                            "video_url": (
                                lesson.content.video_url
                                if hasattr(lesson, "content")
                                else ""
                            ),
                            "text": (
                                lesson.content.text
                                if hasattr(lesson, "content")
                                else ""
                            ),
                            "media_file": (
                                lesson.content.media_file.url
                                if (
                                    hasattr(lesson, "content")
                                    and lesson.content.media_file
                                )
                                else None
                            ),
                            "material_file": (
                                lesson.content.material_file.url
                                if (
                                    hasattr(lesson, "content")
                                    and lesson.content.material_file
                                )
                                else None
                            ),
                        },
                    }
                )

            sections_data.append(
                {
                    "id": section.id,
                    "title": section.title,
                    "description": getattr(
                        section,
                        "description",
                        "",
                    ),
                    "order": section.order,
                    "lessons": section_lessons,
                }
            )

        return Response(
            {
                "course": {
                    "id": course.id,
                    "title": course.title,
                    "slug": course.slug,
                    "description": course.description,
                    "thumbnail": (
                        course.thumbnail.url
                        if course.thumbnail
                        else None
                    ),
                },
                "progress": {
                    "completed": course_progress.completed,
                    "completed_lessons": (
                        course_progress.completed_lessons
                    ),
                    "total_lessons": course_progress.total_lessons,
                    "percentage": float(
                        course_progress.progress_percentage
                    ),
                },
                "current_lesson": (
                    {
                        "id": current_lesson.id,
                        "title": current_lesson.title,
                    }
                    if current_lesson
                    else None
                ),
                "sections": sections_data,
            }
        )

    @action(
        detail=False,
        methods=["post"],
        url_path=r"lessons/(?P<lesson_id>\d+)/complete",
    )
    def complete_lesson(self, request, lesson_id=None):
        """
        POST /api/progress/learning/lessons/<lesson_id>/complete/
        """

        lesson = (
            Lesson.objects
            .select_related(
                "section",
                "section__course",
            )
            .filter(id=lesson_id)
            .first()
        )

        if not lesson:
            raise NotFound("Lesson not found.")

        try:
            result = LearningService.complete_lesson(
                student=request.user,
                lesson=lesson,
            )

        except PermissionError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_403_FORBIDDEN,
            )

        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        lesson_progress = result["lesson_progress"]
        course_progress = result["course_progress"]
        next_lesson = result["next_lesson"]

        return Response(
            {
                "detail": "Lesson completed successfully.",
                "lesson": {
                    "id": lesson.id,
                    "completed": lesson_progress.completed,
                    "completed_at": lesson_progress.completed_at,
                },
                "course_progress": {
                    "completed": course_progress.completed,
                    "completed_lessons": (
                        course_progress.completed_lessons
                    ),
                    "total_lessons": course_progress.total_lessons,
                    "percentage": float(
                        course_progress.progress_percentage
                    ),
                },
                "next_lesson": (
                    {
                        "id": next_lesson.id,
                        "title": next_lesson.title,
                    }
                    if next_lesson
                    else None
                ),
            },
            status=status.HTTP_200_OK,
        )
