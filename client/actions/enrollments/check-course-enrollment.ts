
"use server";

import { cookies } from "next/headers";
import { ApiError, apiRequest } from "@/lib/api/client";

export type EnrollmentStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "SUSPENDED"
  | "CANCELLED"
  | string;

export type CourseEnrollment = {
  id: number | string;
  course: number | string | {
    id?: number | string;
  };
  status: EnrollmentStatus;
  enrolled_at?: string;
  completed_at?: string | null;
  suspended_at?: string | null;
  cancelled_at?: string | null;
};

type EnrollmentResponse =
  | CourseEnrollment[]
  | {
      count?: number;
      next?: string | null;
      previous?: string | null;
      results?: CourseEnrollment[];
    };

export type CheckEnrollmentState = {
  success: boolean;
  enrolled: boolean;
  enrollment: CourseEnrollment | null;
  message?: string;
};

function getResults(
  response: EnrollmentResponse,
): CourseEnrollment[] {
  if (Array.isArray(response)) {
    return response;
  }

  return Array.isArray(response.results)
    ? response.results
    : [];
}

function isSameCourse(
  enrollment: CourseEnrollment,
  courseId: string | number,
) {
  const enrollmentCourse = enrollment.course;

  if (
    typeof enrollmentCourse === "object" &&
    enrollmentCourse !== null
  ) {
    return String(enrollmentCourse.id) === String(courseId);
  }

  return (
    String(enrollmentCourse) === String(courseId)
  );
}

export async function checkCourseEnrollmentAction(
  courseId: string | number,
): Promise<CheckEnrollmentState> {
  try {
    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return {
        success: true,
        enrolled: false,
        enrollment: null,
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

    const enrollments = getResults(response);

    const enrollment =
      enrollments.find((item) =>
        isSameCourse(item, courseId),
      ) ?? null;

    return {
      success: true,
      enrolled: enrollment !== null,
      enrollment,
    };
  } catch (error) {
    console.error(
      "checkCourseEnrollmentAction error:",
      error,
    );

    if (error instanceof ApiError) {
      return {
        success: false,
        enrolled: false,
        enrollment: null,
        message:
          error.message ||
          "تعذر التحقق من حالة الاشتراك.",
      };
    }

    return {
      success: false,
      enrolled: false,
      enrollment: null,
      message:
        "حدث خطأ أثناء التحقق من الاشتراك.",
    };
  }
}
