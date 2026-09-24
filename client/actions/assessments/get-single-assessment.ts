
"use server";

import { serverApiRequest } from "@/lib/api/server";
import type { Assessment } from "@/types/assessment";

type AssessmentResponse =
  | Assessment
  | {
      detail?: string;
    };

type ActionResult =
  | {
      success: true;
      data: Assessment;
    }
  | {
      success: false;
      message: string;
      status?: number;
    };

export async function getAssessmentAction(
  assessmentId: string | number
): Promise<ActionResult> {
  try {
    const data = await serverApiRequest<AssessmentResponse>({
      path: `/api/assessments/${assessmentId}/`,
      method: "GET",
    });

    /*
     * Backend should return the Assessment object
     * directly for retrieve.
     */
    return {
      success: true,
      data: data as Assessment,
    };
  } catch (error: unknown) {
    console.error("getAssessmentAction:", error);

    const apiError = error as {
      status?: number;
      message?: string;
    };

    return {
      success: false,
      status: apiError.status,
      message:
        apiError.message ||
        "تعذر تحميل التقييم.",
    };
  }
}
