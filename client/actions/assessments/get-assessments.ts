"use server";

import { serverApiRequest } from "@/lib/api/server";
import type { Assessment } from "@/types/assessment";

type PaginatedResponse<T> = {
count: number;
next: string | null;
previous: string | null;
results: T[];
};

export async function getAssessmentsAction(params?: {
courseId?: string | number;
}): Promise<Assessment[]> {
const searchParams = new URLSearchParams();

if (params?.courseId !== undefined) {
searchParams.set("course", String(params.courseId));
}

const query = searchParams.toString();

const response = await serverApiRequest<
Assessment[] | PaginatedResponse<Assessment>

> ({
 path: `/api/assessments/${query ? `?${query}` : ""}`,
 method: "GET",
 });

if (Array.isArray(response)) {
return response;
}

return response.results ?? [];
}
