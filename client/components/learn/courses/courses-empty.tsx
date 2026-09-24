
import Link from "next/link";
import { BookOpen, Search } from "lucide-react";

export function CoursesEmpty({
  hasSearch,
}: {
  hasSearch: boolean;
}) {
  return (
    <div className="rounded-xl border border-dashed p-12 text-center">
      {hasSearch ? (
        <Search className="mx-auto size-6 text-muted-foreground" />
      ) : (
        <BookOpen className="mx-auto size-6 text-muted-foreground" />
      )}

      <h3 className="mt-4 font-semibold">
        {hasSearch
          ? "لم يتم العثور على دورة"
          : "لا توجد دورات حتى الآن"}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {hasSearch
          ? "جرّب البحث بكلمة مختلفة."
          : "استكشف الدورات المتاحة وابدأ رحلة التعلم."}
      </p>

      {!hasSearch && (
        <Link
          href="/courses"
          className="mt-5 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          استكشف الدورات
        </Link>
      )}
    </div>
  );
}
