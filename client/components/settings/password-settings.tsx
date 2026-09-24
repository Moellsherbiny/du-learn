"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { changePassword } from "@/actions/settings/settings-actions";

import {
  passwordSchema,
  type PasswordFormValues,
} from "@/lib/validations/password";

import { PasswordField } from "./password-field";

function getPasswordStrength(
  password: string,
) {
  if (!password) {
    return {
      label: "لم يتم إدخال كلمة مرور",
      percentage: 0,
    };
  }

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return {
      label: "ضعيفة",
      percentage: 35,
    };
  }

  if (score <= 3) {
    return {
      label: "متوسطة",
      percentage: 65,
    };
  }

  return {
    label: "قوية",
    percentage: 100,
  };
}

export function PasswordSettings() {
  const [isPending, startTransition] =
    useTransition();

  const [serverError, setServerError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const newPassword =
    watch("new_password");

  const passwordStrength =
    getPasswordStrength(newPassword);

  const onSubmit = (
    values: PasswordFormValues,
  ) => {
    setServerError(null);
    setSuccessMessage(null);

    const formData = new FormData();

    formData.append(
      "current_password",
      values.current_password,
    );

    formData.append(
      "new_password",
      values.new_password,
    );

    formData.append(
      "confirm_password",
      values.confirm_password,
    );

    startTransition(async () => {
      const result =
        await changePassword(formData);

      if (!result.success) {
        setServerError(
          result.error ||
            "تعذر تغيير كلمة المرور.",
        );

        return;
      }

      setSuccessMessage(
        result.message ||
          "تم تغيير كلمة المرور بنجاح.",
      );

      reset();
    });
  };

  function handleReset() {
    reset();

    setServerError(null);
    setSuccessMessage(null);
  }

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="border-b bg-muted/20 px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LockKeyhole className="size-5" />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-lg">
              تغيير كلمة المرور
            </CardTitle>

            <CardDescription className="mt-1 leading-6">
              قم بتحديث كلمة المرور الخاصة
              بحسابك للحفاظ على أمان حسابك.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <PasswordField
            id="current_password"
            label="كلمة المرور الحالية"
            placeholder="أدخل كلمة المرور الحالية"
            autoComplete="current-password"
            disabled={isPending}
            registration={register(
              "current_password",
            )}
            error={
              errors.current_password
                ?.message
            }
          />

          <div className="border-t pt-6">
            <div className="mb-5">
              <h3 className="text-sm font-semibold">
                كلمة المرور الجديدة
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                استخدم كلمة مرور قوية ولا
                تستخدم كلمة مرور سبق استخدامها
                في حسابات أخرى.
              </p>
            </div>

            <div className="space-y-5">
              <PasswordField
                id="new_password"
                label="كلمة المرور الجديدة"
                placeholder="أدخل كلمة المرور الجديدة"
                autoComplete="new-password"
                disabled={isPending}
                registration={register(
                  "new_password",
                )}
                error={
                  errors.new_password
                    ?.message
                }
              />

              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      قوة كلمة المرور
                    </span>

                    <span className="font-medium">
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${passwordStrength.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <PasswordField
                id="confirm_password"
                label="تأكيد كلمة المرور"
                placeholder="أعد إدخال كلمة المرور الجديدة"
                autoComplete="new-password"
                disabled={isPending}
                registration={register(
                  "confirm_password",
                )}
                error={
                  errors.confirm_password
                    ?.message
                }
              />
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-medium">
                  متطلبات كلمة المرور
                </p>

                <ul className="mt-2 space-y-1 text-xs leading-5 text-muted-foreground">
                  <li>
                    يجب أن تحتوي على 8 أحرف
                    على الأقل.
                  </li>

                  <li>
                    تجنب استخدام معلومات شخصية
                    سهلة التخمين.
                  </li>

                  <li>
                    يفضل استخدام مزيج من الأحرف
                    والأرقام والرموز.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {serverError && (
            <Alert
              variant="destructive"
              className="rounded-xl"
            >
              <AlertCircle className="size-4" />

              <AlertDescription>
                {serverError}
              </AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="rounded-xl border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle2 className="size-4" />

              <AlertDescription>
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={handleReset}
            >
              إعادة تعيين
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="min-w-40"
            >
              {isPending ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <LockKeyhole className="size-4" />
                  تحديث كلمة المرور
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}