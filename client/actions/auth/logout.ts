"use server";

import { logout } from "@/lib/api/auth";

export async function logoutAction() {
  try {
    await logout();

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      detail: "تعذر تسجيل الخروج. حاول مرة أخرى.",
    };
  }
}