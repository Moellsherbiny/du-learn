import { CheckCircle2, Circle } from "lucide-react";

type ModuleProgressItem = {
  id: number | string;
  title: string;
  completed_lessons: number;
  total_lessons: number;
  percentage: number;
};

type ModuleProgressProps = {
  modules?: ModuleProgressItem[];
};

export function ModuleProgress({
  modules = [],
}: ModuleProgressProps) {
  if (modules.length === 0) {
    return (
      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            تقدم الوحدات
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            لا توجد وحدات تعليمية متاحة حاليًا.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          تقدم الوحدات
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          مستوى تقدمك في كل وحدة تعليمية
        </p>
      </div>

      <div className="space-y-5">
        {modules.map((module) => {
          const completed = module.percentage === 100;

          return (
            <div key={module.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  {completed ? (
                    <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="size-5 shrink-0 text-muted-foreground" />
                  )}

                  <span className="truncate text-sm font-medium">
                    {module.title}
                  </span>
                </div>

                <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                  {module.percentage}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      Math.max(module.percentage, 0),
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {module.completed_lessons} من{" "}
                {module.total_lessons} درس
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}