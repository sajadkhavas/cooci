import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

const read = (path) => readFileSync(path, "utf8");
const write = (path, content) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart().replace(/\s*$/, "\n"), "utf8");
};
const replace = (path, needle, replacement, expected = 1) => {
  const source = read(path);
  const count = source.split(needle).length - 1;
  if (count !== expected) {
    throw new Error(`${path}: expected ${expected} occurrence(s) of ${needle}, found ${count}`);
  }
  writeFileSync(path, source.split(needle).join(replacement), "utf8");
};

write(
  "src/routes.ts",
  `import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("./pages/HomePage.tsx"),
  route("products", "./pages/ProductsPage.tsx"),
  route("categories", "./routes/categories-redirect.tsx"),
  route("products/category/:slug", "./pages/ProductsPage.tsx"),
  route("products/:slug", "./pages/ProductDetailPage.tsx"),
  route("blog", "./pages/BlogListPage.tsx"),
  route("blog/:slug", "./pages/BlogDetailPage.tsx"),
  route("city/:slug", "./pages/CityPage.tsx"),
  route("gift", "./pages/GiftPage.tsx"),
  route("corporate", "./pages/CorporatePage.tsx"),
  route("reviews", "./pages/ReviewsPage.tsx"),
  route("quality", "./pages/QualityPage.tsx"),
  route("about", "./pages/AboutPage.tsx"),
  route("gallery", "./pages/GalleryPage.tsx"),
  route("faq", "./pages/FAQPage.tsx"),
  route("contact", "./pages/ContactPage.tsx"),
  route("privacy", "./pages/PrivacyPage.tsx"),
  route("terms", "./pages/TermsPage.tsx"),
  route("shipping", "./pages/ShippingPage.tsx"),
  route("cart", "./routes/cart.tsx"),
  route("checkout", "./routes/checkout.tsx"),
  route("payment/mock", "./routes/payment-mock.tsx"),
  route("payment/callback", "./routes/payment-callback.tsx"),
  route("account/login", "./routes/account-login.tsx"),
  route("account", "./routes/account.tsx"),
  route("account/orders/:orderId", "./routes/account-order.tsx"),
  route("*", "./routes/not-found.tsx"),
] satisfies RouteConfig;
`,
);

write(
  "src/routes/categories-redirect.tsx",
  `import { redirect } from "react-router";

export const loader = () => redirect("/products", 301);

export default function CategoriesRedirectRoute() {
  return null;
}
`,
);

write(
  "src/pages/ProductsPage.tsx",
  `import { useDeferredValue, useEffect } from "react";
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
  const seoTitle = content?.seoTitle ||
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
`,
);

rmSync("src/pages/CategoriesPage.tsx", { force: true });
rmSync("src/pages/CategoryPage.tsx", { force: true });

replace(
  "src/components/catalog/CategoryShowcase.tsx",
  `              to="/categories"
`,
  `              to="/products"
`,
);
replace(
  "src/components/catalog/CategoryShowcase.tsx",
  `              همه دسته‌بندی‌ها
`,
  `              فروشگاه و همه دسته‌ها
`,
);
replace(
  "src/components/layout/Header.tsx",
  `  { name: "دسته‌بندی‌ها", href: "/categories", match: "prefix" },
`,
  "",
);

let footer = read("src/components/layout/Footer.tsx");
footer = footer
  .replace(
    '    { name: "دسته‌بندی محصولات", href: "/categories" },',
    '    { name: "فروشگاه و دسته‌بندی‌ها", href: "/products" },',
  )
  .replace(
    '    { name: "همه دسته‌بندی‌ها", href: "/categories" },',
    '    { name: "همه محصولات", href: "/products" },',
  )
  .replace('                to="/categories"', '                to="/products"')
  .replace("                  دسته‌بندی محصولات", "                  فروشگاه و دسته‌بندی‌ها");
if (footer.includes('href: "/categories"') || footer.includes('to="/categories"')) {
  throw new Error("Footer still contains a direct /categories link.");
}
writeFileSync("src/components/layout/Footer.tsx", footer, "utf8");

let home = read("src/pages/HomePage.tsx");
home = home
  .replaceAll('to="/categories"', 'to="/products"')
  .replace("انتخاب از دسته‌بندی‌ها", "ورود به فروشگاه و دسته‌ها")
  .replace("مشاهده همه دسته‌بندی‌ها", "مشاهده فروشگاه و دسته‌بندی‌ها");
writeFileSync("src/pages/HomePage.tsx", home, "utf8");

replace(
  "scripts/generate-sitemap.mjs",
  `  { path: "/categories", changefreq: "weekly", priority: "0.85" },
`,
  "",
);

write(
  "scripts/audit-content-integrity.mjs",
  `import { readFileSync } from "node:fs";

const errors = [];
const files = {
  brand: "src/config/brand.ts",
  seo: "src/components/SEO.tsx",
  contentClient: "src/lib/content.ts",
  contentSchema: "src/lib/content-schema.ts",
  reviewsPage: "src/pages/ReviewsPage.tsx",
  blogList: "src/pages/BlogListPage.tsx",
  blogDetail: "src/pages/BlogDetailPage.tsx",
  about: "src/pages/AboutPage.tsx",
  quality: "src/pages/QualityPage.tsx",
  corporate: "src/pages/CorporatePage.tsx",
  inquiry: "src/components/forms/InquiryForm.tsx",
  productCard: "src/components/ProductCard.tsx",
  productGallery: "src/components/catalog/ProductGallery.tsx",
  productDetail: "src/pages/ProductDetailPage.tsx",
  productsPage: "src/pages/ProductsPage.tsx",
  catalog: "src/lib/catalog.ts",
  trust: "src/components/trust/EnamadTrustSlot.tsx",
  trustSecurity: "src/lib/security/enamad.ts",
  footer: "src/components/layout/Footer.tsx",
  header: "src/components/layout/Header.tsx",
  routes: "src/routes.ts",
  categoriesRedirect: "src/routes/categories-redirect.tsx",
  home: "src/pages/HomePage.tsx",
  categoryShowcase: "src/components/catalog/CategoryShowcase.tsx",
  categoriesContent: "src/data/categoriesContent.ts",
  sitemapGenerator: "scripts/generate-sitemap.mjs",
  sitemap: "public/sitemap.xml",
  runtimeE2e: "e2e/runtime-performance.spec.mjs",
  phase10Documentation: "docs/FRONTEND_PHASE_10_0_HOME_CATEGORIES.md",
  phase102Documentation: "docs/FRONTEND_PHASE_10_2_UNIFIED_SHOP_CATEGORIES.md",
};
const sources = Object.fromEntries(
  Object.entries(files).map(([name, path]) => [name, readFileSync(path, "utf8")]),
);
const requireText = (sourceName, text, description = text) => {
  if (!sources[sourceName].includes(text)) errors.push(`${files[sourceName]}: missing ${description}.`);
};
const forbidText = (sourceName, text, description = text) => {
  if (sources[sourceName].includes(text)) errors.push(`${files[sourceName]}: contains forbidden ${description}.`);
};

for (const endpoint of [
  "/api/store/settings",
  "/api/store/pages/",
  "/api/store/posts",
  "/api/store/faqs",
  "/api/store/gallery",
  "/api/store/cities/",
  "/api/inquiries",
]) requireText("contentClient", endpoint, `backend content endpoint ${endpoint}`);
requireText("contentClient", "apiRequest<unknown>", "runtime public-content response boundary");
requireText("contentSchema", 'code: "invalid_content_contract"', "runtime public-content parser");
requireText("reviewsPage", "loadProductReviews", "published verified-purchase reviews from backend");
requireText("reviewsPage", "خرید تأییدشده", "verified-purchase disclosure");
forbidText("reviewsPage", "نظرات واقعی مشتریان", "unverified real-review claim");
requireText("blogList", "loadPosts", "backend post listing");
requireText("blogDetail", "loadPost", "backend post detail");
requireText("about", "ManagedContentPage", "managed about content");
requireText("quality", "ManagedContentPage", "managed quality content");
requireText("corporate", "InquiryForm", "persisted corporate inquiry");
requireText("inquiry", "submitInquiry", "persisted public inquiry");
requireText("trust", "extractOfficialEnamadBadge", "isolated eNAMAD parser usage");
requireText("trustSecurity", 'const ENAMAD_HOST = "trustseal.enamad.ir"', "official eNAMAD host allowlist");
forbidText("trust", "dangerouslySetInnerHTML", "raw badge HTML execution");
forbidText("trustSecurity", "dangerouslySetInnerHTML", "raw trust-policy HTML execution");

for (const claim of [
  "بیش از ۵ سال تجربه",
  "رعایت اصول HACCP",
  "شکلات اروپایی",
  "بدون پالم و مارگارین در هیچ محصولی",
  "امکان ارائه فاکتور رسمی برای شرکت‌ها",
]) {
  for (const sourceName of ["brand", "about", "quality", "corporate", "footer", "home", "categoriesContent"]) {
    forbidText(sourceName, claim, `unverified claim: ${claim}`);
  }
}
for (const claim of ["openingHours", "priceRange", '"@type": "Bakery"']) {
  forbidText("seo", claim, `unsupported structured-data field ${claim}`);
}
requireText("seo", "sanitizeSchema", "schema sanitization");
requireText("seo", "delete cloned.aggregateRating", "rating sanitization");
requireText("seo", "delete offers.availability", "inventory schema sanitization");
requireText("seo", "serializeJsonLd", "safe JSON-LD serialization");
for (const sourceName of ["productCard", "productDetail"]) {
  requireText(sourceName, "getPublicProductBadges", "filtered public product badges");
  requireText(sourceName, "getStockPresentation", "inventory presentation policy");
}
requireText("productCard", "isProductInventoryVerified", "inventory verification flag");
requireText("productCard", "isProductMediaVerified", "media verification flag");
requireText("productGallery", "تصویر نمایشی کاتالوگ", "product media disclosure");
requireText("productDetail", "getPublicProductDescription", "public product description policy");
requireText("productDetail", "getPublicIngredients", "verified ingredient policy");
requireText("productDetail", "getPublicAllergens", "verified allergen policy");
requireText("catalog", "isProductInventoryVerified", "inventory verification helper");
requireText("catalog", "isProductContentVerified", "content verification helper");
requireText("catalog", "isProductMediaVerified", "media verification helper");

requireText("routes", 'route("categories", "./routes/categories-redirect.tsx")', "legacy category-index redirect route");
requireText("routes", 'route("products/category/:slug", "./pages/ProductsPage.tsx")', "shared shop category route module");
requireText("categoriesRedirect", 'redirect("/products", 301)', "permanent /categories redirect");
forbidText("header", 'href: "/categories"', "header category-index navigation");
forbidText("footer", 'href: "/categories"', "footer category-index navigation");
forbidText("footer", 'to="/categories"', "footer category-index CTA");
for (const validPath of [
  "/products/category/cookies",
  "/products/category/mini-cookies",
  "/products/category/diet-diabetic",
  "/products/category/cakes",
  "/products/category/cheesecakes",
  "/products/category/pastry",
  "/products/category/gift-boxes",
]) {
  requireText("footer", validPath, `valid editorial category link ${validPath}`);
  requireText("sitemap", validPath, `category sitemap URL ${validPath}`);
}
requireText("home", "سفارش آنلاین کوکی،", "product-led homepage H1");
requireText("home", "<CategoryShowcase", "homepage category discovery");
requireText("home", "خرید بر اساس موقعیت", "occasion-led homepage section");
forbidText("home", 'to="/categories"', "homepage category-index link");
forbidText("home", "داده نهایی با بک‌اند", "developer-facing homepage copy");
forbidText("home", "وضعیت داده", "developer-facing homepage copy");
requireText("productsPage", "useParams", "one route-aware shop UI");
requireText("productsPage", "getCategoryContent", "editorial category SEO mapping");
requireText("productsPage", "categoryContents", "shop category navigation");
requireText("productsPage", 'aria-label="دسته‌بندی محصولات"', "crawlable category navigation");
requireText("productsPage", '"@type": "CollectionPage"', "shop and category CollectionPage schema");
requireText("productsPage", "content?.catalogSearch", "subcategory search mapping");
requireText("productsPage", "hasNonCanonicalFilters", "filtered-page robots policy");
requireText("categoryShowcase", "productCount", "backend category count support");
requireText("categoryShowcase", 'to="/products"', "all-shop destination");
forbidText("sitemapGenerator", '{ path: "/categories"', "redirect-only URL in sitemap");
requireText("runtimeE2e", "shop unifies categories and filters", "unified-shop browser acceptance");
requireText("phase10Documentation", "homepage_and_category_architecture=ready", "Phase 10.0 marker");
requireText("phase102Documentation", "unified_shop_categories=ready", "Phase 10.2 marker");
for (const claim of ["ارسال سراسری", "بدون مواد نگهدارنده", "تخفیف ویژه برای سفارش"]) {
  forbidText("categoriesContent", claim, `unsupported static category claim: ${claim}`);
}
if (errors.length) {
  console.error(`Content integrity audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Content integrity audit passed: ${Object.keys(files).length} contracts verified, including unified shop categories and the permanent legacy redirect.`);
`,
);

write(
  "scripts/audit-modern-ui.mjs",
  `import { readFileSync } from "node:fs";
const errors = [];
const read = (path) => readFileSync(path, "utf8");
const files = {
  index: "src/index.css",
  modernPages: "src/styles/modern-pages.css",
  main: "src/root.tsx",
  layout: "src/components/layout/SiteLayout.tsx",
  header: "src/components/layout/Header.tsx",
  footer: "src/components/layout/Footer.tsx",
  home: "src/pages/HomePage.tsx",
  products: "src/pages/ProductsPage.tsx",
  categoryShowcase: "src/components/catalog/CategoryShowcase.tsx",
  productCard: "src/components/ProductCard.tsx",
  reveal: "src/components/motion/Reveal.tsx",
  progress: "src/components/layout/ScrollProgress.tsx",
};
const sources = Object.fromEntries(Object.entries(files).map(([key, path]) => [key, read(path)]));
const requireText = (file, text, description = text) => { if (!sources[file].includes(text)) errors.push(`${files[file]}: missing ${description}.`); };
const forbidText = (file, text, description = text) => { if (sources[file].includes(text)) errors.push(`${files[file]}: contains forbidden ${description}.`); };
forbidText("index", "@import url(", "render-blocking remote font import");
for (const requirement of [".glass-panel", ".bento-card", ".reveal.is-visible", "prefers-reduced-motion", ".ambient-layer", ".scroll-progress"]) requireText("index", requirement);
requireText("main", 'import "./styles/modern-pages.css"', "modern routed-page stylesheet");
requireText("layout", "<ScrollProgress", "global scroll progress");
requireText("layout", "ambient-layer", "ambient backdrop markup");
requireText("layout", "page-enter", "route transition wrapper");
for (const requirement of ['role="dialog"', 'aria-modal="true"', "focusableSelector", 'aria-controls="mobile-navigation-dialog"', "backdrop-blur-2xl"]) requireText("header", requirement);
requireText("header", 'href: "/products"', "single shop desktop/mobile navigation");
forbidText("header", 'href: "/categories"', "duplicate category-index navigation");
for (const validPath of ["/products", "/products/category/diet-diabetic", "/products/category/cakes", "/products/category/gift-boxes"]) requireText("footer", validPath, `valid modern footer link ${validPath}`);
forbidText("footer", "/categories", "duplicate category-index footer link");
requireText("footer", "WINIMI BAKERY", "editorial footer wordmark");
for (const requirement of ["<Reveal", "marquee-track", "<CategoryShowcase", "occasionCards", "modern-section-title", "سفارش آنلاین کوکی،", "خرید بر اساس موقعیت"]) requireText("home", requirement);
forbidText("home", "داده نهایی با بک‌اند", "developer-facing homepage message");
forbidText("home", "وضعیت داده", "developer-facing homepage message");
for (const requirement of ["<CategoryShowcase", 'aria-label="دسته‌بندی محصولات"', "categoryNavigation", "CatalogPagination", "hasNonCanonicalFilters", "rounded-3xl", "heading-1"]) requireText("products", requirement, `unified shop contract: ${requirement}`);
for (const requirement of ["categoryVisuals", "backendCategory?.image", "productCount", "group-hover:scale-105", "rounded-[2rem]", "modern-section-title"]) requireText("categoryShowcase", requirement);
for (const requirement of ["getPublicProductBadges", "getStockPresentation", "isProductInventoryVerified", "isProductMediaVerified", "rounded-[2rem]", "group-hover:scale-[1.07]"]) requireText("productCard", requirement);
requireText("reveal", "IntersectionObserver", "dependency-free reveal observer");
requireText("reveal", "prefers-reduced-motion", "reveal reduced-motion support");
requireText("progress", 'aria-hidden="true"', "decorative progress accessibility");
requireText("modernPages", 'nav[aria-label="مراحل ثبت سفارش"]', "modern checkout progress styling");
requireText("modernPages", "main details[open]", "modern FAQ/details styling");
if (errors.length) { errors.forEach((error) => console.error(`- ${error}`)); process.exit(1); }
console.log(`Modern UI audit passed: ${Object.keys(files).length} design-system contracts verified, including one category-aware shop UI.`);
`,
);

replace(
  "scripts/audit-frontend.mjs",
  `  'route("categories", "./pages/CategoriesPage.tsx")',
`,
  `  'route("categories", "./routes/categories-redirect.tsx")',
`,
);

let runtimeE2e = read("e2e/runtime-performance.spec.mjs");
const start = runtimeE2e.indexOf('test("category index is crawlable and editorial slugs map to Laravel"');
const end = runtimeE2e.indexOf('test("profiles production scrolling on desktop and mobile"', start);
if (start < 0 || end < 0) throw new Error("Unable to locate category E2E block.");
const unifiedTest = `test("shop unifies categories and filters while editorial slugs map to Laravel", async ({ page }) => {
  await page.goto("/categories", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\\/products$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "محصولات وینیمی" }),
  ).toBeVisible();

  const categoryNavigation = page.getByRole("navigation", {
    name: "دسته‌بندی محصولات",
  });
  await expect(categoryNavigation).toBeVisible();
  await expect(
    categoryNavigation.getByRole("link", { name: "همه محصولات" }),
  ).toHaveAttribute("aria-current", "page");

  const expectedDestinations = [
    ["کوکی‌های خانگی", "/products/category/cookies"],
    ["مینی کوکی", "/products/category/mini-cookies"],
    ["رژیمی و بدون قند افزوده", "/products/category/diet-diabetic"],
    ["کیک و دسر", "/products/category/cakes"],
    ["چیزکیک", "/products/category/cheesecakes"],
    ["رول و کروسان", "/products/category/pastry"],
    ["باکس هدیه", "/products/category/gift-boxes"],
  ];
  for (const [name, href] of expectedDestinations) {
    await expect(categoryNavigation.getByRole("link", { name })).toHaveAttribute(
      "href",
      href,
    );
  }

  const cookiesResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/catalog/products") &&
      response.url().includes("category=cookies") &&
      response.status() === 200,
  );
  await categoryNavigation.getByRole("link", { name: "کوکی‌های خانگی" }).click();
  await cookiesResponse;
  await expect(page).toHaveURL(/\\/products\\/category\\/cookies$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /کوکی‌های وینیمی/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "دسته‌بندی محصولات" })
      .getByRole("link", { name: "کوکی‌های خانگی" }),
  ).toHaveAttribute("aria-current", "page");

  const legacyCategoryResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/catalog/products") &&
      response.url().includes("category=diet") &&
      response.status() === 200,
  );
  await page.goto("/products?diet=true", { waitUntil: "domcontentloaded" });
  await legacyCategoryResponse;
  await expect(page).toHaveURL(/\\/products\\/category\\/diet-diabetic$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /رژیمی و بدون قند افزوده/ }),
  ).toBeVisible();
  await assertNoHorizontalOverflow(page);
});

`;
runtimeE2e = runtimeE2e.slice(0, start) + unifiedTest + runtimeE2e.slice(end);
writeFileSync("e2e/runtime-performance.spec.mjs", runtimeE2e, "utf8");

write(
  "scripts/audit-frontend-phase-10-2.mjs",
  `import fs from "node:fs";
const files = {
  routes: "src/routes.ts",
  redirect: "src/routes/categories-redirect.tsx",
  products: "src/pages/ProductsPage.tsx",
  home: "src/pages/HomePage.tsx",
  header: "src/components/layout/Header.tsx",
  footer: "src/components/layout/Footer.tsx",
  showcase: "src/components/catalog/CategoryShowcase.tsx",
  sitemapGenerator: "scripts/generate-sitemap.mjs",
  runtimeE2e: "e2e/runtime-performance.spec.mjs",
  doc: "docs/FRONTEND_PHASE_10_2_UNIFIED_SHOP_CATEGORIES.md",
};
const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) errors.push(`Missing Phase 10.2 file: ${path}`);
  else sources[name] = fs.readFileSync(path, "utf8");
}
const requireText = (file, text, label = text) => { if (!sources[file]?.includes(text)) errors.push(`${files[file]}: missing ${label}`); };
const forbidText = (file, text, label = text) => { if (sources[file]?.includes(text)) errors.push(`${files[file]}: contains forbidden ${label}`); };
requireText("routes", 'route("categories", "./routes/categories-redirect.tsx")', "legacy permanent redirect route");
requireText("routes", 'route("products/category/:slug", "./pages/ProductsPage.tsx")', "shared category shop module");
requireText("redirect", 'redirect("/products", 301)', "301 redirect");
requireText("products", "export const loader", "legacy query redirect loader");
requireText("products", "resolveEditorialSlug", "backend/editorial slug bridge");
requireText("products", "categoryNavigation", "category navigation inside shop");
requireText("products", "getCategoryContent", "category-specific SEO content");
requireText("products", 'aria-label="دسته‌بندی محصولات"', "accessible category navigation");
requireText("products", "hasNonCanonicalFilters", "filtered page noindex policy");
requireText("products", "CatalogPagination", "shared pagination");
requireText("products", '"@type": "CollectionPage"', "category collection schema");
forbidText("home", 'to="/categories"', "homepage category-index link");
forbidText("header", 'href: "/categories"', "duplicate category header item");
forbidText("footer", "/categories", "duplicate category footer item");
requireText("showcase", 'to="/products"', "unified shop all-link");
forbidText("sitemapGenerator", '{ path: "/categories"', "redirect-only sitemap entry");
requireText("runtimeE2e", "shop unifies categories and filters", "browser acceptance");
requireText("doc", "unified_shop_categories=ready", "phase marker");
for (const removed of ["src/pages/CategoriesPage.tsx", "src/pages/CategoryPage.tsx"]) {
  if (fs.existsSync(removed)) errors.push(`${removed} must be removed after UI unification`);
}
const report = { generatedAt: new Date().toISOString(), passed: errors.length === 0, marker: "unified_shop_categories=ready", errors };
fs.writeFileSync("frontend-phase10-2-audit.json", JSON.stringify(report, null, 2) + "\\n");
if (errors.length) { errors.forEach((error) => console.error(`- ${error}`)); process.exit(1); }
console.log("Frontend Phase 10.2 audit passed: unified_shop_categories=ready.");
`,
);

const packageJson = JSON.parse(read("package.json"));
packageJson.scripts["audit:phase10-2"] = "node scripts/audit-frontend-phase-10-2.mjs";
packageJson.scripts.check = packageJson.scripts.check.replace(
  "npm run audit:ssr &&",
  "npm run audit:ssr && npm run audit:phase10-2 &&",
);
write("package.json", JSON.stringify(packageJson, null, 2));

write(
  "docs/FRONTEND_PHASE_10_2_UNIFIED_SHOP_CATEGORIES.md",
  `# Frontend Phase 10.2 — Unified shop and categories

Marker: \`unified_shop_categories=ready\`

## Customer-facing rule

Winimi exposes one shop experience. The customer sees category navigation, search, shipping/stock filters, sorting, pagination and product results inside the same storefront UI.

## SEO rule

- \`/products\` is the all-products shop.
- \`/products/category/:slug\` keeps a unique crawlable URL, H1, metadata, canonical path, CollectionPage/ItemList schema and evidence-safe editorial content.
- Category routes use the same \`ProductsPage\` route module and filtering UI.
- \`/categories\` permanently redirects to \`/products\` with HTTP 301 and is excluded from the sitemap.
- Legacy \`?category=...\` and \`?diet=true\` URLs permanently redirect to the matching category URL.
- Search, shipping, stock and non-default sort states are noindex and canonicalize to the clean pathname.

## Navigation rule

Header, footer, homepage and category showcase no longer send customers to a standalone category index. Category cards link directly to the corresponding filtered shop route.
`,
);

console.log("Phase 10.2 unified shop migration applied.");
