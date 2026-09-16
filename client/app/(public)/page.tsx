import Link from "next/link";
import { ArrowLeft, BookOpen, LockKeyhole, ShieldCheck } from "lucide-react";

import { getMeAction } from "@/actions/auth/me";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function HomePage() {
  const { authenticated } = await getMeAction();

  return (
    <main dir="rtl" className="min-h-svh overflow-hidden">
      {/* Hero */}
      <section className="relative border-b border-border/60">
        {/* Dotted background */}
       <div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0"
  style={{
    backgroundImage:
      "radial-gradient(circle, color-mix(in oklab, var(--primary) 24%, transparent) 1.5px, transparent 1.5px)",
    backgroundSize: "24px 24px",
  }}
/>

        {/* Soft background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-112 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
        />

        <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl items-center px-6 py-20 lg:px-8">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
            {/* Content */}
            <div className="max-w-xl">
              <h1 className="mt-6 text-3xl font-bold leading-[1.3] tracking-tight sm:text-4xl lg:text-5xl">
                بيئة تعليمية
                <br />
                <span className="text-primary">تراعي أمن الاتصال.</span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                DU Learn منصة تعليمية تهدف إلى تنظيم العملية التعليمية وإتاحة
                الدورات والدروس والتقييم، مع دمج طبقة مستقلة لحماية البيانات
                المتبادلة أثناء الاتصال بالنظام.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {authenticated ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      variant: "default",
                      size: "lg",
                    })}
                  >
                    الانتقال إلى لوحة التعلم
                    <ArrowLeft className="mr-2 size-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className={buttonVariants({
                        variant: "default",
                        size: "lg",
                      })}
                    >
                      ابدأ التعلم
                      <ArrowLeft className="mr-2 size-4" />
                    </Link>

                    <Link
                      href="/courses"
                      className={buttonVariants({
                        variant: "secondary",
                        size: "lg",
                      })}
                    >
                      استعراض الدورات التعليمية
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Security Visual */}
            <div className="mx-auto w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur-sm">
                {/* Decorative dots */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 size-32 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(100,116,139,0.35) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                <div className="relative">
                  {/* Header */}
                  <div className="mb-7 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        بنية الاتصال
                      </p>

                      <h3 className="mt-1 text-sm font-semibold">
                        طبقة حماية مستقلة
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1.5">
                      <span className="size-1.5 rounded-full bg-primary" />
                      <span className="text-[10px] font-medium text-primary">
                        محمي
                      </span>
                    </div>
                  </div>

                  {/* Flow */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Content */}
                    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                      <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background">
                        <BookOpen className="size-5 text-muted-foreground" />
                      </div>

                      <p className="mt-3 text-xs font-semibold">المحتوى</p>

                      <p className="mt-1 text-[10px] text-muted-foreground">
                        دروس وتقييمات
                      </p>
                    </div>

                    {/* Connection */}
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="h-px w-7 bg-border" />

                      <div className="flex size-10 items-center justify-center rounded-full border border-primary/20 bg-primary/5">
                        <LockKeyhole className="size-4 text-primary" />
                      </div>

                      <div className="h-px w-7 bg-border" />
                    </div>

                    {/* Security */}
                    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                      <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5">
                        <ShieldCheck className="size-5 text-primary" />
                      </div>

                      <p className="mt-3 text-xs font-semibold">الحماية</p>

                      <p className="mt-1 text-[10px] text-muted-foreground">
                        تأمين البيانات
                      </p>
                    </div>
                  </div>

                  {/* Bottom information */}
                  <div className="mt-7 border-t border-border/60 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        حالة الاتصال
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/30" />
                          <span className="relative size-2 rounded-full bg-primary" />
                        </span>

                        <span className="text-[10px] font-medium">
                          اتصال آمن
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Concept */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.55fr_1fr] lg:gap-20">
            <div>
              <p className="text-xs font-medium text-primary">فكرة المشروع</p>

              <h2 className="mt-3 text-2xl font-bold leading-relaxed tracking-tight">
                التعليم والأمان
                <br />
                ضمن بيئة واحدة.
              </h2>
            </div>

            <div className="max-w-2xl">
              <p className="text-sm leading-8 text-muted-foreground sm:text-base">
                صُممت DU Learn كنظام تعليمي تتفاعل مكوناته المختلفة من خلال
                الشبكة، بداية من المحتوى التعليمي ووصولًا إلى التقييم ومتابعة
                التقدم.
              </p>

              <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
                وبجانب الوظائف التعليمية، يتضمن النظام طبقة مخصصة لحماية الاتصال
                والبيانات الحساسة، مع الحفاظ على فصلها عن منطق التطبيق الأساسي.
              </p>

              <div className="mt-7 border-r-2 border-primary/40 pr-4">
                <p className="text-sm font-medium leading-7">
                  بهذه الطريقة تصبح تقنيات التشفير وأمن الاتصالات جزءًا من تصميم
                  النظام نفسه، وليس مكوّنًا منفصلًا عنه.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-18 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-medium text-primary">مبادئ النظام</p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight">
              مبادئ التصميم
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Principle
              number="١"
              title="التعلم أولًا"
              description="تبقى مكونات العملية التعليمية مستقلة عن تفاصيل طبقة الحماية."
            />

            <Principle
              number="٢"
              title="طبقة حماية مستقلة"
              description="تُنفذ آليات حماية الاتصال ضمن طبقة مخصصة يمكن تطويرها بصورة مستقلة."
            />

            <Principle
              number="٣"
              title="الأمان ضمن التصميم"
              description="تُراعى حماية البيانات والاتصال منذ بناء النظام وليس كإضافة لاحقة."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-7 rounded-2xl border border-border bg-card px-6 py-8 sm:flex-row sm:items-center sm:px-8">
            <div>
              <h2 className="text-xl font-bold">
                {authenticated
                  ? "تابع رحلتك التعليمية"
                  : "ابدأ رحلتك التعليمية"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {authenticated
                  ? "انتقل إلى لوحة التعلم للوصول إلى محتواك التعليمي."
                  : "أنشئ حسابًا للوصول إلى البيئة التعليمية والدورات المتاحة."}
              </p>
            </div>

            <Link
              className={buttonVariants({ variant: "default", size: "lg" })}
              href={authenticated ? "/dashboard" : "/register"}
            >
              {authenticated ? "لوحة التعلم" : "إنشاء حساب"}

              <ArrowLeft className="mr-2 size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function SystemItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}) {
  return (
    <div className="relative z-10 flex items-center gap-4">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
        <Icon className="size-5 text-primary" />
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function Principle({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs font-medium text-primary">{number}</span>

        <Separator className="w-8" />
      </div>

      <h3 className="text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
