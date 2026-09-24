"use client";

import Link from "next/link";
import { ArrowRight, CircleAlert, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import type { Assessment } from "@/types/assessment";

import { useAssessment } from "@/hooks/use-assessment";

import { AssessmentHeader } from "./assessment-header";
import { AssessmentProgress } from "./assessment-progress";
import { AssessmentQuestion } from "./assessment-question";
import { AssessmentNavigation } from "./assessment-navigation";
import { AssessmentResult } from "./assessment-result";

type Props = {
  assessment: Assessment;
};

export default function AssessmentClient({
  assessment,
}: Props) {
  const router = useRouter();

  const quiz = useAssessment({
    assessment,
  });

  if (quiz.isStarting) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-muted/20"
      >
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          جاري تجهيز الاختبار...
        </div>
      </main>
    );
  }

  if (quiz.error && !quiz.attempt) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-muted/20 px-4"
      >
        <div className="w-full max-w-md rounded-xl border bg-background p-6 text-center shadow-sm">
          <CircleAlert className="mx-auto mb-4 size-10 text-destructive" />

          <h1 className="text-lg font-semibold">
            تعذر فتح الاختبار
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {quiz.error}
          </p>

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              العودة
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (quiz.result) {
    return (
      <AssessmentResult
        assessment={assessment}
        result={quiz.result}
        onRetry={quiz.retry}
        onBack={() => router.back()}
        onAllAssessments={() =>
          router.push("/learn/assessments")
        }
      />
    );
  }

  if (!quiz.attempt || !quiz.currentQuestion) {
    return null;
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-muted/20"
    >
      <AssessmentHeader
        assessment={assessment}
        currentIndex={quiz.currentIndex}
        totalQuestions={quiz.questions.length}
      />

      <AssessmentProgress
        currentIndex={quiz.currentIndex}
        totalQuestions={quiz.questions.length}
      />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <AssessmentQuestion
          question={quiz.currentQuestion}
          answer={quiz.currentAnswer}
          onSingleChoice={quiz.selectSingleChoice}
          onMultipleChoice={quiz.toggleMultipleChoice}
          onTextChange={quiz.updateTextAnswer}
        />

        {quiz.error && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {quiz.error}
          </div>
        )}

        {quiz.isSaving && (
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            جاري حفظ الإجابة...
          </div>
        )}

        <AssessmentNavigation
          isFirstQuestion={quiz.isFirstQuestion}
          isLastQuestion={quiz.isLastQuestion}
          isAnswered={quiz.isAnswered}
          isSaving={quiz.isSaving}
          isSubmitting={quiz.isSubmitting}
          onPrevious={quiz.goPrevious}
          onNext={quiz.goNext}
          onSubmit={quiz.submit}
        />
      </div>
    </main>
  );
}