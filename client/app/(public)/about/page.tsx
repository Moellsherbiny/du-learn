import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

const principles = [
  {
    icon: BookOpen,
    title: "التعلم المنظم",
    description:
      "تنظيم المحتوى التعليمي في صورة دورات ووحدات ودروس وتقييمات تساعد الطالب على متابعة مساره التعليمي بصورة واضحة.",
  },
  {
    icon: ShieldCheck,
    title: "أمن الاتصال",
    description:
      "إضافة طبقة أمنية مخصصة لحماية البيانات المتبادلة بين الواجهة الأمامية والخادم أثناء تنفيذ عمليات النظام.",
  },
  {
    icon: GraduationCap,
    title: "تجربة تعليمية واضحة",
    description:
      "تصميم الواجهة بحيث تكون الوظائف التعليمية الأساسية سهلة الوصول، مع الحفاظ على بساطة التجربة وتركيزها على الطالب.",
  },
];

const securityFeatures = [
  "تبادل آمن للمفاتيح بين الأطراف",
  "اشتقاق مفاتيح تشفير باستخدام خوارزميات مخصصة لذلك",
  "تشفير البيانات المتبادلة باستخدام تشفير متماثل حديث",
  "استخدام التوقيعات الرقمية للتحقق من مصدر البيانات",
  "الحماية من إعادة إرسال الطلبات القديمة",
  "إدارة دورة حياة المفاتيح وإمكانية تدويرها",
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(71,85,105,0.18)_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(circle,rgba(148,163,184,0.16)_1.5px,transparent_1.5px)]"
        style={{
          backgroundSize: "24px 24px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-105 w-175 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl"
      />

      {/* Hero */}
      <section className="relative border-b overflow-hidden border-border/60">
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0"
  style={{
    backgroundImage:
      "radial-gradient(circle, color-mix(in oklab, var(--primary) 24%, transparent) 1.5px, transparent 1.5px)",
    backgroundSize: "24px 24px",
  }}
/>
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur">
              <LockKeyhole className="size-4 text-primary" />
              <span>عن مشروع DU Learn</span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              بيئة تعليمية تجمع بين
              <span className="block text-primary">التعلم وأمن الاتصال</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              DU Learn هو مشروع تعليمي يهدف إلى توفير بيئة منظمة للتعلم
              الإلكتروني، مع الاهتمام بحماية البيانات المتبادلة بين الطالب
              والنظام من خلال طبقة أمنية مخصصة.
            </p>
          </div>
        </div>
      </section>

      {/* Project idea */}
      <section className="border-b border-border/60 bg-background/80">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-medium text-primary">فكرة المشروع</p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                نظام تعليمي مع طبقة حماية مستقلة
              </h2>
            </div>

            <div className="space-y-5 text-sm leading-8 text-muted-foreground sm:text-base">
              <p>
                يعتمد المشروع على بناء نظام تعليمي يسمح بإدارة المحتوى التعليمي
                ومتابعة الدروس والتقييمات والتقدم الدراسي من خلال واجهة واحدة.
              </p>

              <p>
                وبجانب الوظائف التعليمية، يحتوي النظام على طبقة أمنية مستقلة
                مسؤولة عن تأمين الاتصال وتوفير آليات للتحقق من سلامة ومصدر
                البيانات المتبادلة.
              </p>

              <p>
                فصل هذه الطبقة عن منطق النظام التعليمي يجعل المسؤوليات أكثر
                وضوحًا، ويسمح بتطوير الجانب الأمني دون ربطه مباشرة بالوظائف
                التعليمية الأساسية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">مبادئ المشروع</p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              ثلاثة محاور أساسية
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              تم بناء فكرة DU Learn حول الجمع بين الجانب التعليمي والجانب التقني
              والأمني دون أن يطغى أحدهما على الآخر.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border/70 bg-background/85 p-6 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted/50">
                    <Icon className="size-5 text-primary" />
                  </div>

                  <h3 className="mt-5 text-base font-semibold">{item.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <ShieldCheck className="size-5 text-primary" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                الجانب الأمني
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                من أهم جوانب المشروع تصميم طبقة أمنية تعمل بجانب الاتصال
                التقليدي عبر الشبكة، بهدف إضافة آليات إضافية لحماية الرسائل
                والطلبات المتبادلة بين النظام والعميل.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background p-6 shadow-sm">
              <div className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </span>

                    <p className="text-sm leading-6 text-foreground/85">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">بنية النظام</p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              فصل واضح بين المسؤوليات
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              تم تصميم النظام بحيث تكون الوظائف التعليمية والأمنية منفصلة
              منطقيًا، مما يسهل تطوير كل جزء واختباره وصيانته بشكل مستقل.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="grid gap-3 sm:grid-cols-3">
              <ArchitectureCard
                title="الواجهة"
                description="تجربة الطالب والوصول إلى المحتوى التعليمي."
              />

              <ArchitectureCard
                title="النظام التعليمي"
                description="الدورات والدروس والتقييمات ومتابعة التقدم."
              />

              <ArchitectureCard
                title="طبقة الحماية"
                description="تأمين الاتصال والتحقق من سلامة البيانات."
              />
            </div>

            <div className="mx-auto mt-3 h-8 w-px bg-border" />

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
              <LockKeyhole className="mx-auto size-5 text-primary" />

              <p className="mt-2 text-sm font-medium">
                اتصال محمي بين مكونات النظام
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="rounded-3xl border border-border bg-background/90 px-6 py-10 text-center shadow-sm sm:px-10">
            <BookOpen className="mx-auto size-7 text-primary" />

            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              ابدأ باستكشاف البيئة التعليمية
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              تعرّف على الدورات التعليمية والمحتوى المتاح داخل DU Learn.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/courses"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
              
              >
                استعراض الدورات التعليمية
                <ArrowLeft className="size-4" />
              </Link>

              <Link href="/"
              className={buttonVariants({ variant: "default", size: "lg" })}
              
              >العودة إلى الرئيسية</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ArchitectureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/85 p-5 text-center shadow-sm">
      <div className="mx-auto flex size-9 items-center justify-center rounded-lg bg-muted">
        <span className="size-2 rounded-full bg-primary" />
      </div>

      <h3 className="mt-4 text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
