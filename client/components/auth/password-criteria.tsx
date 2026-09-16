
"use client";

import {
  Check,
  Circle,
} from "lucide-react";

type PasswordCriteriaProps = {
  password: string;
};

export function PasswordCriteria({
  password,
}: PasswordCriteriaProps) {
  const criteria = [
    {
      label: "8 أحرف على الأقل",
      valid: password.length >= 8,
    },
    {
      label: "حرف كبير واحد على الأقل",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "حرف صغير واحد على الأقل",
      valid: /[a-z]/.test(password),
    },
    {
      label: "رقم واحد على الأقل",
      valid: /\d/.test(password),
    },
    {
      label: "رمز خاص واحد على الأقل",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div
      className="mt-3 space-y-2"
      dir="rtl"
    >
      <p className="text-xs font-medium text-muted-foreground">
        يجب أن تحتوي كلمة المرور على:
      </p>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {criteria.map((criterion) => (
          <div
            key={criterion.label}
            className={`flex items-center gap-2 text-xs transition-colors ${
              criterion.valid
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            }`}
          >
            {criterion.valid ? (
              <Check className="size-3.5 shrink-0" />
            ) : (
              <Circle className="size-3 shrink-0" />
            )}

            <span>{criterion.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
