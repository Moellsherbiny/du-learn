"use client";

import {
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import { SettingsSidebar } from "./settings-sidebar";
import { PasswordSettings } from "./password-settings";

export function SettingsClient() {
  return (
    <div
      dir="rtl"
      className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <KeyRound className="size-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                الإعدادات
              </h1>

              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                الحساب
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              إدارة إعدادات حسابك وبيانات الأمان
              الخاصة بك من مكان واحد.
            </p>
          </div>
        </div>
      </div>

      {/* Security Summary */}
      <div className="mb-6 rounded-2xl border bg-background p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="size-4" />
          </div>

          <div>
            <p className="text-sm font-semibold">
              أمان الحساب
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              حافظ على كلمة مرور قوية لحماية
              حسابك.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <SettingsSidebar />

        <PasswordSettings />
      </div>
    </div>
  );
}