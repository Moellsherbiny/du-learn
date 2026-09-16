"use client";

import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LearnBreadcrumbs } from "@/components/learn/learn-breadcrumbs";
import { LogoutButton } from "@/components/auth/logout-button";
import { useAuthStore } from "@/stores/auth-store";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    "المستخدم";

  const initials =
    [user?.first_name, user?.last_name]
      .filter(Boolean)
      .map((name) => name?.charAt(0))
      .join("")
      .toUpperCase() || "U";

  return (
    <div dir="rtl" className="min-h-svh bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="shrink-0">
              <Link
                href="/learn"
                className="text-base font-bold tracking-tight transition-opacity hover:opacity-80"
              >
                DU Learn
              </Link>
            </div>

            <div className="hidden h-5 w-px bg-border sm:block" />

            <span className="hidden text-sm text-muted-foreground sm:block">
              مساحة التعلم
            </span>
          </div>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="فتح قائمة المستخدم"
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Avatar className="size-9 border border-border">
                <AvatarImage
                  src={user?.image || undefined}
                  alt={fullName}
                />

                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="w-60"
            >
              {/* User info */}
              <div className="flex items-center gap-3 px-2 py-2.5">
                <Avatar className="size-10 shrink-0">
                  <AvatarImage
                    src={user?.image || undefined}
                    alt={fullName}
                  />

                  <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {fullName}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem >
                  <Link href="/learn/profile">
                    <User className="size-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem >
                  <Link href="/learn/settings">
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onSelect={(event) => {
                  event.preventDefault();
                }}
              >
                <LogOut className="size-4" />

                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <LearnBreadcrumbs />
      </div>

      <main>{children}</main>
    </div>
  );
}