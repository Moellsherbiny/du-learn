import Link from "next/link";
import { BookOpen } from "lucide-react";

import type { LearnHomeCourse } from "@/actions/learn/get-learn-home";

type Props = {
  course: LearnHomeCourse;
};

export function CourseCard({ course }: Props) {
  return (
    <Link
      href={`/learn/courses/${course.slug}`}
      className="
        group overflow-hidden rounded-xl
        border border-border/60 bg-card
        transition-colors hover:border-border
      "
    >
      <div className="aspect-video bg-muted">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="
              size-full object-cover
              transition-transform duration-300
              group-hover:scale-[1.02]
            "
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <BookOpen className="size-7 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="line-clamp-1 text-sm font-semibold">
          {course.title}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {course.progress.completed_lessons} من{" "}
          {course.progress.total_lessons} درس
        </p>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${course.progress.percentage}%`,
            }}
          />
        </div>
      </div>
    </Link>
  );
}