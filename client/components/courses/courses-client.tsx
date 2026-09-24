"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  Layers3,
  Search,
  Server,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {CourseCard} from "./course-card"
import type {
  CourseCategory,
  PublicCourse,
} from "@/lib/api/courses";
import { useAuthStore } from "@/stores/auth-store";

type CoursesClientProps = {
  courses: PublicCourse[];
};



const categories: {
  value: CourseCategory | "ALL";
  label: string;
}[] = [
  {
    value: "ALL",
    label: "جميع الدورات",
  },
  {
    value: "FRONTEND",
    label: "تطوير الواجهات",
  },
  {
    value: "BACKEND",
    label: "تطوير الخوادم",
  },
  {
    value: "FULLSTACK",
    label: "تطوير متكامل",
  },
  {
    value: "FOUNDATION",
    label: "الأساسيات",
  },
];

export function CoursesClient({
  courses,
}: CoursesClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<
    CourseCategory | "ALL"
  >("ALL");

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesCategory =
        category === "ALL" ||
        course.category === category;

      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.description
          ?.toLowerCase()
          .includes(query) ||
        course.teacher_name
          ?.toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [courses, search, category]);


  const {isAuthenticated} = useAuthStore();


  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-medium text-primary">
                استكشف المحتوى
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                الدورات المتاحة
              </h2>

              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                اختر الدورة التي تناسب أهدافك وابدأ التعلم.
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {filteredCourses.length}
              </span>{" "}
              دورة
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="ابحث عن دورة أو مدرس..."
              className="h-11 rounded-xl border-border bg-background pr-10 pl-10"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="مسح البحث"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((item) => {
              const active = category === item.value;

              return (
                <Button
                  key={item.value}
                  type="button"
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setCategory(item.value)
                  }
                  className="rounded-full"
                >
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-border/60" />

        {/* Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isAuthenticated= {isAuthenticated}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            hasSearch={Boolean(search.trim())}
            onReset={() => {
              setSearch("");
              setCategory("ALL");
            }}
          />
        )}
      </div>
    </section>
  );
}


function EmptyState({
  hasSearch,
  onReset,
}: {
  hasSearch: boolean;
  onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-border bg-background">
        {hasSearch ? (
          <Search className="size-5 text-muted-foreground" />
        ) : (
          <Sparkles className="size-5 text-muted-foreground" />
        )}
      </div>

      <h3 className="mt-5 text-sm font-semibold">
        {hasSearch
          ? "لم يتم العثور على دورات"
          : "لا توجد دورات متاحة حاليًا"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        {hasSearch
          ? "جرّب البحث باستخدام كلمات مختلفة أو اختر تصنيفًا آخر."
          : "سيتم عرض الدورات التعليمية المتاحة هنا عند نشرها."}
      </p>

      {hasSearch && (
        <Button
          variant="outline"
          size="sm"
          className="mt-5 rounded-full"
          onClick={onReset}
        >
          مسح البحث والتصفية
        </Button>
      )}
    </div>
  );
}