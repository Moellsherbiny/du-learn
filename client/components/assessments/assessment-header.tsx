"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
} from "lucide-react";

import type { Assessment } from "@/types/assessment";

type Props = {
  assessment: Assessment;
  currentIndex: number;
  totalQuestions: number;
};

export function AssessmentHeader({
  assessment,
  currentIndex,
  totalQuestions,
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/learn/assessments"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowRight className="size-4" />
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">
              {assessment.title}
            </h1>

            <p className="text-xs text-muted-foreground">
              السؤال {currentIndex + 1} من{" "}
              {totalQuestions}
            </p>
          </div>
        </div>

        {assessment.time_limit_minutes && (
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <Clock3 className="size-4" />
            {assessment.time_limit_minutes} دقيقة
          </div>
        )}
      </div>
    </header>
  );
}