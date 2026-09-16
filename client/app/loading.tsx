import { LockKeyhole } from "lucide-react";

export default function Loading() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background"
    >
      {/* Dotted background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 18%, transparent) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo mark */}
        <div className="relative flex size-20 items-center justify-center">
          {/* Rotating ring */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[1.35rem] border border-dashed border-primary/20 animate-[spin_8s_linear_infinite]"
          />

          {/* Inner ring */}
          <div
            aria-hidden="true"
            className="absolute inset-2 rounded-xl border border-primary/10"
          />

          {/* Icon */}
          <div className="relative flex size-14 items-center justify-center rounded-xl border border-primary/20 bg-card shadow-sm">
            <LockKeyhole className="size-6 text-primary" />
          </div>
        </div>

        {/* Brand */}
        <div className="mt-6 text-center">
          <h1 className="text-sm font-bold tracking-tight">
            DU Learn
          </h1>

          <p className="mt-1.5 text-xs text-muted-foreground">
            بيئة التعلم الآمن
          </p>
        </div>

        {/* Loading indicator */}
        <div
          className="mt-8 flex items-center gap-1.5"
          aria-label="جارٍ التحميل"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />

          <span
            className="size-1.5 animate-pulse rounded-full bg-primary"
            style={{ animationDelay: "150ms" }}
          />

          <span
            className="size-1.5 animate-pulse rounded-full bg-primary"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* Loading text */}
        <p className="mt-3 text-[11px] text-muted-foreground">
          جارٍ تجهيز بيئة التعلم...
        </p>
      </div>
    </main>
  );
}