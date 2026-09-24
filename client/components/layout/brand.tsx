import Link from "next/link";

export function Brand({ isDashboard }: { isDashboard?: boolean }) {
  return (
    <Link
      href={isDashboard ? "/learn" : "/"}
      aria-label="DU Learn"
      dir="ltr"
      className="group flex flex-col items-end leading-none"
    >
      <span className="relative inline-flex items-center">
        <span
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-e-0 top-1/2 z-0
            size-0 -translate-x-7 -translate-y-1/2
            border-y-[5px] border-y-transparent border-l-[7px] border-l-primary
            transition-transform duration-300 ease-out
            group-hover:-translate-x-6
          "
        />

        <span className="text-xl font-black transition-colors duration-300 sm:text-2xl">
          DU
        </span>
      </span>

      <span
        className="
          -mt-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground
          transition-colors duration-300
          group-hover:text-primary
          sm:-mt-2
        "
      >
        Learn
      </span>
    </Link>
  );
}