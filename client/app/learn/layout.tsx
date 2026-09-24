"use client";

import Link from "next/link";
import {
  ArrowRight,
  Home,
} from "lucide-react";

import { LearnBreadcrumbs } from "@/components/learn/learn-breadcrumbs";
import { UserMenu } from "@/components/learn/user-menu";
import { Brand } from "@/components/layout/brand";
import PublicFooter from "@/components/layout/public-footer";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Separator } from "@/components/ui/separator";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      dir="rtl"
      className="min-h-svh bg-background"
    >
      {/* ================================================================ */}
      {/* Global Learning Header                                           */}
      {/* ================================================================ */}

      <header
        className="
          sticky top-0 z-40
          border-b border-border/60
          bg-background/95
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto flex h-16 w-full max-w-7xl
            items-center justify-between
            px-4 sm:px-6 lg:px-8
          "
        >
          {/* Brand */}
          <div className="flex min-w-0 items-center gap-3">
            <Brand isDashboard/>

            <div className="hidden h-5 w-px bg-border sm:block" />

            <span className="hidden text-sm text-muted-foreground sm:block">
              مساحة التعلم
            </span>
          </div>

          {/* Navigation + User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Main Website */}
            <Link
              href="/"
              className="
                inline-flex h-9 items-center gap-2
                rounded-lg border border-border
                bg-background px-3
                text-sm font-medium
                text-muted-foreground
                transition-colors
                hover:bg-muted
                hover:text-foreground
              "
            >
              <Home className="size-4" />

              <span className="hidden sm:inline">
                الصفحة الرئيسية
              </span>
            </Link>

            
            <ModeToggle/>
            <Separator orientation="vertical"/>
            <UserMenu />
            
          </div>
        </div>
      </header>

      <div className="w-full">
        <div
          className="
            mx-auto w-full max-w-7xl
            px-4 pt-4
            sm:px-6
            lg:px-8
          "
        >
          <LearnBreadcrumbs />
        </div>
      </div>

      {/* ================================================================ */}
      {/* Learning Content                                                 */}
      {/* ================================================================ */}

      <main className="w-full">
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
      <PublicFooter/>
    </div>
  );
}