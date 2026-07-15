import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Snowflake, Truck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/ProductCard";
import { categories, getProductsByCategory } from "@/data/products";

const sortOptions = [
  { value: "featured", label: "پیشنهادی وینیمی" },
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

const shippingOptions = [
  { value: "all", label: "همه ارسال‌ها" },
  { value: "nationwide", label: "ارسال سراسری" },
  { value: "chilled", label: "یخچالی تهران/کرج" },
];

const productPrice = (product: ReturnType<typeof getProductsByCategory>[number]) => {
  const variantPrices = product.variants?.map((variant) => variant.price).filter((price): price is number => typeof price === "number") ?? [];
  if (typeof product.price === "number") return product.price;
  if (variantPrices.length) return Math.min(...variantPrices);
  return Number.POSITIVE_INFINITY;
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("q") || "";
  const sortBy = searchParams.get("sort") || "featured";
  const shippingFilter = searchParams.get("shipping") || "all";
  const dietOnly = searchParams.get("diet") === "true";

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all" || value === "featured") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    let filtered = getProductsByCategory(activeCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((product) => {
        const searchable = [
          product.name,
          product.shortDescription,
          product.longDescription,
          product.productCode,
          product.category,
          product.weight,
          ...(product.tags ?? []),
          ...(product.flavors ?? []),
          ...(product.ingredients ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      });
    }

    if (shippingFilter === "nationwide") {
      filtered = filtered.filter((product) => product.shippingScope === "nationwide" && !product.requiresCooling);
    }

    if (shippingFilter === "chilled") {
      filtered = filtered.filter((product) => product.requiresCooling || product.shippingScope === "tehran-karaj");
    }

    if (dietOnly) {
      filtered = filtered.filter((product) =>
        product.categorySlug === "diet" ||
        product.badges.some((badge) => badge.includes("رژیمی") || badge.includes("بدون قند")) ||
        (product.tags ?? []).some((tag) => tag.includes("رژیمی") || tag.includes("بدون قند") || tag.includes("دیابتی")),
      );
    }

    switch (sortBy) {
      case "newest":
        filtered = [...filtered].reverse();
        break;
      case "price-asc":
        filtered = [...filtered].sort((a, b) => productPrice(a) - productPrice(b));
        break;
      case "price-desc":
        filtered = [...filtered].sort((a, b) => productPrice(b) - productPrice(a));
        break;
      case "featured":
      default:
        filtered = [...filtered].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    return filtered;
  }, [activeCategory, dietOnly, searchQuery, shippingFilter, sortBy]);

  const resetFilters = () => setSearchParams({}, { replace: true });

  return (
    <>
      <SEO
        title="محصولات"
        description="مشاهده، فیلتر و خرید آنلاین محصولات وینیمی؛ کوکی، مینی کوکی، تیرامیسو، چیزکیک، رول دارچینی، مینی کروسان و باکس هدیه."
      />

      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <h1 className="heading-1 text-foreground">محصولات وینیمی</h1>
          <p className="body-large text-muted-foreground mt-4 max-w-2xl mx-auto">
            محصول را انتخاب کنید، نوع یا سایز را مشخص کنید و سفارش را از مسیر سبد خرید و پرداخت آنلاین ادامه دهید.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-10 space-y-5 rounded-3xl border border-border bg-card p-4 md:p-6 shadow-soft">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => updateParam("category", cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] items-center">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="جستجوی محصول، طعم، مواد اولیه یا کد..."
                  value={searchQuery}
                  onChange={(event) => updateParam("q", event.target.value)}
                  className="input-field pr-10 w-full"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <select
                  value={sortBy}
                  onChange={(event) => updateParam("sort", event.target.value)}
                  className="input-field pr-10 appearance-none cursor-pointer min-w-44"
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
                className={`px-4 py-3 rounded-xl text-sm font-bold border transition-colors ${
                  dietOnly
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50"
                }`}
              >
                فقط رژیمی / بدون قند افزوده
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {shippingOptions.map((option) => {
                const Icon = option.value === "chilled" ? Snowflake : Truck;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateParam("shipping", option.value)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      shippingFilter === option.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon size={15} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <p className="text-muted-foreground">
              {filteredProducts.length.toLocaleString("fa-IR")} محصول یافت شد
            </p>
            {(activeCategory !== "all" || searchQuery || shippingFilter !== "all" || dietOnly || sortBy !== "featured") && (
              <button type="button" onClick={resetFilters} className="text-sm font-bold text-primary hover:underline">
                حذف همه فیلترها
              </button>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-3xl bg-card border border-border shadow-soft">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="text-muted-foreground body-large mb-4">
                محصولی با این فیلتر پیدا نشد. دسته‌بندی یا عبارت جستجو را تغییر دهید.
              </p>
              <button type="button" onClick={resetFilters} className="btn-primary px-8 py-3 rounded-xl">
                نمایش همه محصولات
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
