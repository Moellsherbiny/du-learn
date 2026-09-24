"use client";

import { useEffect, useMemo, useState } from "react";

import { getMyCoursesAction } from "@/actions/enrollments/get-my-courses";
import type { Enrollment } from "@/types/course";
import { MyCoursesHeader } from "./my-courses-header";
import { MyCoursesStats } from "./my-courses-stats";
import { MyCoursesFilters } from "./my-courses-filters";
import { CourseCard } from "./course-card";
import { CoursesEmpty } from "./courses-empty";

export type CourseFilter =
  | "ALL"
  | "ACTIVE"
  | "COMPLETED"
  | "SUSPENDED"
  | "CANCELLED";

export function MyCoursesClient() {
  const [courses, setCourses] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CourseFilter>("ALL");

  useEffect(() => {
    async function loadCourses() {
      try {
        const result = await getMyCoursesAction();

        if (result.success) {
          setCourses(result.courses);
        }
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((enrollment) => {
      const matchesFilter = filter === "ALL" || enrollment.status === filter;

      const course = enrollment.course_details;

      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [courses, search, filter]);

  const stats = useMemo(
    () => ({
      total: courses.length,

      active: courses.filter((item) => item.status === "ACTIVE").length,

      completed: courses.filter((item) => item.status === "COMPLETED").length,
    }),
    [courses],
  );

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        جاري تحميل الدورات...
      </div>
    );
  }

  return (
    <main dir="rtl" className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <MyCoursesHeader />

      <MyCoursesStats
        total={stats.total}
        inProgress={stats.active}
        completed={stats.completed}
      />

      <MyCoursesFilters
        search={search}
        filter={filter}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />

      {filteredCourses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((enrollment) => (
            <CourseCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      ) : (
        <CoursesEmpty hasSearch={Boolean(search)} />
      )}
    </main>
  );
}
