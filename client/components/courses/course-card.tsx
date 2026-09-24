import Link from "next/link";
import type { PublicCourse, CourseCategory } from "@/lib/api/courses";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  Layers3,
  Server,
  UserRound,

} from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";

const categoryLabels: Record<CourseCategory, string> = {
  FRONTEND: "تطوير الواجهات",
  BACKEND: "تطوير الخوادم",
  FULLSTACK: "تطوير متكامل",
  FOUNDATION: "الأساسيات",
};

const categoryIcons: Record<
  CourseCategory,
  React.ComponentType<{ className?: string }>
> = {
  FRONTEND: Code2,
  BACKEND: Server,
  FULLSTACK: Layers3,
  FOUNDATION: BookOpen,
};


export function CourseCard({
  course,
  isAuthenticated
}: {
  course: PublicCourse;
  isAuthenticated: boolean;
}) {
  const CategoryIcon =
    categoryIcons[course.category];
  
  return (
    <article className="group overflow-hidden rounded-2xl border border-border/70 bg-card transition-colors duration-200 hover:border-primary/30">
      {/* Thumbnail */}
      <Link
        href={isAuthenticated ? `/courses/${course.slug}` : "/login" }
        className="block"
      >
        <div className="relative aspect-video overflow-hidden bg-muted">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <BookOpen className="size-9 text-muted-foreground/40" />
            </div>
          )}

          {/* Category */}
          <div className="absolute right-4 top-4 flex flex-wrap gap-2">
            <Badge
              variant="outline"
            className="bg-background/50  backdrop-blur-xl"
            >
              <CategoryIcon className="size-3" />
              {categoryLabels[course.category]}
            </Badge>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link
          href={ isAuthenticated ? `/courses/${course.slug}` : "/login"}
          className="block"
        >
          <h3 className="line-clamp-2 text-base font-semibold leading-7 tracking-tight transition-colors group-hover:text-primary">
            {course.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-3 min-h-18 text-sm leading-7 text-muted-foreground">
          {course.description ||
            "استكشف محتوى هذه الدورة وابدأ رحلة التعلم."}
        </p>

        {/* Teacher */}
        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
              {course.teacher_image ? (
                <Image
                  src={course.teacher_image}
                  alt={course.teacher_name}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                <UserRound className="size-3.5 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground">
                المدرس
              </p>

              <p className="truncate text-xs font-medium">
                {course.teacher_name}
              </p>
            </div>
          </div>

          <Link
            href= {isAuthenticated ? `/courses/${course.slug}` : "/login"}
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            aria-label={`عرض دورة ${course.title}`}
          >
            <ArrowLeft className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
