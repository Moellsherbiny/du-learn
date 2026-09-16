"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  MailCheck,
  RefreshCw,
} from "lucide-react";

import { verifyEmail, resendVerificationOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";

type VerifyEmailFormProps = {
  email: string;
};

export function VerifyEmailForm({
  email,
}: VerifyEmailFormProps) {
  const router = useRouter();

  const setUser = useAuthStore(
    (state) => state.setUser,
  );

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] =
    useState(false);

  const [isResending, setIsResending] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [cooldown, setCooldown] =
    useState(0);

  const inputRef =
    useRef<HTMLInputElement>(null);

  /*
   * Countdown for resend.
   */
  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((current) =>
        current > 0 ? current - 1 : 0,
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [cooldown]);

  /*
   * Focus OTP input when page opens.
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function getApiErrorMessage(
    error: unknown,
  ) {
    if (error instanceof ApiError) {
      const detail = error.data.detail;

      if (typeof detail === "string") {
        return detail;
      }

      const nonFieldErrors =
        error.data.non_field_errors;

      if (Array.isArray(nonFieldErrors)) {
        return (
          String(nonFieldErrors[0]) ||
          "تعذر تأكيد البريد الإلكتروني."
        );
      }

      if (
        typeof nonFieldErrors === "string"
      ) {
        return nonFieldErrors;
      }

      return error.message;
    }

    return "حدث خطأ غير متوقع. حاول مرة أخرى.";
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email) {
      setMessage(
        "البريد الإلكتروني غير موجود.",
      );
      return;
    }

    if (otp.length !== 6) {
      setMessage(
        "أدخل رمز التأكيد المكون من 6 أرقام.",
      );
      return;
    }

    setIsVerifying(true);
    setMessage("");

    try {
      await verifyEmail(email, otp);

      /*
       * Update global auth state immediately.
       * No need to wait for /api/auth/user/.
       */
      const currentUser =
        useAuthStore.getState().user;

      if (currentUser) {
        setUser({
          ...currentUser,
          email_verified: true,
        });
      }

      setSuccess(true);
      setOtp("");

      /*
       * Give the success state a moment to render.
       */
      window.setTimeout(() => {
        router.replace("/learn");
        router.refresh();
      }, 700);
    } catch (error) {
      setMessage(
        getApiErrorMessage(error),
      );
      setOtp("");
      inputRef.current?.focus();
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (!email || cooldown > 0 || isResending) {
      return;
    }

    setIsResending(true);
    setMessage("");

    try {
      const result =
        await resendVerificationOtp(email);

      setMessage(
        result.detail ||
          "تم إرسال رمز تأكيد جديد إلى بريدك الإلكتروني.",
      );

      setCooldown(60);
      setOtp("");

      inputRef.current?.focus();
    } catch (error) {
      setMessage(
        getApiErrorMessage(error),
      );
    } finally {
      setIsResending(false);
    }
  }

  if (!email) {
    return (
      <div
        className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm"
        dir="rtl"
      >
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl border border-border bg-background">
          <MailCheck className="size-5 text-muted-foreground" />
        </div>

        <h1 className="text-lg font-semibold">
          البريد الإلكتروني غير موجود
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          افتح صفحة تأكيد البريد من جديد من خلال
          تسجيل الدخول أو التسجيل.
        </p>

        <button
          type="button"
          onClick={() => router.replace("/login")}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          العودة لتسجيل الدخول
          <ArrowLeft className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-border/60 bg-card shadow-sm"
      dir="rtl"
    >
      <div className="flex flex-col items-center px-6 py-9 text-center sm:px-8">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-background shadow-sm">
            <LockKeyhole className="size-4 text-primary" />
          </span>

          <span className="text-base font-semibold tracking-tight">
            DU Learn
          </span>
        </div>

        {success ? (
          <>
            <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-7 text-primary" />
            </div>

            <h1 className="text-xl font-semibold tracking-tight">
              تم تأكيد البريد الإلكتروني
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              تم تأكيد بريدك الإلكتروني بنجاح.
            </p>

            <p className="mt-5 text-xs text-muted-foreground">
              جاري تحويلك إلى النظام...
            </p>
          </>
        ) : (
          <>
            <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="size-7 text-primary" />
            </div>

            <h1 className="text-xl font-semibold tracking-tight">
              تأكيد البريد الإلكتروني
            </h1>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              أرسلنا رمز تأكيد مكونًا من 6 أرقام
              إلى بريدك الإلكتروني.
            </p>

            <p
              className="mt-2 max-w-full truncate text-sm font-medium"
              title={email}
              dir="ltr"
            >
              {email}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 w-full"
            >
              <label
                htmlFor="otp"
                className="mb-3 block text-right text-sm font-medium"
              >
                رمز التأكيد
              </label>

              <input
                ref={inputRef}
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                disabled={isVerifying}
                onChange={(event) => {
                  const value =
                    event.target.value.replace(
                      /\D/g,
                      "",
                    );

                  setOtp(value);
                  setMessage("");
                }}
                className="h-14 w-full rounded-xl border border-input bg-background px-4 text-center text-2xl font-semibold tracking-[0.45em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="••••••"
                dir="ltr"
              />

              {message && (
                <p
                  className="mt-3 text-sm text-destructive"
                  role="alert"
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  otp.length !== 6 ||
                  isVerifying
                }
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  "تأكيد البريد الإلكتروني"
                )}
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">
                لم يصلك الرمز؟
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={
                  cooldown > 0 ||
                  isResending
                }
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : cooldown > 0 ? (
                  <>
                    <RefreshCw className="size-4" />
                    إعادة الإرسال بعد {cooldown} ثانية
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-4" />
                    إعادة إرسال الرمز
                  </>
                )}
              </button>
            </div>
          </>
        )}

        <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <LockKeyhole className="size-3.5" />
          <span>
            تأكيد البريد الإلكتروني يساعد في حماية حسابك.
          </span>
        </div>
      </div>
    </div>
  );
}