
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

export async function startAttemptAction(
  assessmentId: string | number
): Promise<ActionResult> {
  try {
    const data = await serverApiRequest<AssessmentAttempt>({
      path: "/api/assessment-attempts/start/",
      method: "POST",
      body: JSON.stringify({
        assessment_id: assessmentId,
      }),
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("startAttemptAction:", error);

    const apiError = error as {
      status?: number;
      message?: string;
    };

    return {
      success: false,
      status: apiError.status,
      message: apiError.message || "تعذر بدء محاولة التقييم.",
    };
  }
}
