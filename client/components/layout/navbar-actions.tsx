import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./mode-toggle";
import { UserMenu } from "../learn/user-menu";

type Props = {
  authenticated: boolean;
};

export function NavbarActions({
  authenticated,
}: Props) {
  return (
    <div className="hidden items-center gap-2 md:flex h-5">
      <ModeToggle />

      <Separator
        orientation="vertical"
        
      />

      {!authenticated ? (
        <>
          <Link
            href="/login"
            className={buttonVariants({
              variant: "ghost",
              size: "lg",
            })}
          >
            تسجيل الدخول
          </Link>

          <Link
            href="/register"
            className={buttonVariants({
              variant: "default",
              size: "lg",
            })}
          >
            إنشاء حساب

            <ArrowLeft className="mr-2 size-3.5" />
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/learn"
            className={buttonVariants({
              variant: "default",
              size: "lg",
            })}
          >
            <BookOpen className="ml-2 size-3.5" />

            لوحة التعلم
          </Link>

          <Separator
            orientation="vertical"
            
          />

          <UserMenu variant="desktop" />
        </>
      )}
    </div>
  );
}