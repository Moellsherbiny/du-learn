
"use server";

import { serverApiRequest } from "@/lib/api/server";
import type { AssessmentAnswer } from "@/types/assessment";

export type AnswerQuestionPayload = {
  question: string | number;
  text_answer?: string;
  selected_choices?: Array<string | number>;
};

type ActionResult =
  | {
      success: true;
      data: AssessmentAnswer;
    }
  | {
      success: false;
      message: string;
      status?: number;
    };

export async function answerQuestionAction(
  attemptId: string | number,
  payload: AnswerQuestionPayload
): Promise<ActionResult> {
  try {
    const data = await serverApiRequest<AssessmentAnswer>({
      path: `/api/assessment-attempts/${attemptId}/answer/`,
      method: "POST",
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("answerQuestionAction:", error);

    const apiError = error as {
      status?: number;
      message?: string;
    };

    return {
      success: false,
      status: apiError.status,
      message: apiError.message || "تعذر حفظ إجابة السؤال.",
    };
  }
}

