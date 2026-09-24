import { notFound } from "next/navigation";

import { getCourseBySlug } from "@/lib/api/courses";
import { CourseDetailsClient } from "@/components/courses/course-details-client";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({
  params,
}: CoursePageProps) {
  const { slug } = await params;

  try {
    const course = await getCourseBySlug(slug);

    return <CourseDetailsClient course={course} />;
  } catch {
    notFound();
  }
}