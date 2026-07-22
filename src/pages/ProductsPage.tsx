import { useDeferredValue, useEffect } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Snowflake,
  Truck,
  X,
} from "lucide-react";
import {
  Link,
  redirect,
  useParams,
  useSearchParams,
  type LoaderFunctionArgs,
} from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { CategoryShowcase } from "@/components/catalog/CategoryShowcase";
import { ProductGridSkeleton } from "@/components/catalog/ProductGridSkeleton";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import {
  brandConfig,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import {
  categoryContents,
  getCategoryContent,
} from "@/data/categoriesContent";
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
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(10_000, parsed) : 1;
};

const resolveEditorialSlug = (catalogSlug: string) =>
  categoryContents.find(
    (category) =>
      category.slug === catalogSlug || category.productCategorySlug === catalogSlug,
  )?.slug || catalogSlug;

export const loader = ({ request, params }: LoaderFunctionArgs) => {
  if (params.slug) return null;

  const url = new URL(request.url);
  const legacyCategory = url.searchParams.get("category");
  const legacyDiet = url.searchParams.get("diet") === "true";
  if (!legacyCategory && !legacyDiet) return null;

  url.searchParams.delete("category");
  url.searchParams.delete("diet");
  const query = url.searchParams.toString();
  if (legacyCategory === "all" && !legacyDiet) {
    return redirect(`/products${query ? `?${query}` : ""}`, 301);
  }

  const targetSlug = legacyDiet
    ? "diet-diabetic"
    : resolveEditorialSlug(legacyCategory || "");
  return redirect(
    `/products/category/${encodeURIComponent(targetSlug)}${query ? `?${query}` : ""}`,
    301,
  );
};

const ProductsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, isLoading: categoriesLoading } = useCatalogCategories();
  const content = slug ? getCategoryContent(slug) : undefined;
  const catalogCategorySlug = slug
    ? content?.productCategorySlug || slug
    : undefined;
  const backendCategory = categories.find(
    (category) => category.slug === catalogCategorySlug,
  );
  const mappedCatalogSlugs = new Set(
    categoryContents.map((category) => category.productCategorySlug),
  );
  const categoryNavigation = [
    ...categoryContents.map((category) => ({
      routeSlug: category.slug,
      name: category.name,
    })),
    ...categories
      .filter((category) => !mappedCatalogSlugs.has(category.slug))
      .map((category) => ({ routeSlug: category.slug, name: category.name })),
  ];

  const sortParam = searchParams.get("sort") ?? "featured";
  const shippingParam = searchParams.get("shipping") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";
  const deferredSearch = useDeferredValue(searchQuery);
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

  const {
    products,
    pagination,
    isLoading,
    isFetching,
    error,
    isBackendCatalogEnabled,
    refetch,
  } = useCatalogProducts({
    category: catalogCategorySlug,
    search: content?.catalogSearch || deferredSearch || undefined,
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

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || value === "featured") next.delete(key);
      else next.set(key, value);
    });
    if (!("page" in updates)) next.delete("page");
    setSearchParams(next, { replace: true });
  };
  const updateParam = (key: string, value: string | null) =>
    updateParams({ [key]: value });

  useEffect(() => {
    if (!pagination || requestedPage <= pagination.totalPages) return;
    const next = new URLSearchParams(searchParams);
    if (pagination.totalPages <= 1) next.delete("page");
    else next.set("page", String(pagination.totalPages));
    setSearchParams(next, { replace: true });
  }, [pagination, requestedPage, searchParams, setSearchParams]);

  const resetFilters = () => setSearchParams({}, { replace: true });
  const hasActiveFilters =
    Boolean(searchQuery) ||
    validShipping !== "all" ||
    inStockOnly ||
    validSort !== "featured";
  const hasNonCanonicalFilters = hasActiveFilters;
  const handlePageChange = (page: number) => {
    updateParam("page", page <= 1 ? null : String(page));
    window.requestAnimationFrame(() => {
      document.getElementById("catalog-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const name = content?.name || backendCategory?.name || "محصولات وینیمی";
  const heading = content?.heading || backendCategory?.name || "محصولات وینیمی";
  const intro =
    content?.intro ||
    backendCategory?.description ||
    "محصول موردنظرت را با دسته‌بندی، جست‌وجو، مرتب‌سازی و فیلترهای فروشگاه پیدا کن.";
  const seoTitle =
    content?.seoTitle ||
    (backendCategory ? `خرید ${backendCategory.name}` : "محصولات");
  const seoDescription =
    content?.seoDescription ||
    backendCategory?.description ||
    "مشاهده، جست‌وجو، فیلتر و خرید آنلاین محصولات فعال وینیمی با قیمت و موجودی دریافت‌شده از سرور.";
  const collectionSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name,
        headline: heading,
        description: seoDescription,
        url: slug
          ? `${brandConfig.website}/products/category/${encodeURIComponent(slug)}`
          : `${brandConfig.website}/products`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: `${brandConfig.website}/products/${encodeURIComponent(product.slug)}`,
          })),
        },
      },
      ...(content
        ? [
            {
              "@type": "FAQPage",
              mainEntity: content.faq.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        schema={collectionSchema}
        noIndex={hasNonCanonicalFilters}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/55 to-background pb-12 pt-10 sm:pb-16">
        <div className="soft-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="container-custom relative">
          <Breadcrumbs
            className="mb-8"
            items={
              slug
                ? [
                    { name: "خانه", href: "/" },
                    { name: "فروشگاه", href: "/products" },
                    { name },
                  ]
                : [{ name: "خانه", href: "/" }, { name: "فروشگاه" }]
            }
          />
          <div className="max-w-4xl">
            {content?.eyebrow && (
              <span className="editorial-label mb-5">{content.eyebrow}</span>
            )}
            <h1 className="heading-1 text-foreground">{heading}</h1>
            <p className="body-large mt-5 max-w-3xl leading-9 text-muted-foreground">
              {intro}
            </p>
          </div>
        </div>
      </section>

      {!slug && (
        <section className="section-padding pb-4">
          <div className="container-custom">
            <CategoryShowcase
              showAllLink={false}
              title="دسته را انتخاب کن یا با فیلترها میان همه محصولات بگرد"
              description="هر دسته یک URL مستقل و قابل اشتراک دارد، اما انتخاب، فیلتر، مرتب‌سازی و محصولات همگی داخل همین فروشگاه باقی می‌مانند."
            />
          </div>
        </section>
      )}

      <section className="section-padding pt-8">
        <div className="container-custom">
          <div className="mb-10 space-y-5 rounded-3xl border border-border bg-card p-4 shadow-soft md:p-6">
            <div>
              <p className="mb-3 text-sm font-black text-foreground">انتخاب دسته‌بندی</p>
              <nav
                className="flex gap-2 overflow-x-auto pb-2"
                aria-label="دسته‌بندی محصولات"
              >
                <Link
                  to="/products"
                  aria-current={!slug ? "page" : undefined}
                  className={
                    !slug
                      ? "shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
                      : "shrink-0 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground transition hover:bg-muted"
                  }
                >
                  همه محصولات
                </Link>
                {categoryNavigation.map((category) => {
                  const isActive = slug === category.routeSlug;
                  return (
                    <Link
                      key={category.routeSlug}
                      to={`/products/category/${category.routeSlug}`}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        isActive
                          ? "shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
                          : "shrink-0 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground transition hover:bg-muted"
                      }
                    >
                      {category.name}
                    </Link>
                  );
                })}
                {categoriesLoading && (
                  <span className="shrink-0 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
                    در حال دریافت دسته‌ها…
                  </span>
                )}
              </nav>
            </div>

            <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
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
                  onChange={(event) =>
                    updateParam("q", event.target.value.slice(0, 120))
                  }
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
                    className={
                      isActive
                        ? "inline-flex items-center gap-2 rounded-xl border border-primary bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                        : "inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-muted-foreground transition hover:border-primary/50"
                    }
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
                className={
                  inStockOnly
                    ? "inline-flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-700 px-4 py-2 text-xs font-bold text-white"
                    : "inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-muted-foreground transition hover:border-emerald-600/60"
                }
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
                  onClick={() => void refetch()}
                  className="btn-primary rounded-xl px-6 py-3"
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
                      حذف فیلترهای این دسته
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
                      عبارت جستجو یا فیلترهای ارسال و موجودی را تغییر بده.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="btn-secondary rounded-xl px-6 py-3"
                        >
                          پاک‌کردن فیلترها
                        </button>
                      )}
                      {slug && (
                        <Link
                          to="/products"
                          className="btn-primary rounded-xl px-6 py-3"
                        >
                          نمایش همه محصولات
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {content && (
        <>
          <section className="section-padding bg-secondary/30">
            <div className="container-custom max-w-5xl">
              <div className="grid gap-5 md:grid-cols-2">
                {content.sections.map((section) => (
                  <article
                    key={section.title}
                    className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-8"
                  >
                    <h2 className="heading-3 mb-3 flex items-center gap-3 text-foreground">
                      <span className="h-1 w-8 rounded-full bg-primary" />
                      {section.title}
                    </h2>
                    <p className="leading-9 text-muted-foreground">{section.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section-padding">
            <div className="container-custom max-w-4xl">
              <h2 className="heading-2 mb-8 text-center text-foreground">
                پرسش‌های متداول درباره {name}
              </h2>
              <div className="space-y-3">
                {content.faq.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-2xl border border-border bg-card p-5"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-foreground">
                      {faq.question}
                      <span className="text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 leading-8 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
              <div className="mt-10 rounded-3xl bg-primary/10 p-8 text-center">
                <p className="mb-4 font-bold text-foreground">
                  سؤال دیگری درباره {name} داری؟
                </p>
                <a
                  href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  پشتیبانی واتساپ {brandConfig.brandName}
                </a>
              </div>
            </div>
          </section>

          <section className="section-padding pt-4">
            <div className="container-custom">
              <CategoryShowcase
                excludeSlug={slug}
                limit={3}
                compact
                showAllLink={false}
                title="دسته‌های دیگر همین فروشگاه"
                description="بدون خروج از مسیر خرید، دسته دیگری را انتخاب کن و از همان فیلترها و ساختار فروشگاه استفاده کن."
              />
              <Link
                to="/products"
                className="btn-secondary mx-auto mt-8 flex w-fit items-center gap-2 rounded-full px-6 py-3 font-black"
              >
                بازگشت به همه محصولات
                <ArrowLeft size={17} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default ProductsPage;
