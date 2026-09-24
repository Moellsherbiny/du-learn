"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  Loader2,
  PlayCircle,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { joinCourseAction } from "@/actions/enrollments/join-course";
import {
  checkCourseEnrollmentAction,
  CourseEnrollment,
} from "@/actions/enrollments/check-course-enrollment";
import { toast } from "sonner";
import type { CourseDetails } from "@/lib/api/courses";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CourseDetailsClientProps {
  course: CourseDetails;
}

const categoryLabels: Record<CourseDetails["category"], string> = {
  FOUNDATION: "الأساسيات",
  FRONTEND: "تطوير الواجهات",
  BACKEND: "تطوير الخوادم",
  FULLSTACK: "تطوير متكامل",
};

export function CourseDetailsClient({ course }: CourseDetailsClientProps) {
  const totalSections = course.sections.length;
  const router = useRouter();

  const [joining, setJoining] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  const [enrollment, setEnrollment] = useState<{
    id: number | string;
    status: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function checkEnrollment() {
      setCheckingEnrollment(true);
      try {
        const result = await checkCourseEnrollmentAction(course.id);
        if (!mounted) return;
        if (result.success) {
          setEnrollment(result.enrollment);
        } else {
          setEnrollment(null);
        }
      } catch (error) {
        console.error("checkEnrollment error:", error);
        if (mounted) {
          setEnrollment(null);
        }
      } finally {
        if (mounted) {
          setCheckingEnrollment(false);
        }
      }
    }
    checkEnrollment();
    return () => {
      mounted = false;
    };
  }, [course.id]);

  const handleJoinCourse = async () => {
    if (joining) return;
    setJoining(true);
    try {
      const result = await joinCourseAction(course.id);
      console.log("JOIN COURSE RESULT:", result);
      if (!result.success) {
        toast.error(result.message || "تعذر الانضمام إلى الدورة.");
        return;
      }
      /** * Show success toast immediately */ toast.success(
        result.message || "تم الانضمام إلى الدورة بنجاح.",
      );
      /** * Update enrollment state immediately. * * We don't need to wait for another GET request * just to change the button. */ const createdEnrollment =
        result.enrollment as CourseEnrollment | undefined;
      if (createdEnrollment) {
        setEnrollment(createdEnrollment);
      } else {
        /** * Fallback: * If the POST response doesn't contain the full * enrollment object, fetch it again. */ const checkResult =
          await checkCourseEnrollmentAction(course.id);
        if (checkResult.success) {
          setEnrollment(checkResult.enrollment);
        }
      }
      /** * Optional refresh for server-rendered data. */ router.refresh();
    } catch (error) {
      console.error("handleJoinCourse error:", error);
      toast.error("حدث خطأ غير متوقع أثناء الانضمام إلى الدورة.");
    } finally {
      setJoining(false);
    }
  };
  /** * Enrollment status */ const isActive = enrollment?.status === "ACTIVE";
  const isCompleted = enrollment?.status === "COMPLETED";
  return (
    <main dir="rtl" className="min-h-svh overflow-hidden">
      {/* Breadcrumb */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-5 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/courses"
              className="transition-colors hover:text-foreground"
            >
              الكورسات
            </Link>

            <ChevronDown className="size-4 -rotate-90" />

            <span className="text-foreground">{course.title}</span>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-40 -top-40 size-112 rounded-full bg-primary/5 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_1px_1px,hsl(var(--primary)/0.12)_1px,transparent_0)] bg-size-[24px_24px]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            {/* Course Info */}
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {categoryLabels[course.category]}
                </Badge>

                {course.visibility === "PUBLIC" && (
                  <Badge variant="outline">متاح للجميع</Badge>
                )}
              </div>

              <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                {course.description}
              </p>

              {/* Teacher */}
              <div className="mt-8 flex items-center gap-3">
                <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                  {course.teacher_image ? (
                    <Image
                      src={course.teacher_image}
                      alt={course.teacher_name ?? "Teacher"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <UserRound className="size-5 text-muted-foreground" />
                  )}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">المدرس</p>

                  <p className="font-medium">{course.teacher_name ?? "مدرس"}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {checkingEnrollment ? (
                  <Button size="lg" disabled className="gap-2">
                    
                    <Loader2 className="size-4 animate-spin" /> جاري
                    التحقق...{" "}
                  </Button>
                ) : isActive ? (
                  
                    <Link
                    href={`/learn/courses/${course.slug}/`}
                    
                    className={buttonVariants({size:"lg"})}
                    >
                    <PlayCircle className="size-4" /> ابدأ التعلم{" "}
                    <ArrowLeft className="size-4" />{" "}
                  </Link>
                ) : isCompleted ? (
                  <Link
                    href={`/courses/${course.slug}/learn`}
                    
                    className={buttonVariants({size:"lg"})}
                  >
                    
                    <CheckCircle2 className="size-4" /> مراجعة الدورة{" "}
                    <ArrowLeft className="size-4" />{" "}
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    className="gap-2"
                    disabled={joining}
                    onClick={handleJoinCourse}
                  >
                    {" "}
                    {joining ? (
                      <>
                        {" "}
                        <Loader2 className="size-4 animate-spin" /> جاري
                        الانضمام...{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        انضم إلى الدورة <ArrowLeft className="size-4" />{" "}
                      </>
                    )}{" "}
                  </Button>
                )}
                <Button variant="outline" size="lg">
                  <Link href="#course-content">محتوى الكورس</Link>
                </Button>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-muted shadow-sm">
              <div className="relative aspect-video">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-muted">
                    <GraduationCap className="size-20 text-muted-foreground/40" />
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoItem
              icon={BookOpen}
              label="الأقسام"
              value={`${totalSections} أقسام`}
            />

            <InfoItem
              icon={PlayCircle}
              label="نوع المحتوى"
              value="دروس تعليمية"
            />

            <InfoItem
              icon={Clock3}
              label="نظام التعلم"
              value="تعلم بالسرعة المناسبة"
            />
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section
        id="course-content"
        className="border-b border-border/60 bg-muted/20"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-medium text-primary">محتوى الكورس</p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              ماذا ستتعلم؟
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              استكشف أقسام الكورس والمحتوى التعليمي المتاح داخل كل قسم.
            </p>
          </div>

          {course.sections.length > 0 ? (
            <Accordion className="space-y-3">
              {course.sections.map((section, index) => (
                <AccordionItem
                  key={section.id}
                  value={`section-${section.id}`}
                  className="overflow-hidden rounded-2xl border border-border/70 bg-card px-5 shadow-sm"
                >
                  <AccordionTrigger className="py-5 hover:no-underline">
                    <div className="flex items-center gap-4 text-right">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div>
                        <h3 className="font-semibold">{section.title}</h3>

                        {section.description && (
                          <p className="mt-1 text-xs font-normal leading-6 text-muted-foreground">
                            {section.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-5">
                    <div className="mr-14 border-t border-border/60 pt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="size-4 text-primary" />

                        <span>
                          هذا القسم يحتوي على الدروس التعليمية الخاصة بالموضوع.
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <BookOpen className="mx-auto size-10 text-muted-foreground/50" />

              <h3 className="mt-4 font-semibold">محتوى الكورس قيد التجهيز</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                سيتم إضافة الدروس التعليمية قريبًا.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="rounded-3xl border border-border/70 bg-card p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <GraduationCap className="size-6" />
            </div>

            <h2 className="mt-5 text-2xl font-bold">جاهز لبدء التعلم؟</h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              ابدأ رحلتك التعليمية وتقدم في محتوى الكورس خطوة بخطوة.
            </p>

            
              <Link href={`/learn/courses/${course.slug}/`} className={buttonVariants({size:"lg"})}>
                ابدأ التعلم
                <ArrowLeft className="size-4" />
              </Link>
           
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-1 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
