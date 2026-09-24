"use server";

import { register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export type RegisterActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function registerAction(
  formData: FormData,
): Promise<RegisterActionState> {
  const firstName = String(
    formData.get("first_name") ?? "",
  ).trim();

  const lastName = String(
    formData.get("last_name") ?? "",
  ).trim();

  const email = String(
    formData.get("email") ?? "",
  )
    .trim()
    .toLowerCase();

  const password1 = String(
    formData.get("password1") ?? "",
  );

  const password2 = String(
    formData.get("password2") ?? "",
  );

  const turnstileToken = String(formData.get("turnstile_token") ?? "")
  if (!firstName) {
    return {
      success: false,
      message: "الاسم الأول مطلوب.",
      errors: {
        first_name: ["الاسم الأول مطلوب."],
      },
    };
  }

  if (!lastName) {
    return {
      success: false,
      message: "اسم العائلة مطلوب.",
      errors: {
        last_name: ["اسم العائلة مطلوب."],
      },
    };
  }

  if (!turnstileToken)
    return {
    success:false,
    message:"التحقق الأمني مطلوب",
    errors:
    {
      turnstile_token:["التحقق الأمني مطلوب"]
    }
  }
  try {
    await register({
      first_name: firstName,
      last_name: lastName,
      email,
      password1,
      password2,
      turnstile_token: turnstileToken
    });

    return {
      success: true,
      message: "تم إنشاء الحساب بنجاح.",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      const errors = normalizeErrors(error.data);

      return {
        success: false,
        message:
          errors.non_field_errors?.[0] ??
          errors.email?.[0] ??
          errors.first_name?.[0] ??
          errors.last_name?.[0] ??
          errors.password1?.[0] ??
          "تعذر إنشاء الحساب. يرجى مراجعة البيانات.",
        errors,
      };
    }

    return {
      success: false,
      message:
        "حدث خطأ غير متوقع. حاول مرة أخرى.",
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
    Object.entries(data).map(
      ([field, value]) => [
        field,
        Array.isArray(value)
          ? value
          : [value],
      ],
    ),
  );
}