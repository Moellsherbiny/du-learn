import type { LucideIcon } from "lucide-react";

type ProgressStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

export function ProgressStatCard({
  icon: Icon,
  label,
  value,
}: ProgressStatCardProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
}