
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import type { Enrollment } from "@/types/course";

type Props = {
  enrollment: Enrollment;
};

export function CourseCard({
  enrollment,
}: Props) {
  const { course_details: course, status } =
    enrollment;

  const isCompleted =
    status === "COMPLETED";

  return (
    <article className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-sm">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <BookOpen className="size-8 text-muted-foreground/40" />
          </div>
        )}

        <StatusBadge status={status} />
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        {/* Category */}
        {course.category && (
          <p className="text-xs font-medium text-primary">
            {course.category}
          </p>
        )}

        {/* Title */}
        <div>
          <h2 className="line-clamp-2 text-base font-semibold">
            {course.title}
          </h2>

          {course.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {course.description}
            </p>
          )}
        </div>

        {/* Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="size-3.5" />
            الدورة
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 className="size-3.5" />
            {formatDate(enrollment.enrolled_at)}
          </span>
        </div>

        {/* Action */}
        <Link
          href={`/learn/courses/${course.slug}`}
          className="flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {isCompleted
            ? "مراجعة الدورة"
            : "متابعة التعلم"}

          <ArrowLeft className="size-4" />
        </Link>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Status                                                                     */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: Enrollment["status"];
}) {
  const config = {
    ACTIVE: {
      label: "قيد التعلم",
      icon: Clock3,
    },
    COMPLETED: {
      label: "مكتملة",
      icon: CheckCircle2,
    },
    SUSPENDED: {
      label: "موقوفة",
      icon: null,
    },
    CANCELLED: {
      label: "ملغاة",
      icon: null,
    },
  }[status];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur">
      {Icon && <Icon className="size-3.5" />}
      {config.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
