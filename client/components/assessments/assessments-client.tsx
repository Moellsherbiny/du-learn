"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  FileQuestion,
  Filter,
  GraduationCap,
  RotateCcw,
  Target,
} from "lucide-react";

import type {
  Assessment,
  AssessmentAttempt,
  AssessmentType,
} from "@/types/assessment";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type AssessmentStatus = "NOT_STARTED" | "IN_PROGRESS" | "PASSED" | "FAILED";

type Props = {
  assessments: Assessment[];
  attempts?: AssessmentAttempt[];
};

const typeLabels: Record<AssessmentType, string> = {
  QUIZ: "اختبار قصير",
  EXAM: "اختبار نهائي",
  PRACTICE: "تدريب",
};

const typeIcons: Record<AssessmentType, typeof FileQuestion> = {
  QUIZ: FileQuestion,
  EXAM: GraduationCap,
  PRACTICE: Target,
};

function formatMinutes(minutes: number | null) {
  if (!minutes) {
    return "بدون حد زمني";
  }

  if (minutes < 60) {
    return `${minutes} دقيقة`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!remainingMinutes) {
    return `${hours} ساعة`;
  }

  return `${hours} ساعة و ${remainingMinutes} دقيقة`;
}

function getAssessmentStatus(
  assessment: Assessment,
  attempts: AssessmentAttempt[],
): AssessmentStatus {
  const assessmentAttempts = attempts.filter(
    (attempt) => String(attempt.assessment) === String(assessment.id),
  );

  if (!assessmentAttempts.length) {
    return "NOT_STARTED";
  }

  const inProgress = assessmentAttempts.find(
    (attempt) => attempt.status === "IN_PROGRESS",
  );

  if (inProgress) {
    return "IN_PROGRESS";
  }

  const passed = assessmentAttempts.some(
    (attempt) => attempt.status === "SUBMITTED" && attempt.passed,
  );

  if (passed) {
    return "PASSED";
  }

  return "FAILED";
}

function getStatusLabel(status: AssessmentStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return "قيد المحاولة";
    case "PASSED":
      return "تم الاجتياز";
    case "FAILED":
      return "لم يتم الاجتياز";
    default:
      return "لم يبدأ";
  }
}

function getStatusIcon(status: AssessmentStatus) {
  switch (status) {
    case "PASSED":
      return CheckCircle2;
    case "IN_PROGRESS":
      return RotateCcw;
    default:
      return Target;
  }
}

function getStatusVariant(
  status: AssessmentStatus,
): "default" | "secondary" | "outline" {
  switch (status) {
    case "PASSED":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    default:
      return "outline";
  }
}

export default function AssessmentsClient({
  assessments,
  attempts = [],
}: Props) {
  const [courseFilter, setCourseFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<AssessmentType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AssessmentStatus | "all">(
    "all",
  );

  /**

* Current backend returns course as an ID.
*
* Until the API returns course details such as:
* {
* id,
* title,
* slug
* }
*
* we can still use course IDs for filtering.
  */
  const courses = useMemo(() => {
    const uniqueCourses = new Map<string, string>();

    assessments.forEach((assessment) => {
      const courseId = String(assessment.course);

      if (!uniqueCourses.has(courseId)) {
        uniqueCourses.set(courseId, courseId);
      }
    });

    return Array.from(uniqueCourses.entries()).map(([id, label]) => ({
      id,
      label,
    }));
  }, [assessments]);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      const courseMatches =
        courseFilter === "all" || String(assessment.course) === courseFilter;

      const typeMatches =
        typeFilter === "all" || assessment.type === typeFilter;

      const status = getAssessmentStatus(assessment, attempts);

      const statusMatches = statusFilter === "all" || status === statusFilter;

      return courseMatches && typeMatches && statusMatches;
    });
  }, [assessments, attempts, courseFilter, typeFilter, statusFilter]);

  const hasFilters =
    courseFilter !== "all" || typeFilter !== "all" || statusFilter !== "all";

  function resetFilters() {
    setCourseFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
  }

  return (
    <main className="space-y-8" dir="rtl">
      {/* Header */}{" "}
      <section className="space-y-3">
        {" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {" "}
            <FileQuestion className="size-5" />{" "}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">التقييمات</h1>

            <p className="text-sm text-muted-foreground">
              اختبر فهمك وتابع نتائجك في التقييمات المختلفة
            </p>
          </div>
        </div>
      </section>
      {/* Filters */}
      <Card className="border-border/60 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />

              <CardTitle className="text-base">تصفية التقييمات</CardTitle>
            </div>

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="w-fit"
              >
                <RotateCcw className="size-4" />
                إعادة ضبط
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Course */}
            <div className="space-y-2">
              <label className="text-sm font-medium">الكورس</label>

              <Select
                value={courseFilter}
                onValueChange={(value) => setCourseFilter(value ?? "all")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="كل الكورسات" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">كل الكورسات</SelectItem>

                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      الكورس #{course.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">نوع التقييم</label>

              <Select
                value={typeFilter}
                onValueChange={(value) =>
                  setTypeFilter((value ?? "all") as AssessmentType | "all")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="كل الأنواع" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">كل الأنواع</SelectItem>

                  <SelectItem value="QUIZ">اختبار قصير</SelectItem>

                  <SelectItem value="EXAM">اختبار نهائي</SelectItem>

                  <SelectItem value="PRACTICE">تدريب</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">الحالة</label>

              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter((value ?? "all") as AssessmentStatus | "all")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="كل الحالات" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>

                  <SelectItem value="NOT_STARTED">لم يبدأ</SelectItem>

                  <SelectItem value="IN_PROGRESS">قيد المحاولة</SelectItem>

                  <SelectItem value="PASSED">تم الاجتياز</SelectItem>

                  <SelectItem value="FAILED">لم يتم الاجتياز</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Results */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">التقييمات المتاحة</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {filteredAssessments.length} تقييم
            </p>
          </div>
        </div>

        {filteredAssessments.length === 0 ? (
          <Card className="border-dashed shadow-none">
            <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <FileQuestion className="size-5 text-muted-foreground" />
              </div>

              <h3 className="font-semibold">لا توجد تقييمات</h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                لا توجد تقييمات تطابق خيارات التصفية الحالية.
              </p>

              {hasFilters && (
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={resetFilters}
                >
                  إعادة ضبط الفلاتر
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredAssessments.map((assessment) => {
              const status = getAssessmentStatus(assessment, attempts);

              const StatusIcon = getStatusIcon(status);
              const TypeIcon = typeIcons[assessment.type];

              const assessmentAttempts = attempts.filter(
                (attempt) =>
                  String(attempt.assessment) === String(assessment.id),
              );

              const inProgressAttempt = assessmentAttempts.find(
                (attempt) => attempt.status === "IN_PROGRESS",
              );

              const submittedAttempts = assessmentAttempts.filter(
                (attempt) => attempt.status === "SUBMITTED",
              );

              const bestAttempt = submittedAttempts.reduce<
                AssessmentAttempt | undefined
              >((best, current) => {
                if (!best) return current;

                return Number(current.percentage) > Number(best.percentage)
                  ? current
                  : best;
              }, undefined);

              return (
                <Card
                  key={assessment.id}
                  className="group flex h-full flex-col overflow-hidden border-border/60 transition-shadow hover:shadow-md"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <TypeIcon className="size-5" />
                        </div>

                        <div className="min-w-0">
                          <CardTitle className="line-clamp-2 text-base leading-7">
                            {assessment.title}
                          </CardTitle>

                          <CardDescription className="mt-1">
                            الكورس #{assessment.course}
                          </CardDescription>
                        </div>
                      </div>

                      <Badge
                        variant={getStatusVariant(status)}
                        className="shrink-0 gap-1"
                      >
                        <StatusIcon className="size-3.5" />
                        {getStatusLabel(status)}
                      </Badge>
                    </div>

                    {assessment.description && (
                      <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {assessment.description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col">
                    <Separator className="mb-5" />

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-lg bg-muted/50 p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileQuestion className="size-4" />
                          <span className="text-xs">الأسئلة</span>
                        </div>

                        <p className="mt-1 text-sm font-semibold">
                          {assessment.questions?.length ?? 0}
                        </p>
                      </div>

                      <div className="rounded-lg bg-muted/50 p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock3 className="size-4" />
                          <span className="text-xs">الوقت</span>
                        </div>

                        <p className="mt-1 text-sm font-semibold">
                          {formatMinutes(assessment.time_limit_minutes)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-muted/50 p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Target className="size-4" />
                          <span className="text-xs">النجاح</span>
                        </div>

                        <p className="mt-1 text-sm font-semibold">
                          {assessment.passing_score}%
                        </p>
                      </div>

                      <div className="rounded-lg bg-muted/50 p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <RotateCcw className="size-4" />
                          <span className="text-xs">المحاولات</span>
                        </div>

                        <p className="mt-1 text-sm font-semibold">
                          {assessment.max_attempts ?? "غير محدود"}
                        </p>
                      </div>
                    </div>

                    {bestAttempt && (
                      <div className="mt-4 flex items-center justify-between rounded-lg border bg-background px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          أفضل نتيجة
                        </span>

                        <span className="font-semibold">
                          {bestAttempt.percentage}%
                        </span>
                      </div>
                    )}

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <BookOpen className="size-4" />

                        <span>{typeLabels[assessment.type]}</span>
                      </div>

                      <Button className="gap-2">
                        <Link href={`/learn/assessments/${assessment.id}`}>
                          {inProgressAttempt
                            ? "استكمال الاختبار"
                            : status === "PASSED"
                              ? "عرض النتيجة"
                              : "بدء الاختبار"}

                          <ChevronLeft className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
