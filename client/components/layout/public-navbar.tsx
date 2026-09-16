import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  LockKeyhole,
  Menu,
  X,
  Home,
  GraduationCap,
  Info,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { getMeAction } from "@/actions/auth/me";
import { ModeToggle } from "./mode-toggle";

const navigation = [
  {
    label: "الرئيسية",
    href: "/",
    icon: Home,
  },
  {
    label: "الدورات التعليمية",
    href: "/courses",
    icon: GraduationCap,
  },
  {
    label: "عن المشروع",
    href: "/about",
    icon: Info,
  },
];

export async function PublicNavbar() {
  const { authenticated } = await getMeAction();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
        >
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/40 transition-all duration-200 group-hover:border-primary/30 group-hover:bg-primary/5">
            <LockKeyhole className="size-4 text-primary transition-transform duration-200 group-hover:scale-110" />
          </div>

          <div className="leading-none">
            <span className="block text-sm font-bold tracking-tight">
              DU Learn
            </span>

            <span className="mt-1 hidden text-[10px] text-muted-foreground sm:block">
              منصة التعلم الذكي
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />

          {!authenticated ? (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                })}
              >
                تسجيل الدخول
              </Link>

              <Link
                href="/register"
                className={buttonVariants({
                  variant: "secondary",
                  size: "lg",
                })}
              >
                إنشاء حساب
                <ArrowLeft className="mr-2 size-3.5" />
              </Link>
            </>
          ) : (
            <Link
              href="/learn"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
              })}
            >
              <BookOpen className="ml-2 size-3.5" />

              <span>لوحة التعلم</span>
            </Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 md:hidden">
          <ModeToggle />

          <MobileMenu authenticated={authenticated} />
        </div>
      </div>
    </header>
  );
}

function MobileMenu({
  authenticated,
}: {
  authenticated: boolean;
}) {
  return (
    <details className="group relative">
      <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden">
        <Menu className="size-4 transition-all duration-200 group-open:rotate-90 group-open:scale-0" />
        <X className="absolute size-4 scale-0 transition-all duration-200 group-open:scale-100" />
        <span className="sr-only">فتح القائمة</span>
      </summary>

      {/* Backdrop */}
      <div className="fixed inset-0 top-16 -z-10 bg-background/60 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-open:opacity-100" />

      {/* Menu */}
      <div
        dir="rtl"
        className="absolute left-0 top-12 w-[calc(100vw-2rem)] max-w-sm origin-top-left overflow-hidden rounded-2xl border border-border bg-background/95 p-2 shadow-xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
      >
        {/* Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted/70">
                  <Icon className="size-4" />
                </span>

                <span className="font-medium">{item.label}</span>

                <ArrowLeft className="mr-auto size-3.5 opacity-50" />
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-border/70" />

        {/* Account */}
        {!authenticated ? (
          <div className="grid grid-cols-2 gap-2 p-1">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
              })}
            >
              تسجيل الدخول
            </Link>

            <Link
              href="/register"
              className={buttonVariants({
                variant: "default",
                size: "sm",
              })}
            >
              إنشاء حساب
            </Link>
          </div>
        ) : (
          <div className="p-1">
            <Link
              href="/learn"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "w-full",
              })}
            >
              <BookOpen className="ml-2 size-4" />
              لوحة التعلم
              <ArrowLeft className="mr-auto size-3.5" />
            </Link>
          </div>
        )}
      </div>
    </details>
  );
}