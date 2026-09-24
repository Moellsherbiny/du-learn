"use server";

import { apiRequest } from "@/lib/api/client";
import type { AssessmentAttempt } from "@/types/assessment";

export async function abandonAssessmentAction(
  attemptId: string | number,
) {
  return apiRequest<AssessmentAttempt>({
    path: `/api/assessment-attempts/${attemptId}/abandon/`,
    method: "POST",
  });
}