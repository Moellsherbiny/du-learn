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

  const turnstileToken = String(formData.get("turnstile_token")?? "")

  if (!turnstileToken){
     return {
      success: false,
      errors: {
        email: ["التحقق الأمني مطلوب"],
      },
    };
  }
  if (!email) {
    return {
      success: false,
      errors: {
        email: ["البريد الإلكتروني مطلوب"],
      },
    };
  }

  try {
    await requestPasswordReset(email,turnstileToken);

    
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