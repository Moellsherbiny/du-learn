import { apiRequest } from "@/lib/api/client";

export type Enrollment = {
  id: number | string;
  course: unknown;
  status: string;
  enrolled_at: string;
  updated_at: string;
  expires_at?: string | null;
  completed_at?: string | null;
  suspended_at?: string | null;
  cancelled_at?: string | null;
};

export async function getMyEnrollments(
  accessToken: string
): Promise<Enrollment[]> {
  return apiRequest<Enrollment[]>({
    path: "/api/enrollments/",
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}