"use client";

import { useState, useTransition } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { verifyPasswordResetOtpAction } from "@/actions/auth/forgot-password/verify";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ForgotPasswordOtpProps = {
  email: string;
  onSuccess: (resetToken: string) => void;
  onBack: () => void;
};

export function ForgotPasswordOtp({
  email,
  onSuccess,
  onBack,
}: ForgotPasswordOtpProps) {
  const [isPending, startTransition] = useTransition();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = otp.trim();

    if (!value) {
      setError("أدخل رمز التحقق.");
      return;
    }

    if (!/^\d{6}$/.test(value)) {
      setError("رمز التحقق يجب أن يتكون من 6 أرقام.");
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await verifyPasswordResetOtpAction({
        email,
        otp: value,
      });

      if (!result.success) {
        const message =
          result.message ??
          "رمز التحقق غير صحيح أو منتهي الصلاحية.";

        setError(message);
        toast.error(message);

        return;
      }

      toast.success("تم التحقق من الرمز بنجاح.");

      onSuccess(result.reset_token);
    });
  }

  function handleOtpChange(value: string) {
    const numericValue = value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(numericValue);

    if (error) {
      setError("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      dir="rtl"
      noValidate
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
          <ShieldCheck className="size-5 text-primary" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">
          تحقق من بريدك الإلكتروني
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          أرسلنا رمز تحقق مكونًا من 6 أرقام إلى:
        </p>

        <p
          className="mt-1 max-w-full truncate text-sm font-medium"
          dir="ltr"
          title={email}
        >
          {email}
        </p>
      </div>

      <Field data-invalid={!!error}>
        <FieldLabel htmlFor="password-reset-otp">
          رمز التحقق
        </FieldLabel>

        <Input
          id="password-reset-otp"
          value={otp}
          onChange={(event) =>
            handleOtpChange(event.target.value)
          }
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          disabled={isPending}
          aria-invalid={!!error}
          dir="ltr"
          className="h-12 text-center text-lg font-semibold tracking-[0.45em]"
        />

        <FieldDescription>
          أدخل الرمز المرسل إلى بريدك الإلكتروني.
        </FieldDescription>

        {error && <FieldError>{error}</FieldError>}
      </Field>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={isPending}
          onClick={onBack}
        >
          العودة
        </Button>

        <Button
          type="submit"
          className="flex-1 disabled:cursor-not-allowed"
          disabled={isPending || otp.length !== 6}
        >
          {isPending ? (
            <>
              <Loader2 className="ml-2 size-4 animate-spin" />
              جارٍ التحقق...
            </>
          ) : (
            "تحقق من الرمز"
          )}
        </Button>
      </div>
    </form>
  );
}