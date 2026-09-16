"use server";

import { requestPasswordReset } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export type ForgotPasswordActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function forgotPasswordAction(
  formData: FormData,
): Promise<ForgotPasswordActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    return {
      success: false,
      errors: {
        email: ["البريد الإلكتروني مطلوب"],
      },
    };
  }

  try {
    await requestPasswordReset(email);

    // رسالة عامة حتى لا نكشف إذا كان البريد مسجلاً أم لا.
    return {
      success: true,
      message:
        "إذا كان البريد الإلكتروني مسجلًا في النظام، فستصلك رسالة لإعادة تعيين كلمة المرور.",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        errors: normalizeErrors(error.data),
      };
    }

    return {
      success: false,
      errors: {
        non_field_errors: ["حدث خطأ غير متوقع. حاول مرة أخرى."],
      },
    };
  }
}

function normalizeErrors(
  data: Record<string, string[] | string>,
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(data).map(([field, value]) => [
      field,
      Array.isArray(value) ? value : [value],
    ]),
  );
}