import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type QuickActionProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="
        group flex items-center gap-3
        rounded-xl border border-border/60
        bg-card p-3.5
        transition-colors hover:bg-muted/50
      "
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
    </Link>
  );
}