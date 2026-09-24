
import type { Metadata } from "next";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { Brand } from "@/components/layout/brand";

export const metadata: Metadata = {
  title: {
    default: "تسجيل الدخول",
    template: "%s | DU Learn",
  },
  description:
    "منصة DU Learn التعليمية — تعلّم، طوّر مهاراتك، وحقق أهدافك.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <main
      dir="rtl"
      className="relative min-h-svh overflow-hidden bg-background"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 size-112 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_75%)]" />
      </div>

      <div className="relative flex min-h-svh flex-col">
        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
            <Brand/>

            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              العودة للرئيسية
            </Link>
          </div>
        </header>

        {/* Main */}
        <div className="flex min-h-svh flex-1 items-center justify-center px-5 py-28 sm:px-6">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 px-6 pb-6">
          <div className="mx-auto w-full max-w-md">
            <Separator className="mb-4" />

            <div className="flex flex-col items-center justify-center gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:gap-3">
              <span>
                © {new Date().getFullYear()} DU Learn
              </span>

              <span className="hidden sm:inline">
                •
              </span>

              <Link
                href="/terms"
                className="transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
              >
                الشروط والأحكام
              </Link>

              <span className="hidden sm:inline">
                •
              </span>

              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
              >
                سياسة الخصوصية
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
