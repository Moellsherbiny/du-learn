
export default function Loading() {
  return (
    <main dir="rtl" className="min-h-screen bg-background">
      <div className="border-b">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center px-4 lg:px-6">
          <div className="h-5 w-56 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-l p-4">
          <div className="h-16 animate-pulse rounded-xl bg-muted" />

          <div className="mt-4 space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </aside>

        <section className="p-6 lg:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-5 h-10 w-2/3 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-5 w-full animate-pulse rounded bg-muted" />
            <div className="mt-8 h-96 animate-pulse rounded-2xl bg-muted" />
          </div>
        </section>
      </div>
    </main>
  );
}
