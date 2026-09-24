
"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

type CompleteLessonResponse = {
  detail: string;
  lesson: {
    id: number;
    completed: boolean;
    completed_at: string | null;
  };
  course_progress: {
    completed: boolean;
    completed_lessons: number;
    total_lessons: number;
    percentage: number;
  };
  next_lesson: {
    id: number;
    title: string;
  } | null;
};

export async function completeLessonAction(
  lessonId: number | string
): Promise<
  | {
      success: true;
      data: CompleteLessonResponse;
    }
  | {
      success: false;
      error: string;
    }
> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return {
      success: false,
      error: "غير مصرح لك بتنفيذ هذا الإجراء.",
    };
  }

  if (!API_URL) {
    return {
      success: false,
      error: "إعدادات الخادم غير مكتملة.",
    };
  }

  try {
    const response = await fetch(
      `${API_URL}/api/progress/learning/lessons/${lessonId}/complete/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          data?.detail ||
          "حدث خطأ أثناء محاولة إكمال الدرس.",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("completeLessonAction:", error);

    return {
      success: false,
      error: "تعذر الاتصال بالخادم.",
    };
  }
}
