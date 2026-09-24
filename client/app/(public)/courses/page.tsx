import { getPublicCourses } from "@/lib/api/courses";
import { CoursesClient } from "@/components/courses/courses-client";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getPublicCourses();

  return (
    <main
      dir="rtl"
      className="min-h-svh overflow-hidden"
    >
      {/* Hero */}
      <section className="relative border-b border-border/60">
        {/* Dotted background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, color-mix(in oklab, var(--primary) 20%, transparent) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Soft glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-112 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-primary">
              المحتوى التعليمي
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              الدورات التعليمية
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
              استكشف الدورات التعليمية المتاحة وابدأ رحلة التعلم
              من خلال محتوى منظم يساعدك على تطوير مهاراتك خطوة بخطوة.
            </p>
          </div>
        </div>
      </section>

      {/* Courses */}
      <CoursesClient courses={courses} />
    </main>
  );
}