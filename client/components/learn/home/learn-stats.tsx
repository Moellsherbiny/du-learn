import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Trophy,
} from "lucide-react";

type StatsData = {
  completed_lessons: number;
  active_courses: number;
  completed_courses: number;
  progress_percentage: number;
};

type Props = {
  stats: StatsData;
};

const statItems = [
  {
    key: "completed_lessons",
    label: "الدروس المكتملة",
    icon: CheckCircle2,
  },
  {
    key: "active_courses",
    label: "قيد التعلم",
    icon: PlayCircle,
  },
  {
    key: "completed_courses",
    label: "الدورات المكتملة",
    icon: Trophy,
  },
  {
    key: "progress_percentage",
    label: "نسبة الإنجاز",
    icon: BookOpen,
    suffix: "%",
  },
] as const;

export function LearnStats({ stats }: Props) {
  return (
    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 sm:grid-cols-4">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        const value = stats[stat.key];

        return (
          <div
            key={stat.key}
            className="bg-card px-4 py-5 transition-colors hover:bg-muted/20"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </div>

              <span className="text-xl font-semibold tracking-tight tabular-nums">
                {value}
                {"suffix" in stat && stat.suffix}
              </span>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {stat.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}