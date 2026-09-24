import Link from "next/link";
import {
  ArrowRight,
  KeyRound,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { ForgotPasswordForm } from "@/components/auth/forgot-password/forgot-password-form";

export default function ForgotPasswordPage() {
  return (

      
      <div className="relative z-10 w-full max-w-md">

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
  
  );
}