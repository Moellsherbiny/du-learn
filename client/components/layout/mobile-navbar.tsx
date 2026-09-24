import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { navigation } from "./navbar-links";
import { UserMenu } from "../learn/user-menu";
import { Separator } from "../ui/separator";

type Props = {
  authenticated: boolean;
};

export function MobileNavbar({
  authenticated,
}: Props) {
  return (
    <div className="flex items-center gap-1.5 md:hidden">
      <ModeToggle />

      {authenticated && (
        <UserMenu variant="icon" />
      )}

      <details className="group relative">
        <summary
          className="
            flex size-9 cursor-pointer
            list-none items-center justify-center
            rounded-lg border border-border
            bg-background
            text-muted-foreground
            transition-colors
            hover:bg-muted
            hover:text-foreground
            [&::-webkit-details-marker]:hidden
          "
        >
          <Menu
            className="
              size-4
              transition-all duration-200
              group-open:rotate-90
              group-open:scale-0
            "
          />

          <X
            className="
              absolute size-4
              scale-0
              transition-all duration-200
              group-open:scale-100
            "
          />

          <span className="sr-only">
            فتح القائمة
          </span>
        </summary>

        {/* Backdrop */}
        <div
          className="
            fixed inset-0 top-16 -z-10
            bg-background/60
            opacity-0
            backdrop-blur-sm
            transition-opacity duration-200
            group-open:opacity-100
          "
        />

        {/* Menu */}
        <div
          dir="rtl"
          className="
            absolute left-0 top-12
            w-[calc(100vw-2rem)]
            max-w-sm
            origin-top-left
            overflow-hidden
            rounded-2xl
            border border-border
            bg-background/95
            p-2
            shadow-xl
            backdrop-blur-xl
            animate-in
            fade-in-0
            zoom-in-95
            slide-in-from-top-2
          "
        >
          {/* Navigation */}
          <nav
            aria-label="التنقل الرئيسي"
            className="space-y-1"
          >
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    group flex items-center gap-3
                    rounded-xl px-3 py-3
                    text-sm text-muted-foreground
                    transition-colors
                    hover:bg-muted
                    hover:text-foreground
                  "
                >
                  <span
                    className="
                      flex size-9 shrink-0
                      items-center justify-center
                      rounded-lg bg-muted/70
                      transition-colors
                      group-hover:bg-background
                    "
                  >
                    <Icon className="size-4" />
                  </span>

                  <span className="font-medium">
                    {item.label}
                  </span>

                  <ChevronLeft
                    className="
                      mr-auto size-4
                      text-muted-foreground/50
                      transition-transform
                      group-hover:-translate-x-0.5
                    "
                  />
                </Link>
              );
            })}
          </nav>

          <Separator orientation="vertical"/>

          {/* Account */}
          {!authenticated ? (
            <div className="grid grid-cols-2 gap-2 p-1">
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "h-9",
                })}
              >
                تسجيل الدخول
              </Link>

              <Link
                href="/register"
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className: "h-9",
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
                  variant: "default",
                  size: "sm",
                  className: "h-10 w-full",
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
    </div>
  );
}