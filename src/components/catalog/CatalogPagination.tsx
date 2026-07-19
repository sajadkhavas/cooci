import { ChevronLeft, ChevronRight } from "lucide-react";

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getVisiblePages = (page: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  return [...pages].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);
};

export const CatalogPagination = ({
  page,
  totalPages,
  onPageChange,
}: CatalogPaginationProps) => {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="صفحه‌بندی محصولات">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex h-11 items-center gap-1 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="صفحه قبلی"
      >
        <ChevronRight size={18} aria-hidden="true" />
        قبلی
      </button>

      {visiblePages.map((pageNumber, index) => {
        const previousPage = visiblePages[index - 1];
        const showGap = previousPage && pageNumber - previousPage > 1;
        const isActive = pageNumber === page;

        return (
          <span key={pageNumber} className="contents">
            {showGap && <span className="px-1 text-muted-foreground">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isActive ? "page" : undefined}
              className={`h-11 min-w-11 rounded-xl border px-3 text-sm font-black transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {pageNumber.toLocaleString("fa-IR")}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="inline-flex h-11 items-center gap-1 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="صفحه بعدی"
      >
        بعدی
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
    </nav>
  );
};
