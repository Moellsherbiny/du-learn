"use client";

import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "@/components/auth/logout-button";
import { useAuthStore } from "@/stores/auth-store";
import { getMediaUrl } from "@/lib/get-media-url";

type UserMenuProps = {
  variant?: "desktop" | "mobile" | "icon";
};

export function UserMenu({ variant = "desktop" }: UserMenuProps) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return variant === "mobile" ? (
      <div className="flex h-9 items-center gap-2">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="hidden h-4 w-20 sm:block" />
      </div>
    ) : (
      <Skeleton className="size-9 rounded-lg" />
    );
  }

  if (!user) return null;

  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || "المستخدم";

  const initials =
    [user.first_name, user.last_name]
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase() || "U";

  const imageUrl = getMediaUrl(user.image) || undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="فتح قائمة المستخدم"
            className="group flex items-center gap-2 rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        }
      >
        <Avatar className={variant === "mobile" ? "size-7" : "size-9 "}>
          <AvatarImage src={imageUrl} alt={fullName} />
          <AvatarFallback
            className={
              variant === "mobile"
                ? "bg-primary/10 text-xs font-semibold text-primary"
                : "rounded-lg bg-primary/10 text-sm font-semibold text-primary"
            }
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        {variant === "mobile" && (
          <span className="max-w-24 truncate text-sm font-medium">
            {fullName}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={8}
        className="w-64"
      >
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="size-10 border border-border">
            <AvatarImage src={imageUrl} alt={fullName} />
            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{fullName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={
            <Link
              href="/learn/profile"
              className="flex w-full items-center gap-2"
            />
          }
        >
          <User className="size-4" />
          <span>الملف الشخصي</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          render={
            <Link
              href="/learn/settings"
              className="flex w-full items-center gap-2"
            />
          }
        >
          <Settings className="size-4" />
          <span>الإعدادات</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="flex items-center gap-2"
          onSelect={(event) => event.preventDefault()}
        >
          <LogOut className="size-4" />
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
