"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import { toast } from "sonner";

import { resetPasswordAction } from "@/actions/auth/reset-password";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const resetPasswordSchema = z
  .object({
    new_password1: z
      .string()
      .min(8, "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل."),
    new_password2: z
      .string()
      .min(1, "تأكيد كلمة المرور مطلوب."),
  })
  .refine(
    (data) => data.new_password1 === data.new_password2,
    {
      message: "كلمتا المرور غير متطابقتين.",
      path: ["new_password2"],
    },
  );

type ResetPasswordValues = z.infer<
  typeof resetPasswordSchema
>;

type ResetPasswordFormProps = {
  uid: string;
  token: string;
};

export function ResetPasswordForm({
  uid,
  token,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password1: "",
      new_password2: "",
    },
  });

  function onSubmit(values: ResetPasswordValues) {
    startTransition(async () => {
      const formData = new FormData();

      formData.set(
        "new_password1",
        values.new_password1,
      );

      formData.set(
        "new_password2",
        values.new_password2,
      );

      const result = await resetPasswordAction(
        uid,
        token,
        formData,
      );

      if (result.success) {
        toast.success(
          result.message ??
            "تم تغيير كلمة المرور بنجاح.",
        );

        form.reset();

        router.push("/login?reset=success");

        return;
      }

      if (result.errors) {
        const errors = result.errors;

        const passwordError =
          errors.new_password1?.[0];

        const confirmPasswordError =
          errors.new_password2?.[0];

        if (passwordError) {
          form.setError("new_password1", {
            type: "server",
            message: translatePasswordError(passwordError),
          });
        }

        if (confirmPasswordError) {
          form.setError("new_password2", {
            type: "server",
            message: translatePasswordError(
              confirmPasswordError,
            ),
          });
        }

        const generalError =
          errors.non_field_errors?.[0] ??
          errors.detail?.[0];

        if (generalError) {
          form.setError("root", {
            type: "server",
            message: translateResetError(generalError),
          });
        }
      }

      toast.error(
        getResetErrorMessage(result.errors),
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
        name="new_password1"
        control={form.control}
        render={({ field, fieldState }) => (
          <PasswordField
            field={field}
            fieldState={fieldState}
            label="كلمة المرور الجديدة"
            description="استخدم كلمة مرور قوية تحتوي على 8 أحرف على الأقل."
            autoComplete="new-password"
            disabled={isPending}
          />
        )}
      />

      <Controller
        name="new_password2"
        control={form.control}
        render={({ field, fieldState }) => (
          <PasswordField
            field={field}
            fieldState={fieldState}
            label="تأكيد كلمة المرور"
            description="أعد إدخال كلمة المرور الجديدة للتأكيد."
            autoComplete="new-password"
            disabled={isPending}
          />
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
            جارٍ تغيير كلمة المرور...
          </>
        ) : (
          <>
            <KeyRound className="ml-2 size-4" />
            تغيير كلمة المرور
          </>
        )}
      </Button>
    </form>
  );
}

function PasswordField({
  field,
  fieldState,
  label,
  description,
  autoComplete,
  disabled,
}: {
  field: {
    name: string;
    value: string;
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    ref: (element: HTMLInputElement | null) => void;
  };
  fieldState: {
    invalid: boolean;
    error?: {
      message?: string;
    };
  };
  label: string;
  description: string;
  autoComplete: string;
  disabled: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>
        {label}
      </FieldLabel>

      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          {...field}
          id={field.name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={fieldState.invalid}
          disabled={disabled}
          className="px-10"
        />

        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          disabled={disabled}
          aria-label={
            visible
              ? "إخفاء كلمة المرور"
              : "إظهار كلمة المرور"
          }
          className="absolute left-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          {visible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      <FieldDescription>
        {description}
      </FieldDescription>

      {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
      )}
    </Field>
  );
}

function getResetErrorMessage(
  errors?: Record<string, string[]>,
) {
  if (!errors) {
    return "حدث خطأ أثناء تغيير كلمة المرور.";
  }

  return (
    errors.new_password1?.[0] ??
    errors.new_password2?.[0] ??
    errors.non_field_errors?.[0] ??
    errors.detail?.[0] ??
    "تعذر تغيير كلمة المرور."
  );
}

function translatePasswordError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("too short") ||
    normalized.includes("8")
  ) {
    return "كلمة المرور قصيرة جدًا. يجب أن تحتوي على 8 أحرف على الأقل.";
  }

  if (normalized.includes("too common")) {
    return "كلمة المرور شائعة جدًا. اختر كلمة مرور أكثر أمانًا.";
  }

  if (normalized.includes("entirely numeric")) {
    return "كلمة المرور لا يمكن أن تكون أرقامًا فقط.";
  }

  return message;
}

function translateResetError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid") ||
    normalized.includes("expired") ||
    normalized.includes("token")
  ) {
    return "رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية.";
  }

  return message;
}