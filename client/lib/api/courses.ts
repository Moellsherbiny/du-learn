import { apiRequest } from "@/lib/api/client";

export type CourseCategory =
  | "FRONTEND"
  | "BACKEND"
  | "FULLSTACK"
  | "FOUNDATION";

export type CourseVisibility = "PUBLIC" | "PRIVATE";

export type PublicCourse = {
  id: number;
  teacher: number;
  teacher_name: string;
  teacher_image: string | null;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  visibility: CourseVisibility;
  category: CourseCategory;
  created_at: string;
  updated_at: string;
};

export async function getPublicCourses() {
  return apiRequest<PublicCourse[]>({
    path: "/api/courses/courses/public",
    method: "GET",
    skipRefresh: true,
  });
}

export interface CourseSection {
  id: number;
  course: number;
  title: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CourseDetails {
  id: number;
  teacher: number;
  teacher_name: string | null;
  teacher_image: string | null;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  category: "FRONTEND" | "BACKEND" | "FULLSTACK" | "FOUNDATION";
  sections: CourseSection[];
  created_at: string;
  updated_at: string;
}

export async function getCourseBySlug(
  slug: string,
): Promise<CourseDetails> {
  return apiRequest<CourseDetails>({
    path: `/api/courses/courses/public/${slug}/`,
    method: "GET",
    skipRefresh: true,
  });
}