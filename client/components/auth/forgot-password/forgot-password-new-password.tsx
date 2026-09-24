"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { resetPasswordAction } from "@/actions/auth/reset-password/reset";
import { PasswordCriteria } from "@/components/auth/password-criteria";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ForgotPasswordNewPasswordProps = {
  resetToken: string;
  onSuccess: () => void;
};

export function ForgotPasswordNewPassword({
  resetToken,
  onSuccess,
}: ForgotPasswordNewPasswordProps) {
  const [isPending, startTransition] = useTransition();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!password) {
      setError("أدخل كلمة المرور الجديدة.");
      return;
    }

    if (password.length < 8) {
      setError("كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل.");
      return;
    }

    if (!confirmPassword) {
      setError("أعد إدخال كلمة المرور.");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    if (!resetToken) {
      setError(
        "جلسة إعادة تعيين كلمة المرور غير صالحة. يرجى بدء العملية من جديد.",
      );
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await resetPasswordAction({
        reset_token: resetToken,
        new_password: password,
        confirm_password: confirmPassword,
      });

      if (!result.success) {
        const message =
          result.message ??
          "تعذر تغيير كلمة المرور. يرجى المحاولة مرة أخرى.";

        setError(message);
        toast.error(message);

        return;
      }

      toast.success(
        result.message ?? "تم تغيير كلمة المرور بنجاح.",
      );

      onSuccess();
    });
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
          <LockKeyhole className="size-5 text-primary" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">
          إنشاء كلمة مرور جديدة
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          اختر كلمة مرور قوية جديدة لحماية حسابك.
        </p>
      </div>

      {/* New Password */}
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor="new-password">
          كلمة المرور الجديدة
        </FieldLabel>

        <div className="relative">
          <Input
            id="new-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);

              if (error) {
                setError("");
              }
            }}
            placeholder="أدخل كلمة المرور الجديدة"
            autoComplete="new-password"
            disabled={isPending}
            dir="ltr"
            className="h-11 pl-11 text-left"
            aria-invalid={!!error}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            disabled={isPending}
            aria-label={
              showPassword
                ? "إخفاء كلمة المرور"
                : "إظهار كلمة المرور"
            }
            className="absolute left-0 top-0 flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        <PasswordCriteria password={password} />
      </Field>

      {/* Confirm Password */}
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor="confirm-password">
          تأكيد كلمة المرور
        </FieldLabel>

        <div className="relative">
          <Input
            id="confirm-password"
            type={
              showConfirmPassword ? "text" : "password"
            }
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);

              if (error) {
                setError("");
              }
            }}
            placeholder="أعد إدخال كلمة المرور"
            autoComplete="new-password"
            disabled={isPending}
            dir="ltr"
            className="h-11 pl-11 text-left"
            aria-invalid={!!error}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (current) => !current,
              )
            }
            disabled={isPending}
            aria-label={
              showConfirmPassword
                ? "إخفاء كلمة المرور"
                : "إظهار كلمة المرور"
            }
            className="absolute left-0 top-0 flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </Field>

      {error && <FieldError>{error}</FieldError>}

      <Button
        type="submit"
        size="lg"
        className="w-full disabled:cursor-not-allowed"
        disabled={
          isPending ||
          !password ||
          !confirmPassword ||
          password !== confirmPassword
        }
      >
        {isPending ? (
          <>
            <Loader2 className="ml-2 size-4 animate-spin" />
            جارٍ تغيير كلمة المرور...
          </>
        ) : (
          "حفظ كلمة المرور الجديدة"
        )}
      </Button>
    </form>
  );
}