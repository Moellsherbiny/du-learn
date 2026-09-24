
"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

import type {
  CourseLearnData,
  LearnLesson,
} from "@/actions/courses/get-course-learn";

import { LessonItem } from "./lesson-item";

type Props = {
  data: CourseLearnData;
  currentLesson: LearnLesson | null;
  onSelectLesson: (lesson: LearnLesson) => void;
};

export function CourseSidebar({
  data,
  currentLesson,
  onSelectLesson,
}: Props) {
  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>(
      Object.fromEntries(
        data.sections.map((section) => [
          String(section.id),
          true,
        ])
      )
    );

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  function toggleSection(id: number | string) {
    const key = String(id);

    setOpenSections((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function handleSelectLesson(lesson: LearnLesson) {
    if (lesson.is_locked) return;

    onSelectLesson(lesson);

    // Close mobile sidebar after selecting a lesson
    setIsMobileOpen(false);
  }

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Mobile Trigger                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="sticky top-16 z-20 border-b bg-background/95 p-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border bg-background px-4 py-3 text-right shadow-sm transition-colors hover:bg-muted"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold">
                محتوى الدورة
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {data.progress.completed_lessons} من{" "}
                {data.progress.total_lessons} درس مكتمل
              </p>
            </div>
          </div>

          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Overlay                                                      */}
      {/* ------------------------------------------------------------------ */}

      {isMobileOpen && (
        <button
          type="button"
          aria-label="إغلاق قائمة محتوى الدورة"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Sidebar                                                              */}
      {/* ------------------------------------------------------------------ */}

      <aside
        className={`
          fixed inset-y-0 right-0 z-50 flex w-[min(88vw,360px)] flex-col
          border-l bg-background shadow-2xl
          transition-transform duration-300 ease-out
          lg:sticky lg:top-16 lg:z-10
          lg:h-[calc(100vh-4rem)]
          lg:max-w-96
          lg:translate-x-0
          lg:order-1
          lg:border-l
          lg:bg-muted/20
          lg:shadow-none
          ${
            isMobileOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Sidebar Header                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="shrink-0 border-b p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  محتوى الدورة
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {data.progress.completed_lessons} من{" "}
                  {data.progress.total_lessons} درس مكتمل
                </p>
              </div>
            </div>

            {/* Mobile close */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-muted lg:hidden"
              aria-label="إغلاق"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>التقدم</span>

              <span className="font-medium text-foreground">
                {data.progress.percentage}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${data.progress.percentage}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Sections                                                          */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            min-h-0 flex-1 overflow-y-auto p-3
            overscroll-contain
            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-muted-foreground/20
            hover:scrollbar-thumb-muted-foreground/30
          "
        >
          {data.sections.map((section) => {
            const sectionKey = String(section.id);
            const isOpen = openSections[sectionKey];

            return (
              <div
                key={section.id}
                className="mb-2 overflow-hidden rounded-xl border bg-background"
              >
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() =>
                    toggleSection(section.id)
                  }
                  className="flex w-full items-center justify-between gap-3 p-4 text-right transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {section.title}
                    </p>

                    {section.description && (
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                  </div>

                  <ChevronDown
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? "" : "-rotate-90"
                    }`}
                  />
                </button>

                {/* Lessons */}
                {isOpen && (
                  <div className="border-t p-2">
                    {section.lessons.map((lesson) => (
                      <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        active={
                          String(lesson.id) ===
                          String(currentLesson?.id)
                        }
                        onClick={() =>
                          handleSelectLesson(lesson)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
