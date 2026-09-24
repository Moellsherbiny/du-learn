"use server";

import { serverApiRequest } from "@/lib/api/server";

type ResetPasswordPayload = {
  reset_token: string;
  new_password: string;
  confirm_password: string;
};

type ResetPasswordResponse = {
  detail: string;
};

type ActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      status?: number;
    };

export async function resetPasswordAction(
  payload: ResetPasswordPayload,
): Promise<ActionResult> {
  try {
    const resetToken = payload.reset_token.trim();
    const newPassword = payload.new_password;
    const confirmPassword = payload.confirm_password;

    if (!resetToken) {
      return {
        success: false,
        message:
          "جلسة إعادة تعيين كلمة المرور غير صالحة. يرجى بدء العملية من جديد.",
      };
    }

    if (!newPassword) {
      return {
        success: false,
        message: "كلمة المرور الجديدة مطلوبة.",
      };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        message:
          "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل.",
      };
    }

    if (!confirmPassword) {
      return {
        success: false,
        message: "تأكيد كلمة المرور مطلوب.",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: "كلمتا المرور غير متطابقتين.",
      };
    }

    const data =
      await serverApiRequest<ResetPasswordResponse>({
        path: "/api/auth/password-reset/confirm/",
        method: "POST",
        body: JSON.stringify({
          reset_token: resetToken,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

    return {
      success: true,
      message:
        data.detail ?? "تم تغيير كلمة المرور بنجاح.",
    };
  } catch (error: unknown) {
    console.error("resetPasswordAction:", error);

    const apiError = error as {
      status?: number;
      message?: string;
    };

    return {
      success: false,
      status: apiError.status,
      message:
        apiError.message ??
        "تعذر تغيير كلمة المرور. يرجى المحاولة مرة أخرى.",
    };
  }
}