import Link from "next/link";
import { BookOpen } from "lucide-react";

import type { LearnHomeCourse } from "@/actions/learn/get-learn-home";

type Props = {
  course: LearnHomeCourse;
};

export function ContinueLearning({ course }: Props) {
  return (
    <Link
      href={`/learn/courses/${course.slug}`}
      className="
        group block overflow-hidden rounded-xl
        border border-border/60 bg-card
        transition-colors hover:border-border hover:bg-muted/20
      "
    >
      <div className="flex flex-col sm:flex-row">
        <div className="aspect-video w-full shrink-0 bg-muted sm:aspect-auto sm:h-auto sm:w-56">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full min-h-36 items-center justify-center">
              <BookOpen className="size-8 text-muted-foreground/50" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
          <div>
            {course.category && (
              <span className="text-xs font-medium text-primary">
                {course.category}
              </span>
            )}

            <h3 className="mt-1 line-clamp-2 text-base font-semibold">
              {course.title}
            </h3>

            {course.description && (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {course.description}
              </p>
            )}
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                التقدم
              </span>

              <span className="font-medium">
                {course.progress.percentage}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${course.progress.percentage}%`,
                }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {course.progress.completed_lessons} من{" "}
                {course.progress.total_lessons} درس
              </span>

              <span className="font-medium text-primary transition-transform group-hover:-translate-x-1">
                متابعة التعلم
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}