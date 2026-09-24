"use server";

import { cookies } from "next/headers";

import { apiRequest, ApiError } from "@/lib/api/client";

type ChangePasswordResult = {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
};

async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get("access_token")?.value;
}

export async function changePassword(
  data: FormData,
): Promise<ChangePasswordResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: "يرجى تسجيل الدخول أولًا.",
      };
    }

    const response = await apiRequest<{ detail: string }>({
      path: "/api/auth/settings/password/",
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    });

    return {
      success: true,
      message: response.detail || "تم تغيير كلمة المرور بنجاح.",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        errors: error.data,
      };
    }

    return {
      success: false,
      error: "حدث خطأ غير متوقع أثناء تغيير كلمة المرور.",
    };
  }
}