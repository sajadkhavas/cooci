import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Minus,
  Package,
  Phone,
  Plus,
  ShoppingCart,
  Snowflake,
  Truck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductGridSkeleton } from "@/components/catalog/ProductGridSkeleton";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import { brandConfig, formatToman, generatePhoneUrl } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import {
  getRelatedFromCatalog,
  useCatalogProduct,
  useCatalogProducts,
} from "@/hooks/useCatalog";
import {
  getDiscountPercent,
  getProductRegularPrice,
  getProductSalePrice,
  getProductStock,
  getPublicAllergens,
  getPublicIngredients,
  getPublicProductBadges,
  getPublicProductDescription,
  getPublicShelfLife,
  getPublicStorageTips,
  getStockPresentation,
  getVariantDiscountPercent,
  getVariantDisplayPrice,
  getVariantRegularPrice,
  getVariantSalePrice,
  isProductContentVerified,
  isProductInventoryVerified,
} from "@/lib/catalog";
import { getPreferredProductVariant } from "@/lib/product-selection";

const ProductDetailSkeleton = () => (
  <section className="section-padding">
    <div className="container-custom">
      <div className="mb-8 h-5 w-72 animate-pulse rounded bg-muted" />
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square animate-pulse rounded-3xl bg-muted" />
        <div className="space-y-6">
          <div className="h-8 w-32 animate-pulse rounded-full bg-muted" />
          <div className="h-14 w-4/5 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            <div className="h-5 w-full animate-pulse rounded bg-muted" />
            <div className="h-5 w-5/6 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-24 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-16 w-full animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  </section>
);

const stockToneClasses = {
  danger: "border-destructive/30 bg-destructive/5 text-destructive",
  warning: "border-amber-300 bg-amber-50 text-amber-900",
  success: "border-emerald-300 bg-emerald-50 text-emerald-900",
};

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading, error } = useCatalogProduct(slug);
  const { products: catalogProducts } = useCatalogProducts();
  const { addItem, items } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedVariantId(null);
    setQuantity(1);
  }, [slug]);

  const selectedVariant = useMemo(
    () =>
      product?.variants?.find((variant) => variant.id === selectedVariantId) ??
      (product ? getPreferredProductVariant(product) : undefined),
    [product, selectedVariantId],
  );

  const activeStock = product ? getProductStock(product, selectedVariant?.id) : 0;

  useEffect(() => {
    if (activeStock <= 0) {
      setQuantity(1);
      return;
    }
    setQuantity((current) => Math.min(Math.max(1, current), activeStock));
  }, [activeStock]);

  if (isLoading) return <ProductDetailSkeleton />;

  if (error && !product) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center" role="alert">
            <AlertCircle className="mx-auto mb-4 text-destructive" size={52} aria-hidden="true" />
            <h1 className="heading-2 mb-4 text-foreground">دریافت محصول با مشکل روبه‌رو شد</h1>
            <p className="mb-6 text-muted-foreground">صفحه را دوباره بارگذاری کنید یا به فهرست محصولات برگردید.</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => window.location.reload()} className="btn-primary rounded-xl px-6 py-3">
                تلاش دوباره
              </button>
              <Link to="/products" className="btn-secondary rounded-xl border border-border px-6 py-3">
                مشاهده محصولات
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section-padding">
        <div className="container-custom text-center">
          <span className="mb-4 block text-6xl" aria-hidden="true">🔍</span>
          <h1 className="heading-2 mb-4">محصول یافت نشد</h1>
          <p className="mb-6 text-muted-foreground">این محصول در کاتالوگ فعال سایت پیدا نشد.</p>
          <Link to="/products" className="btn-primary inline-block rounded-xl px-6 py-3">
            بازگشت به محصولات
          </Link>
        </div>
      </section>
    );
  }

  const relatedProducts = getRelatedFromCatalog(product, catalogProducts, 4);
  const regularPrice = selectedVariant
    ? getVariantRegularPrice(selectedVariant)
    : getProductRegularPrice(product);
  const salePrice = selectedVariant
    ? getVariantSalePrice(selectedVariant)
    : getProductSalePrice(product);
  const activePrice = selectedVariant
    ? getVariantDisplayPrice(selectedVariant)
    : salePrice ?? regularPrice;
  const contentVerified = isProductContentVerified(product);
  const inventoryVerified = isProductInventoryVerified(product);
  const publicDescription = getPublicProductDescription(product);
  const publicBadges = getPublicProductBadges(product);
  const publicIngredients = getPublicIngredients(product);
  const publicAllergens = getPublicAllergens(product);
  const publicShelfLife = getPublicShelfLife(product);
  const publicStorageTips = getPublicStorageTips(product);
  const activeWeight = contentVerified
    ? selectedVariant?.weight ?? product.weight
    : undefined;
  const activeCode = selectedVariant?.productCode ?? product.productCode;
  const ShippingIcon = product.requiresCooling ? Snowflake : Truck;
  const shippingText = product.requiresCooling
    ? "این انتخاب نیازمند روش تحویل سرد است. محدوده و ظرفیت نهایی در Checkout و بک‌اند تأیید می‌شود."
    : "روش تحویل قابل انتخاب بر اساس شهر مقصد و تنظیمات فعال Checkout نمایش داده می‌شود.";
  const stockPresentation = getStockPresentation(
    activeStock,
    inventoryVerified,
  );
  const discountPercent = selectedVariant
    ? getVariantDiscountPercent(selectedVariant)
    : salePrice
      ? getDiscountPercent(product)
      : 0;
  const cartKey = `${product.id}::${selectedVariant?.id ?? ""}`;
  const existingCartItem = items.find(
    (item) => `${item.id}::${item.selectedVariant?.id ?? ""}` === cartKey,
  );
  const remainingStock = Math.max(0, activeStock - (existingCartItem?.quantity ?? 0));
  const canAddToCart = Boolean(activePrice) && activeStock > 0 && remainingStock > 0;
  const maxQuantity = Math.max(1, remainingStock);


  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: publicDescription,
    sku: activeCode,
    image: product.images.map((image) => image.url),
    brand: { "@type": "Brand", name: brandConfig.brandName },
    offers: activePrice
      ? {
          "@type": "Offer",
          price: activePrice * 10,
          priceCurrency: "IRR",
          ...(inventoryVerified
            ? {
                availability:
                  activeStock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
              }
            : {}),
          url: `${brandConfig.website}/products/${encodeURIComponent(product.slug)}`,
        }
      : undefined,
  };

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!activePrice) {
      toast.error("قیمت این انتخاب هنوز ثبت نشده است");
      return;
    }

    if (activeStock <= 0) {
      toast.error("این انتخاب در حال حاضر ناموجود است");
      return;
    }

    if (remainingStock <= 0) {
      toast.info("تمام موجودی قابل سفارش این انتخاب در سبد شماست");
      return;
    }

    const safeQuantity = Math.min(quantity, remainingStock);

    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        productCode: activeCode,
        priceToman: activePrice,
        regularPriceToman:
          regularPrice && regularPrice > activePrice ? regularPrice : undefined,
        stock: activeStock,
        requiresCooling: Boolean(product.requiresCooling),
        image: product.images[0]?.url ?? "",
        selectedVariant: selectedVariant
          ? {
              id: selectedVariant.id,
              name: selectedVariant.name,
              priceToman: activePrice,
              stock: activeStock,
            }
          : undefined,
      },
      safeQuantity,
    );
    toast.success(`${safeQuantity.toLocaleString("fa-IR")} عدد ${product.name} به سبد اضافه شد`);
  };

  return (
    <>
      <SEO
        title={product.seo?.title ?? product.name}
        description={product.seo?.description || publicDescription}
        type="product"
        schema={productSchema}
        image={product.images[0]?.url}
      />

      <section className="section-padding pb-32 md:pb-24">
        <div className="container-custom">
          <Breadcrumbs
            className="mb-8"
            items={[
              { name: "خانه", href: "/" },
              { name: "محصولات", href: "/products" },
              {
                name: product.category,
                href: `/products?category=${encodeURIComponent(product.categorySlug)}`,
              },
              { name: product.name },
            ]}
          />

          {error && (
            <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
              <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
              آخرین اطلاعات دریافت‌شده نمایش داده می‌شود؛ به‌روزرسانی کاتالوگ موقتاً ناموفق بود.
            </div>
          )}

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <ProductGallery product={product} />
            </div>

            <div className="order-1 space-y-6 text-right lg:order-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">
                  کد محصول: <strong className="text-foreground">{activeCode}</strong>
                </span>
                {publicBadges.map((badge) => (
                  <span key={badge} className="rounded-full border border-gold/30 bg-gold/15 px-4 py-2 text-sm font-bold text-amber-800">
                    {badge}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
                {product.name}
              </h1>
              <p className="text-base leading-8 text-muted-foreground md:text-lg">
                {publicDescription}
              </p>

              {!contentVerified && (
                <div
                  className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-950"
                  role="note"
                >
                  اطلاعات ترکیبات، آلرژن، وزن، ماندگاری و رسانه این محصول هنوز از منبع تأییدشده بک‌اند دریافت نشده‌اند و پیش از خرید حساس یا پزشکی باید جداگانه بررسی شوند.
                </div>
              )}

              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
                  <h2 className="font-bold text-foreground">انتخاب سایز / نوع</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const isActive = selectedVariant?.id === variant.id;
                      const variantStock = getProductStock(product, variant.id);
                      const isUnavailable = variantStock <= 0;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => handleVariantChange(variant.id)}
                          disabled={isUnavailable}
                          aria-pressed={isActive}
                          className={`rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
                            isActive
                              ? "border-primary bg-primary text-primary-foreground shadow-md"
                              : "border-border bg-card text-foreground hover:border-primary/50"
                          }`}
                        >
                          {variant.name}
                          {variant.price && (
                            <span className="mt-0.5 block text-xs opacity-80">
                              {formatToman(variant.price)}
                            </span>
                          )}
                          {isUnavailable && <span className="mt-1 block text-[10px]">ناموجود</span>}
                        </button>
                      );
                    })}
                  </div>
                  {contentVerified && selectedVariant?.description && (
                    <p className="text-sm leading-7 text-muted-foreground">
                      {selectedVariant.description}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 border-y border-border py-5">
                {activePrice ? (
                  <div className="space-y-1">
                    {salePrice && regularPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground line-through">{formatToman(regularPrice)}</span>
                        <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-black text-destructive">
                          {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="bg-gradient-to-l from-primary to-cocoa bg-clip-text text-3xl font-black text-transparent md:text-4xl">
                        {activePrice.toLocaleString("fa-IR")}
                      </span>
                      <span className="text-muted-foreground">تومان</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">قیمت با هماهنگی</span>
                )}

                {activeWeight && (
                  <div className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2">
                    <Package size={18} className="text-muted-foreground" aria-hidden="true" />
                    <span className="font-medium text-foreground">{activeWeight}</span>
                  </div>
                )}
              </div>

              <div className={`flex items-start gap-3 rounded-2xl border p-5 ${stockToneClasses[stockPresentation.tone]}`}>
                <CheckCircle2 size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <h2 className="mb-1 font-bold">وضعیت موجودی</h2>
                  <p className="text-sm leading-7">{stockPresentation.label}</p>
                  {existingCartItem && activeStock > 0 && (
                    <p className="mt-1 text-xs opacity-80">
                      {existingCartItem.quantity.toLocaleString("fa-IR")} عدد از این انتخاب در سبد شماست.
                    </p>
                  )}
                </div>
              </div>

              <div className={`flex items-start gap-3 rounded-2xl border p-5 ${product.requiresCooling ? "border-sky-200 bg-sky-50 text-sky-900" : "border-primary/20 bg-primary/10 text-primary"}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80">
                  <ShippingIcon size={20} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="mb-1 font-bold">شرایط ارسال و نگهداری</h2>
                  <p className="text-sm leading-7">{shippingText}</p>
                </div>
              </div>

              <div className="grid gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="font-bold text-foreground">تعداد سفارش</span>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-secondary p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      disabled={!canAddToCart || quantity <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-card hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="کم کردن تعداد"
                    >
                      <Minus size={17} aria-hidden="true" />
                    </button>
                    <span className="min-w-10 text-center font-black">{quantity.toLocaleString("fa-IR")}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                      disabled={!canAddToCart || quantity >= maxQuantity}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-card hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="زیاد کردن تعداد"
                    >
                      <Plus size={17} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                {activePrice && canAddToCart && (
                  <p className="text-sm text-muted-foreground">
                    جمع این انتخاب: <strong className="text-primary">{formatToman(activePrice * quantity)}</strong>
                  </p>
                )}
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className="flex items-center justify-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:hover:scale-100"
                >
                  <ShoppingCart size={22} aria-hidden="true" />
                  {activeStock <= 0
                    ? "ناموجود"
                    : remainingStock <= 0
                      ? "تمام موجودی در سبد است"
                      : "افزودن به سبد خرید"}
                </button>
                <Link
                  to="/cart"
                  className="flex items-center justify-center gap-3 rounded-xl border-2 border-primary px-8 py-4 font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  مشاهده سبد خرید
                </Link>
                <a
                  href={generatePhoneUrl()}
                  className="flex items-center justify-center gap-3 rounded-xl border border-border px-8 py-3 text-sm text-foreground/80 transition-all hover:bg-secondary sm:col-span-2"
                >
                  <Phone size={18} aria-hidden="true" />
                  سؤال دارید؟ {brandConfig.phone}
                </a>
              </div>

              <div className="grid gap-4 pt-6">
                <div className="rounded-2xl border border-border bg-gradient-to-l from-secondary to-muted p-5">
                  <h2 className="mb-3 flex items-center gap-2 font-bold text-foreground">
                    <span className="h-1 w-8 rounded-full bg-primary" />
                    مواد تشکیل‌دهنده
                  </h2>
                  {publicIngredients.length > 0 ? (
                    <p className="leading-relaxed text-muted-foreground">
                      {publicIngredients.join("، ")}
                    </p>
                  ) : (
                    <p className="leading-8 text-amber-900">
                      فهرست ترکیبات تأییدشده هنوز از بک‌اند دریافت نشده است.
                    </p>
                  )}
                </div>

                {publicAllergens.length > 0 && (
                  <div className="rounded-2xl border border-rose/30 bg-gradient-to-l from-rose/10 to-red-50 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose/20">
                        <AlertTriangle size={20} className="text-destructive" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="mb-1 font-bold text-destructive">هشدار آلرژی</h2>
                        <p className="text-sm text-muted-foreground">حاوی: {publicAllergens.join("، ")}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-secondary/50 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Clock size={18} className="text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="mb-1 font-semibold text-foreground">ماندگاری</h2>
                        <p className="text-sm text-muted-foreground">{publicShelfLife}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/50 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Package size={18} className="text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="mb-1 font-semibold text-foreground">نگهداری</h2>
                        <p className="text-sm text-muted-foreground">{publicStorageTips}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-24 border-t border-border pt-12" aria-labelledby="related-products-title">
              <div className="mb-10 flex items-center gap-4">
                <span className="h-1 w-12 rounded-full bg-primary" />
                <h2 id="related-products-title" className="text-2xl font-bold text-foreground md:text-3xl">
                  محصولات مرتبط
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      {activePrice && activeStock > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-[0_-10px_30px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">
          <div className="container-custom flex items-center gap-3 px-0">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-bold text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">{formatToman(activePrice * quantity)}</p>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground shadow-lg disabled:bg-muted disabled:text-muted-foreground"
            >
              <ShoppingCart size={18} aria-hidden="true" />
              افزودن
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
