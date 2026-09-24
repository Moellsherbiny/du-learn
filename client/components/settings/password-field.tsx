"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  registration: {
    name: string;
    onBlur: React.FocusEventHandler<HTMLInputElement>;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    ref: React.Ref<HTMLInputElement>;
  };
};

export function PasswordField({
  id,
  label,
  placeholder,
  error,
  disabled = false,
  autoComplete,
  registration,
}: PasswordFieldProps) {
  const [visible, setVisible] =
    useState(false);

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium"
      >
        {label}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          
          disabled={disabled}
          autoComplete={autoComplete}
          dir="rtl"
          {...registration}
          className={`h-11 pe-11 ${
            error
              ? "border-destructive focus-visible:ring-destructive/20"
              : ""
          }`}
        />

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() =>
            setVisible((value) => !value)
          }
          className="absolute inset-y-0 inset-e-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          aria-label={
            visible
              ? "إخفاء كلمة المرور"
              : "إظهار كلمة المرور"
          }
        >
          {visible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}