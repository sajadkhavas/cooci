import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, Check, Clock, CreditCard, Minus, Package, Plus, ShoppingBag, Snowflake, Truck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts, getProductBySlug, getRelatedProducts } from "@/data/products";
import { brandConfig } from "@/config/brand";
import { formatToman, useCart } from "@/context/CartContext";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) {
    return (
      <div className="container-custom section-padding text-center">
        <span className="text-6xl mb-4 block">🔍</span>
        <h1 className="heading-2 mb-4">محصول یافت نشد</h1>
        <Link to="/products" className="btn-primary px-6 py-3 rounded-lg inline-block">
          بازگشت به محصولات
        </Link>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product, 4);
  const safeRelatedProducts = relatedProducts.length >= 4
    ? relatedProducts
    : [
        ...relatedProducts,
        ...getFeaturedProducts().filter((item) => item.id !== product.id && !relatedProducts.some((related) => related.id === item.id)),
      ].slice(0, 4);
  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId) ?? product.variants?.[0];
  const activePrice = selectedVariant?.price ?? product.price;
  const activeWeight = selectedVariant?.weight ?? product.weight;
  const activeCode = selectedVariant?.productCode ?? product.productCode;
  const isOutOfStock = product.stock === 0;
  const ShippingIcon = product.requiresCooling ? Snowflake : Truck;
  const shippingText =
    product.shippingNote ??
    (product.requiresCooling ? "ارسال یخچالی فقط تهران و کرج" : "ارسال با بسته‌بندی محافظ به سراسر ایران");

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription,
    sku: activeCode,
    image: product.images[0]?.url,
    brand: {
      "@type": "Brand",
      name: brandConfig.brandName,
    },
    offers: activePrice
      ? {
          "@type": "Offer",
          price: activePrice,
          priceCurrency: "IRR",
          availability: isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        }
      : undefined,
  };

  const handleAddToCart = () => {
    if (!activePrice || isOutOfStock) return;
    addItem(product, selectedVariant, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <>
      <SEO
        title={product.seo?.title ?? product.name}
        description={product.seo?.description ?? product.shortDescription}
        type="product"
        schema={productSchema}
      />

      <section className="section-padding">
        <div className="container-custom">
          <nav className="flex items-center justify-start gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">خانه</Link>
            <span className="text-border">/</span>
            <Link to="/products" className="hover:text-primary transition-colors">محصولات</Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-4 order-2 lg:order-1">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-muted shadow-2xl">
                {product.images[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl opacity-30">🍪</span>
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden bg-secondary cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
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
              <p className="text-lg text-muted-foreground leading-relaxed">{product.longDescription}</p>

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

              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border">
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
                <span className={`px-4 py-2 rounded-xl text-sm font-bold ${isOutOfStock ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                  {isOutOfStock ? "ناموجود" : "موجود برای سفارش"}
                </span>
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
                    <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="w-10 h-10 rounded-lg bg-card hover:bg-muted flex items-center justify-center" aria-label="کم کردن تعداد">
                      <Minus size={17} />
                    </button>
                    <span className="min-w-10 text-center font-black">{quantity.toLocaleString("fa-IR")}</span>
                    <button type="button" onClick={() => setQuantity((value) => Math.min(99, value + 1))} className="w-10 h-10 rounded-lg bg-card hover:bg-muted flex items-center justify-center" aria-label="زیاد کردن تعداد">
                      <Plus size={17} />
                    </button>
                  </div>
                </div>
                {activePrice && <p className="text-sm text-muted-foreground">جمع این انتخاب: <strong className="text-primary">{formatToman(activePrice * quantity)}</strong></p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!activePrice || isOutOfStock}
                  className="group relative overflow-hidden bg-primary py-4 px-8 rounded-xl text-center text-lg font-bold text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative flex items-center justify-center gap-3">
                    {justAdded ? <Check size={22} /> : <ShoppingBag size={22} />}
                    {justAdded ? "به سبد اضافه شد" : "افزودن به سبد خرید"}
                  </span>
                </button>
                <Link to="/cart" className="group flex items-center justify-center gap-3 px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-bold">
                  <CreditCard size={22} className="group-hover:scale-110 transition-transform" />
                  مشاهده سبد خرید
                </Link>
              </div>

              {!activePrice && <p className="text-sm text-muted-foreground leading-7">برای این محصول قیمت قطعی ثبت نشده است؛ بعد از تکمیل دیتای بک‌اند، امکان افزودن به سبد خرید فعال می‌شود.</p>}

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

          {safeRelatedProducts.length > 0 && (
            <div className="mt-24 pt-12 border-t border-border">
              <div className="flex items-center gap-4 mb-10">
                <span className="w-12 h-1 bg-primary rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">محصولات مرتبط</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {safeRelatedProducts.map((relatedProduct) => <ProductCard key={relatedProduct.id} product={relatedProduct} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetailPage;
