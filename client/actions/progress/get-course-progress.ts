"use server";

import { serverApiRequest } from "@/lib/api/server";

export type CourseProgressCourse = {
  id: number | string;
  title: string;
  slug: string;
};

export type CourseProgressLesson = {
  id: number | string;
  title: string;
};

export type CourseProgress = {
  id: number | string;
  student: number | string;

  course: CourseProgressCourse;

  completed: boolean;
  completed_lessons: number;
  total_lessons: number;
  progress_percentage: string | number;

  last_lesson: CourseProgressLesson | null;

  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

type ActionResult =
  | {
      success: true;
      data: CourseProgress[];
    }
  | {
      success: false;
      message: string;
      status?: number;
    };

export async function getCourseProgressAction(): Promise<ActionResult> {
  try {
    const data = await serverApiRequest<CourseProgress[]>({
      path: "/api/progress/course-progress/",
      method: "GET",
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("getCourseProgressAction:", error);

    const apiError = error as {
      status?: number;
      message?: string;
    };

    return {
      success: false,
      status: apiError.status,
      message:
        apiError.message ||
        "تعذر تحميل بيانات التقدم الدراسي.",
    };
  }
}