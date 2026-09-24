"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  Play,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  getCourseProgressAction,
  type CourseProgress,
} from "@/actions/progress/get-course-progress";

function getPercentage(progress: CourseProgress) {
  const value = Number(progress.progress_percentage);

  if (!Number.isFinite(value)) return 0;

  return Math.min(Math.max(value, 0), 100);
}

function getStatus(progress: CourseProgress, percentage: number) {
  if (progress.completed || percentage >= 100) {
    return {
      label: "مكتمل",
      icon: CheckCircle2,
      className: "text-emerald-600 dark:text-emerald-400",
      bgClassName:
        "bg-emerald-500/10 border-emerald-500/20",
    };
  }

  if (percentage > 0) {
    return {
      label: "قيد التقدم",
      icon: Play,
      className: "text-primary",
      bgClassName:
        "bg-primary/10 border-primary/20",
    };
  }

  return {
    label: "لم يبدأ",
    icon: Circle,
    className: "text-muted-foreground",
    bgClassName:
      "bg-muted border-border/60",
  };
}

function formatDate(date: string | null) {
  if (!date) return "غير محدد";

  try {
    return new Intl.DateTimeFormat("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "غير محدد";
  }
}

export function ProgressClient() {
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProgress() {
      setIsLoading(true);
      setError("");

      const result = await getCourseProgressAction();

      if (!result.success) {
        setError(result.message);
        setIsLoading(false);
        return;
      }

      setProgress(result.data);
      setIsLoading(false);
    }

    loadProgress();
  }, []);

  /*
   * Loading
   */
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="space-y-3">
            <div className="h-8 w-48 rounded-lg bg-muted" />
            <div className="h-4 w-80 rounded-md bg-muted" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 rounded-2xl bg-muted"
              />
            ))}
          </div>

          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-52 rounded-2xl bg-muted"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <div className="mx-auto flex min-h-[calc(100svh-180px)] w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-destructive/10">
            <Circle className="size-6 text-destructive" />
          </div>

          <h2 className="mt-4 font-semibold text-destructive">
            تعذر تحميل التقدم
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
              mt-5 inline-flex h-10 items-center justify-center
              rounded-lg bg-primary px-4
              text-sm font-medium text-primary-foreground
              transition-colors hover:bg-primary/90
            "
          >
            المحاولة مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  /*
   * Empty
   */
  if (progress.length === 0) {
    return (
      <div className="mx-auto flex min-h-[calc(100svh-180px)] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 shadow-sm">
            <BookOpen className="size-9 text-muted-foreground" />
          </div>

          <h2 className="mt-6 text-xl font-bold tracking-tight">
            لم تبدأ رحلتك التعليمية بعد
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            ابدأ أحد الدورات التعليمية المتاحة، ومع تقدمك في الدروس
            ستظهر إحصائيات تقدمك هنا.
          </p>

          <Link
            href="/learn"
            className="
              group mt-6 inline-flex h-10 items-center gap-2
              rounded-lg bg-primary px-4
              text-sm font-medium text-primary-foreground
              shadow-sm
              transition-all duration-200
              hover:bg-primary/90
              hover:shadow-md
            "
          >
            <span>ابدأ التعلم</span>

            <ArrowLeft
              className="
                size-4
                transition-transform duration-200
                group-hover:-translate-x-1
              "
            />
          </Link>
        </div>
      </div>
    );
  }

  /*
   * Calculations
   */
  const totalLessons = progress.reduce(
    (total, item) => total + item.total_lessons,
    0
  );

  const completedLessons = progress.reduce(
    (total, item) => total + item.completed_lessons,
    0
  );

  const completedCourses = progress.filter(
    (item) => item.completed || getPercentage(item) >= 100
  ).length;

  const overallPercentage =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  /*
   * Page
   */
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          تقدمي الدراسي
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          تابع مستوى تقدمك في الدورات التعليمية التي تدرسها.
        </p>
      </div>

      {/* Overview */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="الدورات التعليمية"
          value={progress.length}
        />

        <StatCard
          icon={CheckCircle2}
          label="الدروس المكتملة"
          value={completedLessons}
        />

        <StatCard
          icon={Trophy}
          label="نسبة الإنجاز"
          value={`${overallPercentage}%`}
        />

        <StatCard
          icon={Clock3}
          label="الدورات التعليمية المكتملة"
          value={completedCourses}
        />
      </div>

      {/* Overall Progress */}
      <section className="mt-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              التقدم الإجمالي
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              رحلتك التعليمية
            </h2>
          </div>

          <span className="text-2xl font-bold text-primary">
            {overallPercentage}%
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{
              width: `${overallPercentage}%`,
            }}
          />
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          أكملت {completedLessons} من {totalLessons} درس
        </p>
      </section>

      {/* Courses */}
      <section className="mt-8">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            تقدم الدورات التعليمية
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            نظرة تفصيلية على مستوى تقدمك في كل دورة تعليمية.
          </p>
        </div>

        <div className="space-y-4">
          {progress.map((item) => {
            const percentage = getPercentage(item);
            const status = getStatus(item, percentage);
            const StatusIcon = status.icon;

            return (
              <CourseProgressCard
                key={item.id}
                progress={item}
                percentage={percentage}
                status={status}
                StatusIcon={StatusIcon}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Course Progress Card                                                       */
/* -------------------------------------------------------------------------- */

function CourseProgressCard({
  progress,
  percentage,
  status,
  StatusIcon,
}: {
  progress: CourseProgress;
  percentage: number;
  status: ReturnType<typeof getStatus>;
  StatusIcon: LucideIcon;
}) {
  return (
    <article className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5">
        {/* Top */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className="
                flex size-11 shrink-0 items-center
                justify-center rounded-xl
                bg-primary/10 text-primary
              "
            >
              <BookOpen className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                دورة تعليمية
              </p>

              <h3 className="mt-1 truncate text-base font-semibold">
                {progress.course.title}
              </h3>
            </div>
          </div>

          <div
            className={`
              flex shrink-0 items-center gap-1.5
              rounded-full border px-2.5 py-1
              text-xs font-medium
              ${status.bgClassName}
              ${status.className}
            `}
          >
            <StatusIcon className="size-3.5" />
            <span>{status.label}</span>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">
              مستوى الإنجاز
            </span>

            <span className="font-semibold text-foreground">
              {percentage}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InfoItem
            label="الدروس المكتملة"
            value={`${progress.completed_lessons} من ${progress.total_lessons}`}
          />

          <InfoItem
            label="آخر درس"
            value={
              progress.last_lesson
                ? progress.last_lesson.title
                : "لا يوجد"
            }
          />

          <InfoItem
            label="بدأ في"
            value={formatDate(progress.started_at)}
          />
        </div>

        {/* Course Link */}
        <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-4">
          <span className="truncate text-xs text-muted-foreground">
            {progress.course.title}
          </span>

          <Link
            href={`/learn/courses/${progress.course.slug}`}
            className="
              group inline-flex shrink-0 items-center gap-2
              text-sm font-medium text-primary
              transition-colors hover:text-primary/80
            "
          >
            <span>
              {progress.completed
                ? "مراجعة الدورة"
                : "متابعة الدورة"}
            </span>

            <ArrowLeft
              className="
                size-4
                transition-transform duration-200
                group-hover:-translate-x-1
              "
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Info Item                                                                  */
/* -------------------------------------------------------------------------- */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/40 px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium">
        {value}
      </p>
    </div>
  );
}