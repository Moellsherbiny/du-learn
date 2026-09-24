type ProgressOverviewProps = {
  title: string;
  percentage: number;
  completed: number;
  total: number;
};

export function ProgressOverview({
  title,
  percentage,
  completed,
  total,
}: ProgressOverviewProps) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            تقدم الكورس
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            {title}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            أكملت {completed} من {total} درس
          </p>
        </div>

        <div className="flex size-24 shrink-0 items-center justify-center rounded-full border-8 border-primary/10">
          <span className="text-xl font-bold text-primary">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{
            width: `${Math.min(Math.max(percentage, 0), 100)}%`,
          }}
        />
      </div>
    </section>
  );
}