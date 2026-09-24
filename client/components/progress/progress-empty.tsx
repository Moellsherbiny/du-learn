"use client";

import Link from "next/link";
import { ArrowLeft, ChartNoAxesColumnIncreasing } from "lucide-react";

export function ProgressEmpty() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-180px)] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 shadow-sm">
          <ChartNoAxesColumnIncreasing className="size-9 text-muted-foreground" />
        </div>

        {/* Content */}
        <div className="mt-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            لم تبدأ رحلتك التعليمية بعد
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            عندما تبدأ دراسة الدروس وإكمال الأنشطة، سيظهر تقدمك الدراسي
            هنا بشكل واضح.
          </p>
        </div>

        {/* Action */}
      <Link
  href="/learn"
  className="
    group mt-6 inline-flex h-10 items-center gap-2
    rounded-lg bg-primary px-4
    text-sm font-medium text-primary-foreground
    shadow-sm
    transition-all duration-200
    hover:bg-primary/90
    hover:shadow-md
  "
>
          <span>ابدأ التعلم</span>

          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}