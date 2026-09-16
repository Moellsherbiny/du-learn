"use server";

import { cookies } from "next/headers";

import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export type LoginActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function loginAction(
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(
    formData.get("email") ?? "",
  )
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") ?? "",
  );

  if (!email) {
    return {
      success: false,
      errors: {
        email: ["البريد الإلكتروني مطلوب"],
      },
    };
  }

  if (!password) {
    return {
      success: false,
      errors: {
        password: ["كلمة المرور مطلوبة"],
      },
    };
  }

  try {
    const result = await login({
      email,
      password,
    });

    if (!result.access) {
      return {
        success: false,
        errors: {
          non_field_errors: [
            "تعذر إنشاء جلسة تسجيل الدخول.",
          ],
        },
      };
    }

    const cookieStore = await cookies();

    cookieStore.set(
      "access_token",
      result.access,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
      },
    );

    if (result.refresh) {
      cookieStore.set(
        "refresh_token",
        result.refresh,
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        },
      );
    }

    return {
      success: true,
      message: "تم تسجيل الدخول بنجاح.",
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
        non_field_errors: [
          "حدث خطأ غير متوقع. حاول مرة أخرى.",
        ],
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
      Array.isArray(value)
        ? value
        : [value],
    ]),
  );
}