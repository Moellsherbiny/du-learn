import Link from "next/link";
import {
  ArrowRight,
  KeyRound,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-[calc(100svh-1px)] items-center justify-center overflow-hidden px-6 py-12"
    >
      {/* Dotted background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 18%, transparent) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-105 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
          >
            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
              <LockKeyhole className="size-4 text-primary" />
            </div>

            <span className="text-sm font-bold tracking-tight">
              DU Learn
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur-xl sm:p-8">
          {/* Icon */}
          <div className="flex size-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/5">
            <KeyRound className="size-5 text-primary" />
          </div>

          {/* Heading */}
          <div className="mt-6">
            <h1 className="text-xl font-semibold tracking-tight">
              نسيت كلمة المرور؟
            </h1>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              أدخل بريدك الإلكتروني وسنرسل لك تعليمات إعادة تعيين كلمة
              المرور.
            </p>
          </div>

          {/* Form */}
          <div className="mt-7">
            <ForgotPasswordForm />
          </div>

          {/* Back to login */}
          <div className="mt-6 border-t border-border/60 pt-5 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowRight className="size-3.5" />
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-5 flex items-start gap-3 px-2 text-[11px] leading-5 text-muted-foreground">
          <Mail className="mt-0.5 size-3.5 shrink-0 text-primary" />

          <p>
            سيتم إرسال رسالة إلى البريد الإلكتروني المرتبط بحسابك إذا كان
            مسجلًا في النظام.
          </p>
        </div>
      </div>
    </main>
  );
}