"use client";

import Link from "next/link";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";

import type { LearnLesson } from "@/actions/courses/get-course-learn";

import { CompleteLessonButton } from "../complete-lesson-button";
import { LessonBody } from "./lesson-body";

type Props = {
  lesson: LearnLesson;
  previousLesson: LearnLesson | null;
  nextLesson: LearnLesson | null;
  onSelectLesson: (lesson: LearnLesson) => void;
};

export function LessonContent({
  lesson,
  previousLesson,
  nextLesson,
  onSelectLesson,
}: Props) {
  const hasAssessment = lesson.assessment !== null;
  const assessmentPassed = lesson.assessment?.passed === true;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
        {" "}
        <BookOpen className="size-3.5" />
        <span>التعلم</span>
        <ChevronLeft className="size-3.5" />
        <span className="font-medium text-foreground">{lesson.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            الدرس {lesson.order}
          </span>

          {lesson.is_completed && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
              <Check className="size-3.5" />
              مكتمل
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {lesson.title}
        </h2>

        {lesson.description && (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {lesson.description}
          </p>
        )}
      </div>

      {/* Body */}
      <LessonBody lesson={lesson} />

      {/* Complete / Assessment */}
      <div className="mt-8 flex justify-end border-t pt-6">
        {hasAssessment && !assessmentPassed ? (
          <Link
            href={`/learn/assessments/${lesson.assessment?.id}`}
            className="
          inline-flex items-center gap-2
          rounded-lg
          bg-primary
          px-5 py-2.5
          text-sm font-medium
          text-primary-foreground
          transition-colors
          hover:bg-primary/90
        "
          >
            <ClipboardCheck className="size-4" />

            <span>ابدأ التقييم</span>
          </Link>
        ) : (
          <CompleteLessonButton
            lessonId={lesson.id}
            isCompleted={lesson.is_completed}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between gap-3 border-t pt-6">
        {previousLesson ? (
          <button
            type="button"
            onClick={() => onSelectLesson(previousLesson)}
            className="
          flex items-center gap-2
          rounded-lg
          border
          px-4 py-2.5
          text-sm font-medium
          transition-colors
          hover:bg-muted
        "
          >
            <ChevronRight className="size-4" />
            <span>الدرس السابق</span>
          </button>
        ) : (
          <div />
        )}

        {nextLesson && !nextLesson.is_locked ? (
          <button
            type="button"
            onClick={() => onSelectLesson(nextLesson)}
            className="
          flex items-center gap-2
          rounded-lg
          bg-primary
          px-4 py-2.5
          text-sm font-medium
          text-primary-foreground
          transition-colors
          hover:bg-primary/90
        "
          >
            <span>الدرس التالي</span>
            <ChevronLeft className="size-4" />
          </button>
        ) : (
          <div className="rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground">
            {hasAssessment && !assessmentPassed
              ? "اجتز التقييم لفتح الدرس التالي"
              : "أكمل هذا الدرس لفتح الدرس التالي"}
          </div>
        )}
      </div>
    </div>
  );
}
