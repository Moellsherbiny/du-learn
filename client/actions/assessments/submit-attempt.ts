
"use server";

import { serverApiRequest } from "@/lib/api/server";
import type { AssessmentAttempt } from "@/types/assessment";

type ActionResult =
  | {
      success: true;
      data: AssessmentAttempt;
    }
  | {
      success: false;
      message: string;
      status?: number;
    };

export async function submitAttemptAction(
  attemptId: string | number
): Promise<ActionResult> {
  try {
    const data = await serverApiRequest<AssessmentAttempt>({
      path: `/api/assessment-attempts/${attemptId}/submit/`,
      method: "POST",
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("submitAttemptAction:", error);

    const apiError = error as {
      status?: number;
      message?: string;
    };

    return {
      success: false,
      status: apiError.status,
      message: apiError.message || "تعذر تسليم التقييم.",
    };
  }
}
