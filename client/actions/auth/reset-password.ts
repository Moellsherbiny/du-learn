"use server";

import { confirmPasswordReset } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export type ResetPasswordActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function resetPasswordAction(
  uid: string,
  token: string,
  formData: FormData,
): Promise<ResetPasswordActionState> {
  const newPassword1 = String(formData.get("new_password1") ?? "");
  const newPassword2 = String(formData.get("new_password2") ?? "");

  try {
    await confirmPasswordReset({
      uid,
      token,
      new_password1: newPassword1,
      new_password2: newPassword2,
    });

    return {
      success: true,
      message: "تم تغيير كلمة المرور بنجاح.",
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