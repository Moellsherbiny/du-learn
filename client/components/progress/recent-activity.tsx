import { Clock3 } from "lucide-react";

export function RecentActivity() {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Clock3 className="size-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            النشاط الأخير
          </h2>

          <p className="text-sm text-muted-foreground">
            آخر ما أنجزته في رحلتك التعليمية
          </p>
        </div>
      </div>

      <div className="mt-8 flex min-h-32 items-center justify-center text-center">
        <p className="max-w-xs text-sm leading-6 text-muted-foreground">
          سيتم عرض آخر الدروس والاختبارات التي أكملتها هنا.
        </p>
      </div>
    </section>
  );
}