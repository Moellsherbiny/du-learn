"use server";

import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:8000";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type LearnHomeCourse = {
  id: number | string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  category: string | null;
  teacher_name: string | null;

  progress: {
    completed: boolean;
    completed_lessons: number;
    total_lessons: number;
    percentage: number;
  };
};

export type LearnHomeData = {
  courses: LearnHomeCourse[];

  stats: {
    completed_lessons: number;
    active_courses: number;
    completed_courses: number;
    progress_percentage: number;
  };

  continue_course: LearnHomeCourse | null;
};

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

async function apiFetch<T>(url: string): Promise<T> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    );
  }

  return response.json();
}

/* -------------------------------------------------------------------------- */
/* Learn Home                                                                 */
/* -------------------------------------------------------------------------- */

export async function getLearnHome(): Promise<LearnHomeData> {
  const [enrollments, progressRecords] =
    await Promise.all([
      apiFetch<any>(
        `${API_URL}/api/enrollments/`
      ),

      apiFetch<any>(
        `${API_URL}/api/progress/course-progress/`
      ),
    ]);

  const enrollmentList = Array.isArray(enrollments)
    ? enrollments
    : enrollments.results ?? [];

  const progressList = Array.isArray(progressRecords)
    ? progressRecords
    : progressRecords.results ?? [];

  /* ------------------------------------------------------------------------ */
  /* Progress Map                                                             */
  /* ------------------------------------------------------------------------ */

  const progressMap = new Map<
    string,
    any
  >();

  for (const progress of progressList) {
    const courseId = progress.course?.id;

    if (!courseId) continue;

    progressMap.set(
      String(courseId),
      progress
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Courses                                                                  */
  /* ------------------------------------------------------------------------ */

  const courses: LearnHomeCourse[] =
    enrollmentList
      .filter(
        (enrollment: any) =>
          enrollment.status === "ACTIVE" ||
          enrollment.status === "COMPLETED"
      )
      .map((enrollment: any) => {
        const course =
          enrollment.course_details;

        if (!course) return null;

        const progress =
          progressMap.get(
            String(course.id)
          );

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,

          description:
            course.description ?? null,

          thumbnail:
            course.thumbnail ?? null,

          category:
            course.category ?? null,

          teacher_name:
            course.teacher_name ?? null,

          progress: {
            completed:
              progress?.completed ?? false,

            completed_lessons:
              progress?.completed_lessons ?? 0,

            total_lessons:
              progress?.total_lessons ?? 0,

            percentage:
              Number(
                progress?.progress_percentage ?? 0
              ),
          },
        };
      })
      .filter(Boolean) as LearnHomeCourse[];

  /* ------------------------------------------------------------------------ */
  /* Continue Learning                                                        */
  /* ------------------------------------------------------------------------ */

  const progressWithCourse = progressList
    .map((progress: any) => {
      const courseId =
        progress.course?.id;

      if (!courseId) return null;

      const course = courses.find(
        (item) =>
          String(item.id) ===
          String(courseId)
      );

      if (!course) return null;

      return {
        course,
        updated_at:
          progress.updated_at ?? null,
      };
    })
    .filter(Boolean);

  progressWithCourse.sort(
    (a: any, b: any) => {
      if (!a?.updated_at) return 1;
      if (!b?.updated_at) return -1;

      return (
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
      );
    }
  );

  const continueCourse =
    progressWithCourse[0]?.course ??
    courses.find(
      (course) =>
        !course.progress.completed
    ) ??
    null;

  /* ------------------------------------------------------------------------ */
  /* Statistics                                                               */
  /* ------------------------------------------------------------------------ */

  const totalLessons =
    courses.reduce(
      (total, course) =>
        total +
        course.progress.total_lessons,
      0
    );

  const completedLessons =
    courses.reduce(
      (total, course) =>
        total +
        course.progress.completed_lessons,
      0
    );

  const activeCourses =
    courses.filter(
      (course) =>
        !course.progress.completed
    ).length;

  const completedCourses =
    courses.filter(
      (course) =>
        course.progress.completed
    ).length;

  const progressPercentage =
    totalLessons > 0
      ? Math.round(
          (completedLessons /
            totalLessons) *
            100
        )
      : 0;

  /* ------------------------------------------------------------------------ */
  /* Return                                                                   */
  /* ------------------------------------------------------------------------ */

  return {
    courses,

    continue_course:
      continueCourse,

    stats: {
      completed_lessons:
        completedLessons,

      active_courses:
        activeCourses,

      completed_courses:
        completedCourses,

      progress_percentage:
        progressPercentage,
    },
  };
}