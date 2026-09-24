
"use server";

import { cookies } from "next/headers";
import { ApiError, apiRequest } from "@/lib/api/client";

export type JoinCourseState = {
  success: boolean;
  enrollment?: unknown;
  message?: string;
};

export async function joinCourseAction(
  courseId: string | number,
): Promise<JoinCourseState> {
  try {
    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "يجب تسجيل الدخول أولًا.",
      };
    }

    if (!courseId) {
      return {
        success: false,
        message: "معرف الدورة غير صالح.",
      };
    }

    const enrollment = await apiRequest<unknown>({
      path: "/api/enrollments/",
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        course: courseId,
      }),
    });

    return {
      success: true,
      enrollment,
      message: "تم الانضمام إلى الدورة بنجاح.",
    };
  } catch (error) {
    console.error("joinCourseAction error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message:
          error.message ||
          "تعذر الانضمام إلى الدورة.",
      };
    }

    return {
      success: false,
      message: "حدث خطأ غير متوقع.",
    };
  }
}
