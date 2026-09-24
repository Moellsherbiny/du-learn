"use server";

import { apiRequest } from "@/lib/api/client";
import type { AssessmentAttempt } from "@/types/assessment";

export async function getAttemptsAction(params?: {
  assessmentId?: string | number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.assessmentId !== undefined) {
    searchParams.set(
      "assessment",
      String(params.assessmentId),
    );
  }

  const query = searchParams.toString();

  return apiRequest<AssessmentAttempt[]>({
    path: `/api/assessment-attempts/${
      query ? `?${query}` : ""
    }`,
    method: "GET",
  });
}