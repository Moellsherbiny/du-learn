
"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";

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

import { loginAction } from "@/actions/auth/login";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()
  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    const formData = new FormData();

    formData.append("email", values.email);
    formData.append("password", values.password);

    startTransition(async () => {
      const result = await loginAction(formData);

      if (!result.success) {
        const fieldErrors = result.errors ?? {};

        let hasFieldError = false;

        for (const [field, messages] of Object.entries(
          fieldErrors,
        )) {
          const message = messages[0];

          if (!message) continue;

          if (field === "non_field_errors") {
            toast.error(message);
            continue;
          }

          if (
            field === "email" ||
            field === "password"
          ) {
            hasFieldError = true;

            setError(field, {
              type: "server",
              message,
            });
          }
        }

        // لو مفيش خطأ مرتبط بحقل معين،
        // نعرض الرسالة العامة في Toast.
        if (
          !hasFieldError &&
          result.message
        ) {
          toast.error(result.message);
        }

        return;
      }

      toast.success(
        result.message ??
          "تم تسجيل الدخول بنجاح.",
      );

      router.replace("/")
      // من cookie flow.
    });
  };

  return (
    <Card
      className="border-border/60 shadow-sm"
      dir="rtl"
    >
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          مرحبًا بعودتك
        </CardTitle>

        <CardDescription className="leading-6">
          سجّل دخولك للمتابعة في رحلة التعلم
          الخاصة بك.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              البريد الإلكتروني
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              disabled={isPending}
              aria-invalid={!!errors.email}
              className="transition-colors"
              {...register("email")}
            />

            {errors.email && (
              <p
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                كلمة المرور
              </Label>

              <Link
                href="/forgot-password"
                tabIndex={isPending ? -1 : 0}
                className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <div className="relative">
              <Input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="أدخل كلمة المرور"
                autoComplete="current-password"
                disabled={isPending}
                aria-invalid={!!errors.password}
                className="pl-11 transition-colors"
                {...register("password")}
              />

              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                aria-label={
                  showPassword
                    ? "إخفاء كلمة المرور"
                    : "إظهار كلمة المرور"
                }
                aria-pressed={showPassword}
                className="absolute left-0 top-0 flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          ليس لديك حساب؟{" "}

          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            إنشاء حساب جديد
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
