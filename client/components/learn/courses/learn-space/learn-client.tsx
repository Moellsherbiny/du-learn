
"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type {
  CourseLearnData,
  LearnLesson,
} from "@/actions/courses/get-course-learn";

import { CourseSidebar } from "./sidebar/course-sidebar";
import { LessonContent } from "./lesson/lesson-content";
import { EmptyLessonState } from "./lesson/empty-lesson-state";

type Props = {
  data: CourseLearnData;
};

export function LearnClient({ data }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lessonFromUrl = searchParams.get("lesson");

  /**
   * جميع الدروس بالترتيب
   */
  const allLessons = useMemo(
    () => data.sections.flatMap((section) => section.lessons),
    [data.sections]
  );

  /**
   * الدرس الذي يجب أن يبدأ منه الطالب
   *
   * الأولوية:
   * 1. الدرس الموجود في URL إذا كان مفتوحًا
   * 2. current_lesson القادم من backend
   * 3. أول درس غير مقفول
   */
  const targetLesson = useMemo(() => {
    // 1. URL lesson
    if (lessonFromUrl) {
      const lesson = allLessons.find(
        (item) => String(item.id) === String(lessonFromUrl)
      );

      if (lesson && !lesson.is_locked) {
        return lesson;
      }
    }

    // 2. Current lesson from backend
    if (data.current_lesson && !data.current_lesson.is_locked) {
      return data.current_lesson;
    }

    // 3. First unlocked lesson
    return allLessons.find((lesson) => !lesson.is_locked) ?? null;
  }, [
    allLessons,
    data.current_lesson,
    lessonFromUrl,
  ]);

  /**
   * لو الطالب دخل صفحة التعلم بدون lesson
   * يتم توجيهه تلقائيًا للدرس الحالي.
   */
  useEffect(() => {
    if (!targetLesson) return;

    const currentUrlLesson = searchParams.get("lesson");

    if (String(currentUrlLesson) === String(targetLesson.id)) {
      return;
    }

    router.replace(
      `${pathname}?lesson=${targetLesson.id}`,
      {
        scroll: false,
      }
    );
  }, [
    targetLesson,
    pathname,
    router,
    searchParams,
  ]);

  /**
   * الدرس المعروض فعليًا
   */
  const currentLesson = useMemo(() => {
    if (!lessonFromUrl) {
      return targetLesson;
    }

    const lesson = allLessons.find(
      (item) => String(item.id) === String(lessonFromUrl)
    );

    if (!lesson || lesson.is_locked) {
      return targetLesson;
    }

    return lesson;
  }, [
    allLessons,
    lessonFromUrl,
    targetLesson,
  ]);

  /**
   * Index الدرس الحالي
   */
  const currentIndex = currentLesson
    ? allLessons.findIndex(
        (lesson) =>
          String(lesson.id) === String(currentLesson.id)
      )
    : -1;

  /**
   * الدرس السابق
   */
  const previousLesson =
    currentIndex > 0
      ? allLessons[currentIndex - 1]
      : null;

  /**
   * الدرس التالي
   */
  const nextLesson =
    currentIndex >= 0 &&
    currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  /**
   * اختيار درس من Sidebar
   */
  function selectLesson(lesson: LearnLesson) {
    if (lesson.is_locked) return;

    router.push(
      `${pathname}?lesson=${lesson.id}`,
      {
        scroll: false,
      }
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-muted/20"
    >
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1800px] items-center justify-between px-4 lg:px-6">
          {/* Right */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={`/courses/${data.course.slug}`}
              aria-label="العودة إلى الدورة"
              className="
                flex size-8 shrink-0 items-center justify-center
                rounded-lg
                text-muted-foreground
                transition-colors
                hover:bg-muted
                hover:text-foreground
              "
            >
              <ArrowRight className="size-4" />
            </Link>

            <div className="flex min-w-0 items-center gap-2">
              <BookOpen className="hidden size-4 shrink-0 text-primary sm:block" />

              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold">
                  {data.course.title}
                </h1>

                {data.course.category && (
                  <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
                    {data.course.category}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">
              التقدم
            </span>

            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted sm:w-28">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{
                    width: `${data.progress.percentage}%`,
                  }}
                />
              </div>

              <span className="min-w-9 text-left text-xs font-medium tabular-nums">
                {data.progress.percentage}%
              </span>
            </div>
          </div>
        </div>
      </header>


{/* ================= WORKSPACE ================= */}
<div
  className="
    mx-auto
    flex
    w-full
    max-w-[1800px]
    flex-col
    lg:flex-row
  "
>
    {/* ================= SIDEBAR ================= */}
    <CourseSidebar
      data={data}
      currentLesson={currentLesson}
      onSelectLesson={selectLesson}
    />
  {/* ================= CONTENT ================= */}
  <section
    className="
      order-1
      min-w-0
      flex-1
      lg:order-1
    "
  >
    {currentLesson ? (
      <LessonContent
        lesson={currentLesson}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
        onSelectLesson={selectLesson}
      />
    ) : (
      <EmptyLessonState />
    )}
  </section>



</div>

    </main>
  );
}
