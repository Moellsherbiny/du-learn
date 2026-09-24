
"use client";

import {
  Check,
  FileText,
  Lock,
  PlayCircle,
  Video,
  BookOpen,
} from "lucide-react";

import type { LearnLesson } from "@/actions/courses/get-course-learn";

type Props = {
  lesson: LearnLesson;
  active: boolean;
  onClick: () => void;
};

export function LessonItem({
  lesson,
  active,
  onClick,
}: Props) {
  const Icon = getLessonIcon(lesson.content_type);

  return (
    <button
      type="button"
      disabled={lesson.is_locked}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-right transition-colors ${
        lesson.is_locked
          ? "cursor-not-allowed opacity-50"
          : active
            ? "bg-primary/10 text-primary"
            : "hover:bg-muted"
      }`}
    >
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
          lesson.is_completed
            ? "bg-primary text-primary-foreground"
            : active
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {lesson.is_locked ? (
          <Lock className="size-3.5" />
        ) : lesson.is_completed ? (
          <Check className="size-3.5" />
        ) : (
          <Icon className="size-3.5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-xs font-medium">
          {lesson.title}
        </p>

        {lesson.is_current && (
          <p className="mt-1 text-[11px] text-primary">
            الدرس الحالي
          </p>
        )}
      </div>
    </button>
  );
}

function getLessonIcon(
  type: LearnLesson["content_type"]
) {
  switch (type) {
    case "VIDEO":
      return Video;

    case "MATERIAL":
      return FileText;

    case "MEDIA":
      return PlayCircle;

    case "TEXT":
    default:
      return BookOpen;
  }
}
