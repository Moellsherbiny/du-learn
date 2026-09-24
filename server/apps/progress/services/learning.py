from django.db import transaction
from django.utils import timezone

from apps.enrollments.models import Enrollment
from apps.lessons.models import Lesson
from apps.progress.models import CourseProgress, LessonProgress


class LearningService:
    """
    Business logic for the learning workspace.
    """

    # =========================================================
    # Enrollment
    # =========================================================

    @staticmethod
    def get_enrollment(student, course):
        return (
            Enrollment.objects
            .filter(
                student_id=student.id,
                course_id=course.id,
            )
            .first()
        )

    # =========================================================
    # Course Lessons
    # =========================================================

    @staticmethod
    def get_course_lessons(course):
        return list(
            Lesson.objects
            .filter(
                section__course_id=course.id,
            )
            .order_by(
                "section__order",
                "section_id",
                "order",
                "id",
            )
        )

    # =========================================================
    # Lesson Index
    # =========================================================

    @staticmethod
    def get_lesson_index(lessons, lesson_id):
        return next(
            (
                index
                for index, lesson in enumerate(lessons)
                if lesson.id == lesson_id
            ),
            None,
        )

    # =========================================================
    # Check Lesson Lock
    # =========================================================

    @staticmethod
    def is_lesson_locked(
        student,
        lessons,
        lesson_index,
    ):
        # First lesson is always unlocked.
        if lesson_index == 0:
            return False

        previous_lesson = lessons[
            lesson_index - 1
        ]

        return not (
            LessonProgress.objects.filter(
                student_id=student.id,
                lesson_id=previous_lesson.id,
                completed=True,
            ).exists()
        )

    # =========================================================
    # Complete Lesson
    # =========================================================

    @classmethod
    def complete_lesson(
        cls,
        student,
        lesson,
    ):
        """
        Complete a lesson and update course progress.

        Returns:
            {
                "lesson_progress": LessonProgress,
                "course_progress": CourseProgress,
                "next_lesson": Lesson | None,
            }
        """

        course = lesson.section.course

        # -----------------------------------------------------
        # Enrollment
        # -----------------------------------------------------

        enrollment = cls.get_enrollment(
            student,
            course,
        )

        if not enrollment:
            raise PermissionError(
                "You are not enrolled in this course."
            )

        # -----------------------------------------------------
        # Enrollment status
        # -----------------------------------------------------

        if enrollment.status not in [
            Enrollment.Status.ACTIVE,
            Enrollment.Status.COMPLETED,
        ]:
            raise PermissionError(
                "You cannot access this course "
                "with the current enrollment status."
            )

        # -----------------------------------------------------
        # Lessons
        # -----------------------------------------------------

        lessons = cls.get_course_lessons(
            course,
        )

        lesson_index = cls.get_lesson_index(
            lessons,
            lesson.id,
        )

        if lesson_index is None:
            raise ValueError(
                "Lesson does not belong to this course."
            )

        # -----------------------------------------------------
        # Lock
        # -----------------------------------------------------

        if cls.is_lesson_locked(
            student,
            lessons,
            lesson_index,
        ):
            raise PermissionError(
                "This lesson is locked. "
                "Complete the previous lesson first."
            )

        # -----------------------------------------------------
        # Transaction
        # -----------------------------------------------------

        now = timezone.now()

        with transaction.atomic():

            # =================================================
            # Lesson Progress
            # =================================================

            lesson_progress, _ = (
                LessonProgress.objects
                .select_for_update()
                .get_or_create(
                    student_id=student.id,
                    lesson_id=lesson.id,
                    defaults={
                        "completed": True,
                        "completed_at": now,
                    },
                )
            )

            if not lesson_progress.completed:

                lesson_progress.completed = True
                lesson_progress.completed_at = now

                lesson_progress.save(
                    update_fields=[
                        "completed",
                        "completed_at",
                        "updated_at",
                    ]
                )

            # =================================================
            # Course Progress
            # =================================================

            course_progress, _ = (
                CourseProgress.objects
                .select_for_update()
                .get_or_create(
                    student_id=student.id,
                    course_id=course.id,
                    defaults={
                        "started_at": now,
                    },
                )
            )

            # =================================================
            # Calculate Progress
            # =================================================

            total_lessons = len(lessons)

            completed_lessons = (
                LessonProgress.objects
                .filter(
                    student_id=student.id,
                    lesson__section__course_id=course.id,
                    completed=True,
                )
                .count()
            )

            percentage = (
                round(
                    (
                        completed_lessons
                        / total_lessons
                    ) * 100,
                    2,
                )
                if total_lessons
                else 0
            )

            course_completed = (
                total_lessons > 0
                and completed_lessons
                == total_lessons
            )

            # =================================================
            # Update Course Progress
            # =================================================

            course_progress.completed_lessons = (
                completed_lessons
            )

            course_progress.total_lessons = (
                total_lessons
            )

            course_progress.progress_percentage = (
                percentage
            )

            course_progress.last_lesson = lesson

            course_progress.completed = (
                course_completed
            )

            course_progress.completed_at = (
                now
                if course_completed
                else None
            )

            if not course_progress.started_at:
                course_progress.started_at = now

            course_progress.save()

        # -----------------------------------------------------
        # Next Lesson
        # -----------------------------------------------------

        next_lesson = None

        if lesson_index < len(lessons) - 1:
            next_lesson = lessons[
                lesson_index + 1
            ]

        return {
            "lesson_progress": lesson_progress,
            "course_progress": course_progress,
            "next_lesson": next_lesson,
        }
