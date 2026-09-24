import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export function ContinueLearningEmpty() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
      <div className="mx-auto flex size-11 items-center justify-center rounded-lg bg-muted">
        <BookOpen className="size-5 text-muted-foreground" />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        لم تبدأ أي دورة بعد
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
        اختر دورة من الدورات المتاحة وابدأ رحلة التعلم الخاصة بك.
      </p>

      <Link
        href="/courses"
        className="
          mt-5 inline-flex h-9 items-center justify-center gap-2
          rounded-lg bg-primary px-4 text-sm font-medium
          text-primary-foreground transition-colors
          hover:bg-primary/90
        "
      >
        استكشف الدورات
        <ArrowLeft className="size-4" />
      </Link>
    </div>
  );
}