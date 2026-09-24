"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { PasswordCriteria } from "@/components/auth/password-criteria";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TurnstileWidget } from "../security/turnstile-widget";
import { registerAction } from "@/actions/auth/register";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";
import { useTurnstile } from "@/hooks/use-turnstile";

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const turnstile = useTurnstile();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password1: "",
      password2: "",
    },
  });
  const password = watch("password1");
  const onSubmit = (values: RegisterFormValues) => {
      if (!turnstile.isVerified) {
    toast.error("يرجى إكمال التحقق الأمني.");
    return;
  }
    const formData = new FormData();

    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    formData.append("email", values.email);
    formData.append("password1", values.password1);
    formData.append("password2", values.password2);
    formData.append("turnstile_token", turnstile.token);

    startTransition(async () => {
      const result = await registerAction(formData);

      if (!result.success) {
        const fieldErrors = result.errors ?? {};

        for (const [field, messages] of Object.entries(fieldErrors)) {
          const message = messages[0];

          if (!message) continue;

          if (field === "non_field_errors") {
            toast.error(message);
            continue;
          }

          if (
            field === "first_name" ||
            field === "last_name" ||
            field === "email" ||
            field === "password1" ||
            field === "password2"
          ) {
            setError(field, {
              type: "server",
              message,
            });
          }
        }

        // لو الـAPI رجّع رسالة عامة بدون
        // non_field_errors
        if (!fieldErrors.non_field_errors?.[0] && result.message) {
          toast.error(result.message);
        }

        return;
      }

      toast.success(result.message ?? "تم إنشاء الحساب بنجاح.");
    });
  };

  return (
    <Card className="border-border/60 shadow-sm" dir="rtl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          إنشاء حساب
        </CardTitle>

        <CardDescription>أنشئ حسابك وابدأ رحلة التعلم.</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Name */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name">الاسم الأول</Label>

              <Input
                id="first_name"
                type="text"
                placeholder="الاسم الأول"
                autoComplete="given-name"
                disabled={isPending}
                aria-invalid={!!errors.first_name}
                {...register("first_name")}
              />

              {errors.first_name && (
                <p className="text-sm text-destructive">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="last_name">اسم العائلة</Label>

              <Input
                id="last_name"
                type="text"
                placeholder="اسم العائلة"
                autoComplete="family-name"
                disabled={isPending}
                aria-invalid={!!errors.last_name}
                {...register("last_name")}
              />

              {errors.last_name && (
                <p className="text-sm text-destructive">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>

            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              disabled={isPending}
              aria-invalid={!!errors.email}
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password1">كلمة المرور</Label>

            <div className="relative">
              <Input
                id="password1"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                autoComplete="new-password"
                disabled={isPending}
                aria-invalid={!!errors.password1}
                className="pl-11"
                {...register("password1")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                disabled={isPending}
                aria-label={
                  showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
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

            {errors.password1 && (
              <p className="text-sm text-destructive">
                {errors.password1.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="password2">تأكيد كلمة المرور</Label>

            <div className="relative">
              <Input
                id="password2"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="أعد إدخال كلمة المرور"
                autoComplete="new-password"
                disabled={isPending}
                aria-invalid={!!errors.password2}
                className="pl-11"
                {...register("password2")}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
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

            {errors.password2 && (
              <p className="text-sm text-destructive">
                {errors.password2.message}
              </p>
            )}
          </div>
          <div className="w-full flex justify-center">
            <TurnstileWidget
              onVerify={turnstile.setToken}
              onError={turnstile.reset}
              onExpire={turnstile.reset}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending || !turnstile.isVerified}>
            {isPending ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            تسجيل الدخول
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
