import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/ProductCard";
import { products, categories, getProductsByCategory } from "@/data/products";

const sortOptions = [
  { value: "featured", label: "پرفروش‌ترین" },
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const activeCategory = searchParams.get("category") || "all";

  const filteredProducts = useMemo(() => {
    let filtered = getProductsByCategory(activeCategory);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.includes(query) ||
          p.shortDescription.includes(query) ||
          p.productCode.toLowerCase().includes(query) ||
          (p.tags ?? []).some((tag) => tag.includes(query)) ||
          (p.flavors ?? []).some((flavor) => flavor.includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].reverse();
        break;
      case "price-asc":
        filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "featured":
      default:
        filtered = [...filtered].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return filtered;
  }, [activeCategory, searchQuery, sortBy]);

  const handleCategoryChange = (slug: string) => {
    if (slug === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <>
      <SEO
        title="محصولات"
        description="مشاهده و سفارش محصولات وینیمی؛ کوکی، مینی کوکی، تیرامیسو، چیزکیک، رول دارچینی، مینی کروسان و باکس هدیه."
      />

      {/* Header */}
      <section className="bg-secondary/50 py-12">
        <div className="container-custom">
          <h1 className="heading-1 text-foreground text-center">محصولات وینیمی</h1>
          <p className="body-large text-muted-foreground text-center mt-4 max-w-2xl mx-auto">
            از کوکی‌های روزانه و محصولات بدون قند افزوده تا دسرهای یخچالی و باکس‌های هدیه.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-4 lg:mr-auto">
              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="جستجوی محصول، طعم یا کد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pr-10 w-full sm:w-64"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <SlidersHorizontal
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field pr-10 appearance-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-muted-foreground mb-6">
            {filteredProducts.length} محصول یافت شد
          </p>

          {/* Products Grid */}
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
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="text-muted-foreground body-large">
                محصولی با این مشخصات یافت نشد
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
