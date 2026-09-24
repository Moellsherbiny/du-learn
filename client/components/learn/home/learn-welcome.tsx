import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMediaUrl } from "@/lib/get-media-url";

type Props = {
  firstName: string;
  lastName: string;
  image?: string;
};

export function LearnWelcome({ firstName, lastName, image }: Props) {
  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((name) => name.trim().charAt(0))
      .join("")
      .toUpperCase() || "ط";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card mb-4">
      {/* Decorative line */}
      <div className="pointer-events-none absolute inset-s-0 top-0 h-full w-px bg-primary/20" />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          {/* Welcome */}
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 shrink-0 sm:size-16">
                <AvatarImage src={getMediaUrl(image)} alt={firstName} />
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <h2 className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-2xl sm:text-3xl">
                  <span className="font-normal text-muted-foreground">
                    أهلًا،
                  </span>

                  <span className="relative inline-block font-black tracking-tight">
                    {firstName} {lastName}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-primary/30"
                    />
                  </span>
                </h2>
              </div>
            </div>

            <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
              تابع تقدمك، واكتشف ما أنجزته، وأكمل رحلتك التعليمية من حيث توقفت.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/courses"
              className="
                group inline-flex h-10 items-center
                justify-center gap-2 rounded-xl
                border border-border/70
                bg-background px-4
                text-sm font-medium
                transition-all duration-200
                hover:bg-muted
              "
            >
              <BookOpen className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              <span>استكشف الدورات</span>
            </Link>

            <Link
              href="/learn/courses"
              className="
                group inline-flex h-10 items-center
                justify-center gap-2 rounded-xl
                bg-primary px-4
                text-sm font-medium
                text-primary-foreground
                transition-all duration-200
                hover:bg-primary/90
              "
            >
              <span>دوراتي</span>

              <ArrowLeft
                className="
                  size-4
                  transition-transform duration-200
                  group-hover:-translate-x-1
                "
              />
            </Link>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-7 flex items-center gap-3 border-t border-border/50 pt-5">
          <div className="h-px w-8 bg-primary/40" />

          <p className="text-xs text-muted-foreground">
            تعلّم بخطواتك، وتقدم بالوتيرة التي تناسبك.
          </p>
        </div>
      </div>
    </section>
  );
}
