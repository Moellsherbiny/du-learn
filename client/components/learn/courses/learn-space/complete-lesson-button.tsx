"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { completeLessonAction } from "@/actions/progress/learning";

type CompleteLessonButtonProps = {
  lessonId: number | string;
  isCompleted?: boolean;
};

export function CompleteLessonButton({
  lessonId,
  isCompleted = false,
}: CompleteLessonButtonProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function handleComplete() {
    if (isCompleted || isLoading) return;

    setIsLoading(true);

    try {
      const result = await completeLessonAction(lessonId);

      if (!result.success) {
        console.error(result.error);
        return;
      }

      if (result.data.next_lesson) {
        router.push(`?lesson=${result.data.next_lesson.id}`, {
          scroll: false,
        });
      }

     
      router.refresh();
    } catch (error) {
      console.error("Complete lesson error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant={isCompleted ? "ghost" : "default"}
      disabled={isCompleted || isLoading}
      onClick={handleComplete}
    >
      {isCompleted ? <Check size={18} /> : null}

      {isCompleted
        ? "تم إكمال الدرس"
        : isLoading
          ? "جاري الحفظ..."
          : "إكمال الدرس"}
    </Button>
  );
}
