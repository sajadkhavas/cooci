interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGridSkeleton = ({ count = 8 }: ProductGridSkeletonProps) => (
  <div
    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    aria-label="در حال بارگذاری محصولات"
    aria-busy="true"
  >
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card"
      >
        <div className="aspect-[4/3] animate-pulse bg-muted" />
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-6 w-4/5 animate-pulse rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
          <div className="flex items-end justify-between gap-4 pt-3">
            <div className="h-10 w-28 animate-pulse rounded bg-muted" />
            <div className="h-11 w-24 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
