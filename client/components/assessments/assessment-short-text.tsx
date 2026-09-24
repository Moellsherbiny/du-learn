"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function AssessmentShortText({
  value,
  onChange,
}: Props) {
  return (
    <textarea
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      placeholder="اكتب إجابتك هنا..."
      className="
        min-h-36 w-full resize-none
        rounded-xl border
        bg-background p-4
        text-sm outline-none
        transition-colors
        focus:border-primary
        focus:ring-2
        focus:ring-primary/20
      "
    />
  );
}