"use server";

import { cookies } from "next/headers";

import { getMe } from "@/lib/api/auth";

export type AuthState = {
  authenticated: boolean;
  user: Awaited<
    ReturnType<typeof getMe>
  > | null;
};

export async function getMeAction(): Promise<AuthState> {
  try {
    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return {
        authenticated: false,
        user: null,
      };
    }

    const user = await getMe(
      `access_token=${accessToken}`,
    );

    return {
      authenticated: true,
      user,
    };
  } catch {
    return {
      authenticated: false,
      user: null,
    };
  }
}