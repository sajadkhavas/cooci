import { useDeferredValue, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Snowflake,
  Truck,
  X,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { ProductGridSkeleton } from "@/components/catalog/ProductGridSkeleton";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import {
  useCatalogCategories,
  useCatalogProducts,
} from "@/hooks/useCatalog";
import type { CatalogQuery } from "@/lib/catalog-api";

const sortOptions: Array<{
  value: NonNullable<CatalogQuery["sort"]>;
  label: string;
}> = [
  { value: "featured", label: "پیشنهادی وینیمی" },
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "name", label: "نام محصول" },
];

const shippingOptions = [
  { value: "all", label: "همه ارسال‌ها" },
  { value: "nationwide", label: "بدون نیاز به سرمایش" },
  { value: "chilled", label: "نیازمند ارسال سرد" },
] as const;

const parsePositivePage = (value: string | null) => {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, isLoading: categoriesLoading } = useCatalogCategories();
  const categoryParam = searchParams.get("category") ?? "all";
  const sortParam = searchParams.get("sort") ?? "featured";
  const shippingParam = searchParams.get("shipping") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";
  const deferredSearch = useDeferredValue(searchQuery);
  const dietOnly = searchParams.get("diet") === "true";
  const inStockOnly = searchParams.get("stock") === "true";
  const requestedPage = parsePositivePage(searchParams.get("page"));
  const validSort = sortOptions.some((option) => option.value === sortParam)
    ? (sortParam as NonNullable<CatalogQuery["sort"]>)
    : "featured";
  const validShipping = shippingOptions.some(
    (option) => option.value === shippingParam,
  )
    ? (shippingParam as (typeof shippingOptions)[number]["value"])
    : "all";
  const dietCategory = categories.find(
    (category) =>
      category.slug === "diet" ||
      category.name.includes("رژیمی") ||
      category.name.includes("بدون قند"),
  );
  const effectiveCategory = dietOnly
    ? dietCategory?.slug || "diet"
    : categoryParam === "all"
      ? undefined
      : categoryParam;
  const {
    products,
    pagination,
    isLoading,
    isFetching,
    error,
    isBackendCatalogEnabled,
  } = useCatalogProducts({
    category: effectiveCategory,
    search: deferredSearch || undefined,
    requiresCooling:
      validShipping === "chilled"
        ? true
        : validShipping === "nationwide"
          ? false
          : undefined,
    inStock: inStockOnly || undefined,
    sort: validSort,
    page: requestedPage,
    perPage: 12,
  });

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all" || value === "featured") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (!pagination || requestedPage <= pagination.totalPages) return;
    const next = new URLSearchParams(searchParams);
    if (pagination.totalPages <= 1) next.delete("page");
    else next.set("page", String(pagination.totalPages));
    setSearchParams(next, { replace: true });
  }, [pagination, requestedPage, searchParams, setSearchParams]);

  const resetFilters = () => setSearchParams({}, { replace: true });
  const hasActiveFilters =
    categoryParam !== "all" ||
    Boolean(searchQuery) ||
    validShipping !== "all" ||
    dietOnly ||
    inStockOnly ||
    validSort !== "featured";
  const handlePageChange = (page: number) => {
    updateParam("page", page <= 1 ? null : String(page));
    window.requestAnimationFrame(() => {
      document.getElementById("catalog-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <>
      <SEO
        title="محصولات"
        description="مشاهده، جستجو، فیلتر و خرید آنلاین محصولات فعال وینیمی با قیمت و موجودی دریافت‌شده از سرور."
      />

      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <h1 className="heading-1 text-foreground">محصولات وینیمی</h1>
          <p className="body-large mx-auto mt-4 max-w-2xl text-muted-foreground">
            قیمت، موجودی، دسته‌بندی و وضعیت ارسال مستقیماً از کاتالوگ وینیمی دریافت می‌شود.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-10 space-y-5 rounded-3xl border border-border bg-card p-4 shadow-soft md:p-6">
            <div className="flex flex-wrap gap-2" aria-label="دسته‌بندی محصولات">
              <button
                type="button"
                onClick={() => updateParam("category", null)}
                aria-pressed={categoryParam === "all" && !dietOnly}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  categoryParam === "all" && !dietOnly
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                همه
              </button>
              {categories.map((category) => {
                const isActive = categoryParam === category.slug && !dietOnly;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      updateParam("category", category.slug);
                      if (dietOnly) updateParam("diet", null);
                    }}
                    aria-pressed={isActive}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
              {categoriesLoading && (
                <span className="rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
                  در حال دریافت دسته‌ها…
                </span>
              )}
            </div>

            <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="جستجوی نام، توضیح کوتاه یا کد محصول…"
                  value={searchQuery}
                  onChange={(event) => updateParam("q", event.target.value)}
                  className="input-field w-full px-10"
                  aria-label="جستجو در محصولات"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => updateParam("q", null)}
                    className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="پاک کردن جستجو"
                  >
                    <X size={17} aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="relative">
                <SlidersHorizontal
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <select
                  value={validSort}
                  onChange={(event) => updateParam("sort", event.target.value)}
                  className="input-field min-w-44 cursor-pointer appearance-none pr-10"
                  aria-label="مرتب‌سازی محصولات"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => updateParam("diet", dietOnly ? null : "true")}
                aria-pressed={dietOnly}
                className={`rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${
                  dietOnly
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/50"
                }`}
              >
                فقط رژیمی / بدون قند افزوده
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {shippingOptions.map((option) => {
                const Icon = option.value === "chilled" ? Snowflake : Truck;
                const isActive = validShipping === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateParam("shipping", option.value)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {option.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => updateParam("stock", inStockOnly ? null : "true")}
                aria-pressed={inStockOnly}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-colors ${
                  inStockOnly
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-border bg-background text-muted-foreground hover:border-emerald-600/60"
                }`}
              >
                <CheckCircle2 size={15} aria-hidden="true" />
                فقط محصولات موجود
              </button>
            </div>
          </div>

          {isBackendCatalogEnabled && isFetching && !isLoading && (
            <div
              className="mb-6 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary"
              role="status"
            >
              در حال به‌روزرسانی کاتالوگ از سرور…
            </div>
          )}

          <div id="catalog-results" className="scroll-mt-28">
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : error ? (
              <div
                className="rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center"
                role="alert"
              >
                <AlertCircle
                  className="mx-auto mb-4 text-destructive"
                  size={52}
                  aria-hidden="true"
                />
                <h2 className="heading-3 mb-3 text-foreground">
                  دریافت محصولات با مشکل روبه‌رو شد
                </h2>
                <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
                  {error.message}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="btn-primary rounded-xl px-7 py-3"
                >
                  تلاش دوباره
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-muted-foreground" aria-live="polite">
                    {pagination && pagination.total > 0
                      ? `نمایش ${(pagination.from || 0).toLocaleString("fa-IR")} تا ${(pagination.to || 0).toLocaleString("fa-IR")} از ${pagination.total.toLocaleString("fa-IR")} محصول`
                      : "محصولی یافت نشد"}
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-sm font-bold text-primary hover:underline"
                    >
                      حذف همه فیلترها
                    </button>
                  )}
                </div>

                {products.length > 0 ? (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {products.map((product, index) => (
                        <div
                          key={product.id}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 45}ms` }}
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                    <CatalogPagination
                      page={pagination?.page || 1}
                      totalPages={pagination?.totalPages || 1}
                      onPageChange={handlePageChange}
                    />
                  </>
                ) : (
                  <div className="rounded-3xl border border-border bg-card py-16 text-center shadow-soft">
                    <span className="mb-4 block text-6xl" aria-hidden="true">
                      🔍
                    </span>
                    <h2 className="heading-3 mb-3 text-foreground">
                      نتیجه‌ای پیدا نشد
                    </h2>
                    <p className="body-large mx-auto mb-6 max-w-xl text-muted-foreground">
                      دسته‌بندی، عبارت جستجو یا فیلترهای ارسال و موجودی را تغییر دهید.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="btn-primary rounded-xl px-8 py-3"
                    >
                      نمایش همه محصولات
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
