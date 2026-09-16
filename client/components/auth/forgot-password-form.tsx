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

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("أدخل بريدًا إلكترونيًا صحيحًا"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgotPasswordValues) {
    startTransition(async () => {
      const formData = new FormData();

      formData.set("email", values.email);

      const result = await forgotPasswordAction(formData);

      if (result.success) {
        toast.success(
          result.message ??
            "إذا كان البريد الإلكتروني مسجلًا، فستصلك رسالة إعادة التعيين.",
        );

        form.reset();
        return;
      }

      if (result.errors) {
        for (const [field, messages] of Object.entries(result.errors)) {
          if (field === "email" || field === "non_field_errors") {
            form.setError(
              field === "email" ? "email" : "root",
              {
                type: "server",
                message: messages[0],
              },
            );
          }
        }
      }

      toast.error(
        result.errors?.non_field_errors?.[0] ??
          result.errors?.email?.[0] ??
          "حدث خطأ أثناء تنفيذ الطلب.",
      );
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
        <FieldError
          errors={[form.formState.errors.root]}
        />
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="ml-2 size-4 animate-spin" />
            جارٍ الإرسال...
          </>
        ) : (
          "إرسال تعليمات إعادة التعيين"
        )}
      </Button>
    </form>
  );
}