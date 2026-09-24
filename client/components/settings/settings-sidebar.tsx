"use client";

import {
  KeyRound,
  LockKeyhole,
} from "lucide-react";

export function SettingsSidebar() {
  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit">
      <div className="rounded-2xl border bg-background p-2 shadow-sm">
        <div className="px-3 py-3">
          <p className="text-xs font-medium text-muted-foreground">
            الإعدادات
          </p>

          <p className="mt-1 text-sm font-semibold">
            إدارة الحساب
          </p>
        </div>

        <div className="rounded-xl bg-primary/10 px-3 py-3 text-primary">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <LockKeyhole className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold">
                الأمان
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                كلمة المرور والحماية
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}