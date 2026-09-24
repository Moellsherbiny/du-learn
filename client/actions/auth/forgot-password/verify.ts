"use server";

import { serverApiRequest } from "@/lib/api/server";

type VerifyPasswordResetOtpPayload = {
  email: string;
  otp: string;
};

type VerifyPasswordResetOtpResponse = {
  detail: string;
  reset_token: string;
};

type ActionResult =
  | {
      success: true;
      message: string;
      reset_token: string;
    }
  | {
      success: false;
      message: string;
      status?: number;
    };

export async function verifyPasswordResetOtpAction(
  payload: VerifyPasswordResetOtpPayload,
): Promise<ActionResult> {
  try {
    const email = payload.email.trim();
    const otp = payload.otp.trim();

    if (!email) {
      return {
        success: false,
        message: "البريد الإلكتروني مطلوب.",
      };
    }

    if (!/^\d{6}$/.test(otp)) {
      return {
        success: false,
        message: "رمز التحقق يجب أن يتكون من 6 أرقام.",
      };
    }

    const data =
      await serverApiRequest<VerifyPasswordResetOtpResponse>({
        path: "/api/auth/password-reset/verify/",
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
        }),
      });

    return {
      success: true,
      message: data.detail || "تم التحقق من الرمز بنجاح.",
      reset_token: data.reset_token,
    };
  } catch (error: unknown) {
    console.error(
      "verifyPasswordResetOtpAction:",
      error,
    );

    const apiError = error as {
      status?: number;
      message?: string;
    };

    return {
      success: false,
      status: apiError.status,
      message:
        apiError.message ??
        "رمز التحقق غير صحيح أو منتهي الصلاحية.",
    };
  }
}