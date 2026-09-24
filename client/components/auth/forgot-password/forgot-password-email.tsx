"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { forgotPasswordAction } from "@/actions/auth/forgot-password";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TurnstileWidget } from "@/components/security/turnstile-widget";
import { useTurnstile } from "@/hooks/use-turnstile";

const forgotPasswordSchema = z.object({
  email: z.email("أدخل بريدًا إلكترونيًا صحيحًا"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

type ForgotPasswordEmailProps = {
  onSuccess: (email: string) => void;
};

export function ForgotPasswordEmail({
  onSuccess,
}: ForgotPasswordEmailProps) {
  const [isPending, startTransition] = useTransition();
  const turnstile = useTurnstile();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgotPasswordValues) {
    if (!turnstile.isVerified) {
      toast.error("يرجى إكمال التحقق الأمني.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();

      formData.set("email", values.email.trim());
      formData.set("turnstile_token", turnstile.token);

      const result = await forgotPasswordAction(formData);

      if (!result.success) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(
            result.errors,
          )) {
            const message = messages[0];

            if (!message) continue;

            if (field === "email") {
              form.setError("email", {
                type: "server",
                message,
              });
            }

            if (field === "non_field_errors") {
              form.setError("root", {
                type: "server",
                message,
              });
            }
          }
        }

        toast.error(
          result.errors?.non_field_errors?.[0] ??
            result.errors?.email?.[0] ??
            result.message ??
            "حدث خطأ أثناء تنفيذ الطلب.",
        );

        return;
      }

      toast.success(
        result.message ??
          "تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
      );

      turnstile.reset();

      onSuccess(values.email.trim());
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              البريد الإلكتروني
            </FieldLabel>

            <div className="relative">
              <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                {...field}
                id={field.name}
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
                className="pr-9"
              />
            </div>

            <FieldDescription>
              أدخل البريد الإلكتروني المرتبط بحسابك.
            </FieldDescription>

            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      {form.formState.errors.root?.message && (
        <FieldError errors={[form.formState.errors.root]} />
      )}

      <div className="flex justify-center">
        <TurnstileWidget
          onVerify={turnstile.setToken}
          onError={turnstile.reset}
          onExpire={turnstile.reset}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full disabled:cursor-not-allowed"
        disabled={isPending || !turnstile.isVerified}
      >
        {isPending ? (
          <>
            <Loader2 className="ml-2 size-4 animate-spin" />
            جارٍ الإرسال...
          </>
        ) : (
          "إرسال رمز التحقق"
        )}
      </Button>
    </form>
  );
}