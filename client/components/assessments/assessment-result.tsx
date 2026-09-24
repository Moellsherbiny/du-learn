"use client";

import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Assessment } from "@/types/assessment";

type Result = {
  score: number | string;
  max_score: number | string;
  percentage: number | string;
  passed: boolean;
};

type Props = {
  assessment: Assessment;
  result: Result;
  onRetry: () => void | Promise<void>;
  onBack: () => void;
  onAllAssessments: () => void;
};

export function AssessmentResult({
  assessment,
  result,
  onRetry,
  onBack,
  onAllAssessments,
}: Props) {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-muted/20"
    >
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full rounded-2xl border bg-background p-8 text-center shadow-sm">
          {result.passed ? (
            <CheckCircle2 className="mx-auto size-16 text-green-600" />
          ) : (
            <XCircle className="mx-auto size-16 text-destructive" />
          )}

          <h1 className="mt-5 text-2xl font-bold">
            {result.passed
              ? "تم اجتياز التقييم"
              : "لم يتم اجتياز التقييم"}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {assessment.title}
          </p>

          <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-4">
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">
                النتيجة
              </p>

              <p className="mt-1 text-2xl font-bold">
                {result.percentage}%
              </p>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">
                درجة النجاح
              </p>

              <p className="mt-1 text-2xl font-bold">
                {assessment.passing_score}%
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {result.passed ? (
              <Button onClick={onBack}>
                العودة إلى الدرس
              </Button>
            ) : (
              <Button onClick={onRetry}>
                المحاولة مرة أخرى
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onAllAssessments}
            >
              كل التقييمات
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}