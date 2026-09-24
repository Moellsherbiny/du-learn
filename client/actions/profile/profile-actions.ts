
"use server";

import { cookies } from "next/headers";

import {
  apiRequest,
  ApiError,
} from "@/lib/api/client";

export type StudentProfile = {
  bio: string;
  phone: string;
  date_of_birth: string | null;
  school: string;
  grade_level: string;
  city: string;
  country: string;
  created_at: string;
  updated_at: string;
};

export type TeacherProfile = {
  bio: string;
  phone: string;
  specialization: string;
  qualification: string;
  years_of_experience: number;
  city: string;
  country: string;
  created_at: string;
  updated_at: string;
};

export type ProfileData = {
  id: number | string;
  email: string;
  first_name: string;
  last_name: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  email_verified: boolean;
  image: string | null;
  profile: StudentProfile | TeacherProfile | null;
};

type ProfileResult = {
  success: boolean;
  data?: ProfileData;
  error?: string;
  errors?: Record<string, string[] | string>;
};

async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get("access_token")?.value;
}

export async function getProfile(): Promise<ProfileResult> {
  try {
    const accessToken =
      await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: "يرجى تسجيل الدخول أولًا.",
      };
    }

    const data =
      await apiRequest<ProfileData>({
        path: "/api/auth/profile/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

    return {
      success: true,
      data,
    };
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : null;

    return {
      success: false,
      error:
        apiError?.message ??
        "تعذر تحميل الملف الشخصي.",
      errors: apiError?.data,
    };
  }
}

export async function updateProfile(
  formData: FormData,
): Promise<ProfileResult> {
  try {
    const accessToken =
      await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        error: "يرجى تسجيل الدخول أولًا.",
      };
    }

    const data =
      await apiRequest<ProfileData>({
        path: "/api/auth/profile/",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

    return {
      success: true,
      data,
    };
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : null;

    return {
      success: false,
      error:
        apiError?.message ??
        "تعذر تحديث الملف الشخصي.",
      errors: apiError?.data,
    };
  }
}

