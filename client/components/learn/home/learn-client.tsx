"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

import type {
  LearnHomeData,
} from "@/actions/learn/get-learn-home";

import { useAuthStore } from "@/stores/auth-store";

import { LearnWelcome } from "./learn-welcome";
import { LearnStats } from "./learn-stats";
import { ContinueLearning } from "./continue-learning";
import { ContinueLearningEmpty } from "./continue-learning-empty";
import { CourseCard } from "./course-card";
import { QuickAction } from "./quick-action";

type Props = {
  data: LearnHomeData;
};

export function LearnClient({ data }: Props) {
  const user = useAuthStore((state) => state.user);

  const firstName =
    user?.first_name?.trim() || "الطالب";
  const lastName = user?.last_name.trim() || ""
  return (
    <main
      dir="rtl"
      className="min-h-[calc(100svh-4rem)] bg-background"
    >
      <div className="mx-auto w-full px-4 py-6 sm:px-6">
        {/* Welcome */}
        <LearnWelcome firstName={firstName} lastName={lastName} image={user?.image} />

        {/* Stats */}
        <LearnStats stats={data.stats} />

        {/* Continue + Quick Actions */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Continue Learning */}
          <div className="min-w-0">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  تابع التعلم
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  أكمل آخر دورة بدأت بها.
                </p>
              </div>

              <Link
                href="/learn/courses"
                className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                عرض الكل
              </Link>
            </div>

            <div className="mt-4">
              {data.continue_course ? (
                <ContinueLearning
                  course={data.continue_course}
                />
              ) : (
                <ContinueLearningEmpty />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <aside>
            <h2 className="text-lg font-semibold tracking-tight">
              الوصول السريع
            </h2>

            <div className="mt-4 space-y-2">
              <QuickAction
                href="/learn/courses"
                icon={BookOpen}
                title="دوراتي"
                description="الدورات التي اشتركت بها"
              />

              <QuickAction
                href="/courses"
                icon={GraduationCap}
                title="استكشف الدورات"
                description="اكتشف دورات تعليمية جديدة"
              />

              <QuickAction
                href="/learn/progress"
                icon={CheckCircle2}
                title="تقدمي"
                description="تابع مستوى إنجازك"
              />
            </div>
          </aside>
        </section>

        {/* My Courses */}
        {data.courses.length > 0 && (
          <section className="mt-10 border-t border-border/60 pt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  دوراتي
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  الدورات المسجل بها حاليًا.
                </p>
              </div>

              <Link
                href="/learn/courses"
                className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                جميع دوراتي
              </Link>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.courses.slice(0, 3).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}