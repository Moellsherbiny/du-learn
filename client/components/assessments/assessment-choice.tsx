"use client";

import { Check } from "lucide-react";

import type {
  AssessmentChoice as AssessmentChoiceType,
} from "@/types/assessment";

type Props = {
  choice: AssessmentChoiceType;
  selected: boolean;
  multiple: boolean;
  onClick: () => void;
};

export function AssessmentChoice({
  choice,
  selected,
  multiple,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex w-full items-center gap-3
        rounded-xl border p-4
        text-right transition-colors
        ${
          selected
            ? "border-primary bg-primary/5"
            : "hover:bg-muted/50"
        }
      `}
    >
      <span
        className={`
          flex size-5 shrink-0 items-center
          justify-center border
          ${
            multiple
              ? "rounded-md"
              : "rounded-full"
          }
          ${
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40"
          }
        `}
      >
        {selected && (
          <Check className="size-3" />
        )}
      </span>

      <span className="text-sm leading-6">
        {choice.text}
      </span>
    </button>
  );
}