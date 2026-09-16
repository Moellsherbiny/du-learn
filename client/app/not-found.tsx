import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Home,
  LockKeyhole,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6"
    >
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

      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-105 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Logo */}
        <Link
          href="/"
          className="mx-auto mb-10 inline-flex items-center gap-2.5"
        >
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
            <LockKeyhole className="size-4 text-primary" />
          </div>

          <span className="text-sm font-bold tracking-tight">
            DU Learn
          </span>
        </Link>

        {/* 404 Visual */}
        <div className="relative mx-auto mb-8 flex w-fit items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute size-36 rounded-full border border-dashed border-primary/20"
          />

          <span
            aria-hidden="true"
            className="absolute size-28 rounded-full border border-primary/10"
          />

          <div className="relative flex size-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 shadow-sm">
            <BookOpen className="size-8 text-primary" />
          </div>
        </div>

        {/* Content */}
        <p className="text-sm font-medium text-primary">
          الصفحة غير موجودة
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          404
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
          يبدو أن الصفحة التي تبحث عنها غير موجودة، أو ربما تم نقلها إلى
          مكان آخر.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className={buttonVariants({
              variant: "default",
              size: "lg",
            })}
          >
            <Home className="ml-2 size-4" />
            العودة للرئيسية
          </Link>

          <Link
            href="/courses"
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
            })}
          >
            استعراض الدورات
            <ArrowRight className="mr-2 size-4" />
          </Link>
        </div>

        {/* Bottom hint */}
        <div className="mt-10 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          <span>DU Learn · بيئة تعليمية آمنة</span>
        </div>
      </div>
    </main>
  );
}