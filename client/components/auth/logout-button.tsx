"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const clearAuth = useAuthStore(
    (state) => state.clearAuth,
  );

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await logout();
    } catch {
      // logout المحلي سيحدث حتى لو فشل الطلب
    } finally {
      clearAuth();
      router.replace("/login");
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleLogout}
      disabled={isLoading}
      className="gap-2 text-muted-foreground hover:text-destructive "
    >

      <span>
        {isLoading
          ? "جاري تسجيل الخروج..."
          : "تسجيل الخروج"}
      </span>
    </Button>
  );
}