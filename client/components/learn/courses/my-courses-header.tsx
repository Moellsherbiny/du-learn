
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function MyCoursesHeader() {
  return (
    <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm text-muted-foreground">
          مساحة التعلم / دوراتي
        </p>

        <h1 className="mt-2 text-2xl font-semibold">
          دوراتي التعليمية
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          تابع الدورات التي اشتركت بها وتقدمك في التعلم.
        </p>
      </div>

      <Link
        href="/courses"
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-muted"
      >
        <GraduationCap className="size-4" />
        استكشف الدورات
      </Link>
    </header>
  );
}
