import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, Clock, ShoppingCart, Minus, Package, Phone, Plus, Snowflake, Truck } from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import {
  brandConfig,
  formatToman,
  generatePhoneUrl,
} from "@/config/brand";
import { useCart } from "@/context/CartContext";
import { getRelatedFromCatalog, useCatalogProduct, useCatalogProducts } from "@/hooks/useCatalog";
import { reviews } from "@/data/reviews";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product } = useCatalogProduct(slug);
  const { products: catalogProducts } = useCatalogProducts();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container-custom section-padding text-center">
        <span className="text-6xl mb-4 block">🔍</span>
        <h1 className="heading-2 mb-4">محصول یافت نشد</h1>
        <p className="text-muted-foreground mb-6">این محصول در کاتالوگ پیدا نشد.</p>
        <Link to="/products" className="btn-primary px-6 py-3 rounded-lg inline-block">
          بازگشت به محصولات
        </Link>
      </div>
    );
  }

  const safeRelatedProducts = getRelatedFromCatalog(product, catalogProducts, 4);
  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId) ?? product.variants?.[0];
  const activePrice = selectedVariant?.price ?? product.price;
  const activeWeight = selectedVariant?.weight ?? product.weight;
  const activeCode = selectedVariant?.productCode ?? product.productCode;
  const ShippingIcon = product.requiresCooling ? Snowflake : Truck;
  const shippingText =
    product.shippingNote ??
    (product.requiresCooling ? "ارسال یخچالی فقط تهران و کرج" : "ارسال با بسته‌بندی محافظ به سراسر ایران");

  const productReviews = reviews.filter((r) => r.product === product.name).slice(0, 3);
  const avgRating = productReviews.length
    ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length
    : 5;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription,
    sku: activeCode,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: brandConfig.brandName },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: productReviews.length || 1,
    },
    offers: activePrice
      ? {
          "@type": "Offer",
          price: activePrice,
          priceCurrency: "IRR",
          availability: "https://schema.org/InStock",
          url: `${brandConfig.website}/products/${product.slug}`,
        }
      : undefined,
  };

  const { addItem, items } = useCart();
  const cartKey = selectedVariant ? `${product.id}::${selectedVariant.id}` : `${product.id}::`;
  const inCart = items.some((i) => `${i.id}::${i.selectedVariant?.id ?? ""}` === cartKey);

  const handleAddToCart = () => {
    if (!activePrice) {
      toast.error("قیمت با هماهنگی مشخص می‌شود؛ لطفاً تماس بگیرید");
      return;
    }
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        productCode: activeCode,
        priceToman: activePrice,
        requiresCooling: !!product.requiresCooling,
        image: product.images[0]?.url ?? "",
        selectedVariant: selectedVariant
          ? { id: selectedVariant.id, name: selectedVariant.name, priceToman: selectedVariant.price ?? activePrice }
          : undefined,
      },
      quantity,
    );
    toast.success(`${product.name} به سبد اضافه شد`);
  };

  return (
    <>
      <SEO
        title={product.seo?.title ?? product.name}
        description={product.seo?.description ?? product.shortDescription}
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
              { name: product.category, href: `/products?category=${product.categorySlug}` },
              { name: product.name },
            ]}
          />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-4 order-2 lg:order-1">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-muted shadow-2xl">
                {product.images[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="eager"
                    decoding="async"
                    width={800}
                    height={800}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl opacity-30">🍪</span>
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden bg-secondary cursor-pointer hover:ring-2 hover:ring-primary transition-all flex-shrink-0">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6 order-1 lg:order-2 text-right">
              <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                <span className="text-sm text-muted-foreground">کد محصول: <span className="font-bold text-foreground">{activeCode}</span></span>
              </div>

              {product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-start">
                  {product.badges.map((badge) => (
                    <span key={badge} className="bg-gradient-to-l from-gold/20 to-amber-500/20 text-amber-800 px-4 py-1.5 rounded-full text-sm font-semibold border border-gold/30">
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">{product.name}</h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{product.longDescription}</p>

              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-foreground">انتخاب سایز / نوع:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const isActive = (selectedVariant?.id ?? product.variants![0].id) === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${isActive ? "border-primary bg-primary text-primary-foreground shadow-md" : "border-border bg-card text-foreground hover:border-primary/50"}`}
                        >
                          {variant.name}
                          {variant.price ? <span className="block text-xs opacity-80 mt-0.5">{formatToman(variant.price)}</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border">
                {activePrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-3xl md:text-4xl font-black bg-gradient-to-l from-primary to-cocoa bg-clip-text text-transparent">{activePrice.toLocaleString("fa-IR")}</span>
                    <span className="text-muted-foreground">تومان</span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">قیمت با هماهنگی</span>
                )}
                {activeWeight && (
                  <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-xl">
                    <Package size={18} className="text-muted-foreground" />
                    <span className="text-foreground font-medium">{activeWeight}</span>
                  </div>
                )}
              </div>

              <div className={`flex items-start gap-3 rounded-2xl border p-5 ${product.requiresCooling ? "border-sky-200 bg-sky-50 text-sky-900" : "border-primary/20 bg-primary/10 text-primary"}`}>
                <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0">
                  <ShippingIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold mb-1">شرایط ارسال و نگهداری</h3>
                  <p className="text-sm leading-7">{shippingText}</p>
                </div>
              </div>

              <div className="grid gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="font-bold text-foreground">تعداد سفارش</span>
                  <div className="inline-flex items-center gap-2 bg-secondary rounded-xl p-1">
                    <button type="button" onClick={() => setQuantity((v) => Math.max(1, v - 1))} className="w-10 h-10 rounded-lg bg-card hover:bg-muted flex items-center justify-center" aria-label="کم کردن">
                      <Minus size={17} />
                    </button>
                    <span className="min-w-10 text-center font-black">{quantity.toLocaleString("fa-IR")}</span>
                    <button type="button" onClick={() => setQuantity((v) => Math.min(99, v + 1))} className="w-10 h-10 rounded-lg bg-card hover:bg-muted flex items-center justify-center" aria-label="زیاد کردن">
                      <Plus size={17} />
                    </button>
                  </div>
                </div>
                {activePrice && <p className="text-sm text-muted-foreground">جمع این انتخاب: <strong className="text-primary">{formatToman(activePrice * quantity)}</strong></p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="bg-primary py-4 px-8 rounded-xl text-lg font-bold text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={22} />
                  {inCart ? "افزودن دوباره به سبد" : "افزودن به سبد خرید"}
                </button>
                <Link
                  to="/cart"
                  className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all font-bold"
                >
                  مشاهده سبد خرید
                </Link>
                <a
                  href={generatePhoneUrl()}
                  className="sm:col-span-2 flex items-center justify-center gap-3 px-8 py-3 border border-border text-foreground/80 rounded-xl hover:bg-secondary transition-all text-sm"
                >
                  <Phone size={18} />
                  سوال دارید؟ {brandConfig.phone}
                </a>
              </div>

              <div className="grid gap-4 pt-6">
                <div className="bg-gradient-to-l from-secondary to-muted p-5 rounded-2xl border border-border">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><span className="w-8 h-1 bg-primary rounded-full" />مواد تشکیل‌دهنده</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.ingredients.join("، ")}</p>
                </div>
                {product.allergens.length > 0 && (
                  <div className="bg-gradient-to-l from-rose/10 to-red-50 p-5 rounded-2xl border border-rose/30">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-rose/20 rounded-xl flex items-center justify-center flex-shrink-0"><AlertTriangle size={20} className="text-destructive" /></div>
                      <div>
                        <h3 className="font-bold text-destructive mb-1">هشدار آلرژی</h3>
                        <p className="text-sm text-muted-foreground">حاوی: {product.allergens.join("، ")}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-5 rounded-2xl border border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><Clock size={18} className="text-primary" /></div>
                      <div><h3 className="font-semibold text-foreground mb-1">ماندگاری</h3><p className="text-sm text-muted-foreground">{product.shelfLife}</p></div>
                    </div>
                  </div>
                  <div className="bg-secondary/50 p-5 rounded-2xl border border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><Package size={18} className="text-primary" /></div>
                      <div><h3 className="font-semibold text-foreground mb-1">نگهداری</h3><p className="text-sm text-muted-foreground">{product.storageTips}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {productReviews.length > 0 && (
            <div className="mt-20 pt-10 border-t border-border">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">نظرات مشتریان درباره {product.name}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {productReviews.map((review) => (
                  <div key={review.id} className="bg-card p-6 rounded-2xl border border-border">
                    <div className="flex text-gold mb-3">
                      {"★".repeat(review.rating)}
                    </div>
                    <p className="text-foreground/80 leading-7 mb-4 text-sm">{review.text}</p>
                    <div className="text-xs text-muted-foreground">
                      <strong className="text-foreground">{review.name}</strong> — {review.city} · {review.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {safeRelatedProducts.length > 0 && (
            <div className="mt-24 pt-12 border-t border-border">
              <div className="flex items-center gap-4 mb-10">
                <span className="w-12 h-1 bg-primary rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">محصولات مرتبط</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {safeRelatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {activePrice && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl p-3 shadow-[0_-10px_30px_-20px_rgba(0,0,0,0.35)] md:hidden">
          <div className="container-custom flex items-center gap-3 px-0">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-bold text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">{formatToman(activePrice * quantity)}</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp text-white rounded-xl px-5 py-3 text-sm font-black shadow-lg flex items-center gap-2"
            >
              <MessageCircle size={18} />
              سفارش
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
