
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import type { CourseFilter } from "./my-courses-client";

type Props = {
  search: string;
  filter: CourseFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: CourseFilter) => void;
};

const filters: {
  label: string;
  value: CourseFilter;
}[] = [
  { label: "الكل", value: "ALL" },
  { label: "قيد التعلم", value: "ACTIVE" },
  { label: "مكتملة", value: "COMPLETED" },
  { label: "لم تبدأ", value: "SUSPENDED" },
];

export function MyCoursesFilters({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="ابحث في دوراتك..."
          className="pr-9"
        />
      </div>

      <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() =>
              onFilterChange(item.value)
            }
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              filter === item.value
                ? "bg-background font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
