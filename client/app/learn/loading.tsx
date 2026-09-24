
import { Skeleton } from "@/components/ui/skeleton";

export default function LearnLoading() {
  return (
    <main
      dir="rtl"
      className="min-h-[calc(100svh-4rem)] bg-background"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="border-b border-border/60 pb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-9 w-32 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-card px-4 py-5"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="size-9 rounded-lg" />
                <Skeleton className="h-6 w-10" />
              </div>

              <Skeleton className="mt-3 h-3 w-24" />
            </div>
          ))}
        </section>

        {/* Main */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Continue */}
          <div>
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-52" />
              </div>

              <Skeleton className="h-4 w-14" />
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-card">
              <div className="flex flex-col sm:flex-row">
                <Skeleton className="aspect-video w-full rounded-none sm:h-48 sm:w-56" />

                <div className="flex-1 space-y-3 p-5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />

                  <div className="pt-3">
                    <Skeleton className="h-1.5 w-full rounded-full" />
                    <div className="mt-2 flex justify-between">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <aside>
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="mt-4 space-y-2">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5"
                  >
                    <Skeleton className="size-9 rounded-lg" />

                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-32" />
                    </div>

                    <Skeleton className="size-4" />
                  </div>
                )
              )}
            </div>
          </aside>
        </section>

        {/* Courses */}
        <section className="mt-10 border-t border-border/60 pt-8">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-52" />
            </div>

            <Skeleton className="h-4 w-24" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-border/60 bg-card"
                >
                  <Skeleton className="aspect-video rounded-none" />

                  <div className="space-y-3 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-1.5 w-full rounded-full" />
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

