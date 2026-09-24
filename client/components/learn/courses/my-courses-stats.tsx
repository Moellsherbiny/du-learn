
import {
  BookOpen,
  CheckCircle2,
  Clock3,
} from "lucide-react";

type Props = {
  total: number;
  inProgress: number;
  completed: number;
};

export function MyCoursesStats({
  total,
  inProgress,
  completed,
}: Props) {
  const stats = [
    {
      label: "إجمالي الدورات",
      value: total,
      icon: BookOpen,
    },
    {
      label: "قيد التعلم",
      value: inProgress,
      icon: Clock3,
    },
    {
      label: "مكتملة",
      value: completed,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <Icon className="size-4 text-muted-foreground" />

              <span className="text-xl font-semibold">
                {stat.value}
              </span>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
