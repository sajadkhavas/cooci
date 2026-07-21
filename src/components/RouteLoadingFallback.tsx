export const RouteLoadingFallback = () => (
  <section
    className="section-padding"
    role="status"
    aria-busy="true"
    aria-live="polite"
    aria-atomic="true"
  >
    <span className="sr-only">در حال بارگذاری صفحه…</span>
    <div className="container-custom" aria-hidden="true">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-5 w-48 animate-pulse rounded-full bg-muted" />
        <div className="h-12 w-3/4 max-w-2xl animate-pulse rounded-2xl bg-muted" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div className="aspect-[4/3] animate-pulse bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
