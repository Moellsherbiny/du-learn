"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Trophy,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";

const stats = [
  {
    label: "الدروس المكتملة",
    value: "0",
    icon: CheckCircle2,
  },
  {
    label: "الدروس قيد التعلم",
    value: "0",
    icon: PlayCircle,
  },
  {
    label: "ساعات التعلم",
    value: "0",
    icon: Clock3,
  },
  {
    label: "النقاط",
    value: "0",
    icon: Trophy,
  },
];

export function LearnClient() {
  const user = useAuthStore(
    (state) => state.user,
  );

  const firstName =
    user?.first_name?.trim() || "الطالب";

  return (
    <main
      dir="rtl"
      className="min-h-[calc(100svh-4rem)] bg-background"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,120,120,0.12),transparent_35%)]"
          />

          <div className="relative grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10 lg:py-10">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                <Sparkles className="size-3.5 text-primary" />
                <span>مساحة التعلم الخاصة بك</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                أهلًا، {firstName} 👋
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                استمر في رحلة التعلم، تابع تقدمك،
                وابدأ من حيث توقفت.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/learn/courses"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  <BookOpen className="size-4" />
                  استعرض المقررات
                </Link>

                <Link
                  href="/learn/progress"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-medium transition hover:bg-muted"
                >
                  عرض تقدمي
                  <ArrowLeft className="size-4" />
                </Link>
              </div>
            </div>

            <div className="hidden size-32 items-center justify-center rounded-3xl border border-border/70 bg-background shadow-sm lg:flex">
              <GraduationCap className="size-14 text-primary" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>

                  <span className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </span>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </section>

        {/* Continue Learning */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                تابع التعلم
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                أكمل الدروس والمقررات التي بدأت بها.
              </p>
            </div>

            <Link
              href="/learn/courses"
              className="hidden text-sm font-medium text-primary hover:underline sm:block"
            >
              جميع المقررات
            </Link>
          </div>

          <div className="rounded-2xl border border-dashed border-border/70 bg-card px-6 py-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted">
              <BookOpen className="size-5 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-sm font-semibold">
              لا توجد مقررات قيد التعلم
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              ابدأ باختيار أحد المقررات المتاحة لك
              لتظهر هنا وتتمكن من متابعة تقدمك بسهولة.
            </p>

            <Link
              href="/learn/courses"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
            >
              <BookOpen className="size-4" />
              استعرض المقررات
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold tracking-tight">
            الوصول السريع
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <QuickAction
              href="/learn/courses"
              icon={BookOpen}
              title="المقررات"
              description="تصفح المقررات والدروس المتاحة لك."
            />

            <QuickAction
              href="/learn/progress"
              icon={CheckCircle2}
              title="تقدمي"
              description="تابع إنجازك ومستواك في التعلم."
            />

            <QuickAction
              href="/learn/achievements"
              icon={Trophy}
              title="الإنجازات"
              description="شاهد إنجازاتك ونقاطك التعليمية."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

type QuickActionProps = {
  href: string;
  icon: typeof BookOpen;
  title: string;
  description: string;
};

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-border hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-muted transition group-hover:bg-primary/10">
          <Icon className="size-4 text-muted-foreground transition group-hover:text-primary" />
        </div>

        <ArrowLeft className="size-4 text-muted-foreground transition group-hover:-translate-x-1 group-hover:text-foreground" />
      </div>

      <h3 className="mt-5 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}