"use client";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isAnswered: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export function AssessmentNavigation({
  isFirstQuestion,
  isLastQuestion,
  isAnswered,
  isSaving,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
}: Props) {
  return (
    <div className="mt-10 flex items-center justify-between gap-3 border-t pt-6">
      <Button
        variant="outline"
        disabled={
          isFirstQuestion ||
          isSaving ||
          isSubmitting
        }
        onClick={onPrevious}
      >
        <ChevronRight className="size-4" />
        السابق
      </Button>

      {!isLastQuestion ? (
        <Button
          disabled={
            !isAnswered ||
            isSaving ||
            isSubmitting
          }
          onClick={onNext}
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              التالي
              <ChevronLeft className="size-4" />
            </>
          )}
        </Button>
      ) : (
        <Button
          disabled={
            !isAnswered ||
            isSaving ||
            isSubmitting
          }
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send className="size-4" />
              إرسال التقييم
            </>
          )}
        </Button>
      )}
    </div>
  );
}