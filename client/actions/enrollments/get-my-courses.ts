
"use server";

import { cookies } from "next/headers";

import {
  ApiError,
  apiRequest,
} from "@/lib/api/client";

import type { Enrollment } from "@/types/course";

type EnrollmentResponse =
  | Enrollment[]
  | {
      count?: number;
      next?: string | null;
      previous?: string | null;
      results?: Enrollment[];
    };

export type MyCoursesState = {
  success: boolean;
  courses: Enrollment[];
  message?: string;
};

export async function getMyCoursesAction(): Promise<MyCoursesState> {
  try {
    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return {
        success: false,
        courses: [],
        message: "يجب تسجيل الدخول أولًا.",
      };
    }

    const response =
      await apiRequest<EnrollmentResponse>({
        path: "/api/enrollments/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

    const courses = Array.isArray(response)
      ? response
      : response.results ?? [];

    return {
      success: true,
      courses,
    };
  } catch (error) {
    console.error(
      "getMyCoursesAction error:",
      error,
    );

    if (error instanceof ApiError) {
      return {
        success: false,
        courses: [],
        message:
          error.message ||
          "تعذر تحميل الدورات.",
      };
    }

    return {
      success: false,
      courses: [],
      message: "حدث خطأ غير متوقع.",
    };
  }
}
