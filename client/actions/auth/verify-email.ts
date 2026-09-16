"use server";

import { verifyEmail } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export type VerifyEmailActionState = {
  success: boolean;
  message?: string;
};

export async function verifyEmailAction(
  key: string,
): Promise<VerifyEmailActionState> {
  const verificationKey = key.trim();

  if (!verificationKey) {
    return {
      success: false,
      message: "رابط تأكيد البريد الإلكتروني غير صالح.",
    };
  }

  try {
    const result = await verifyEmail(verificationKey);

    return {
      success: true,
      message:
        result.detail ??
        "تم تأكيد البريد الإلكتروني بنجاح.",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      const detail = error.data.detail;
      const nonFieldErrors =
        error.data.non_field_errors;

      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(nonFieldErrors)
            ? String(nonFieldErrors[0])
            : typeof nonFieldErrors === "string"
              ? nonFieldErrors
              : "تعذر تأكيد البريد الإلكتروني.";

      return {
        success: false,
        message,
      };
    }

    return {
      success: false,
      message:
        "حدث خطأ غير متوقع أثناء تأكيد البريد الإلكتروني. حاول مرة أخرى.",
    };
  }
}