"use client";

import { useEffect } from "react";

import { getMe } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    console.log("AUTH PROVIDER MOUNT");

    let cancelled = false;

    async function loadUser() {
      console.log("AUTH PROVIDER -> GET ME");

      try {
        const user = await getMe();

        console.log("AUTH PROVIDER <- GET ME", user);

        if (cancelled) {
          return;
        }

        useAuthStore.getState().setUser(user);
      } catch (error) {
        console.log("AUTH PROVIDER <- GET ME ERROR", error);

        if (cancelled) {
          return;
        }

        useAuthStore.getState().clearAuth();
      }
    }

    loadUser();

    return () => {
      console.log("AUTH PROVIDER UNMOUNT");
      cancelled = true;
    };
  }, []);

  return children;
}