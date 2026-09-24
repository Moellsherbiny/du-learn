"use server";

import { cookies } from "next/headers";

import { ApiError, apiRequest } from "@/lib/api/client";

type LessonContent = {
  video_url: string;
  text: string;
  media_file: string | null;
  material_file: string | null;
};

export type LearnLesson = {
  id: number | string;
  title: string;
  description: string;
  content_type: "VIDEO" | "TEXT" | "MEDIA" | "MATERIAL";
  order: number;
  duration_seconds: number | null;
  is_completed: boolean;
  is_locked: boolean;
  is_current: boolean;
  assessment: {
    id: number | string;
    title: string;
    passed: boolean;
    percentage: number | string;
  } | null;
  content: LessonContent;
};

export type LearnSection = {
  id: number | string;
  title: string;
  description: string | null;
  order: number;
  lessons: LearnLesson[];
};

export type CourseLearnData = {
  course: {
    id: number | string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    category: string | null;
    teacher_name: string | null;
  };

  enrollment: {
    id: number | string;
    status: string;
    enrolled_at: string;
  };

  progress: {
    completed_lessons: number;
    total_lessons: number;
    percentage: number;
  };

  sections: LearnSection[];

  current_lesson: LearnLesson | null;
};

type State =
  | {
      success: true;
      data: CourseLearnData;
    }
  | {
      success: false;
      message: string;
      status?: number;
    };

export async function getCourseLearnAction(slug: string): Promise<State> {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return {
        success: false,
        status: 401,
        message: "يجب تسجيل الدخول أولًا.",
      };
    }

    const data = await apiRequest<CourseLearnData>({
      path: `/api/progress/learning/${slug}/`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("getCourseLearnAction:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        status: error.status,
        message: error.message || "تعذر تحميل الدورة.",
      };
    }

    return {
      success: false,
      message: "حدث خطأ غير متوقع.",
    };
  }
}
