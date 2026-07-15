import { useParams, Link } from "react-router-dom";
import { Phone, AlertTriangle, Clock, Package, Truck, Snowflake } from "lucide-react";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import { brandConfig, generateWhatsAppUrl, generateProductOrderMessage, generatePhoneUrl } from "@/config/brand";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

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
  const whatsappMessage = generateProductOrderMessage(product.name, product.productCode);
  const ShippingIcon = product.requiresCooling ? Snowflake : Truck;
  const shippingText =
    product.shippingNote ??
    (product.requiresCooling ? "ارسال یخچالی فقط تهران و کرج" : "ارسال با بسته‌بندی محافظ به سراسر ایران");

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription,
    sku: product.productCode,
    image: product.images[0]?.url,
    brand: {
      "@type": "Brand",
      name: brandConfig.brandName,
    },
    offers: product.price
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "IRR",
          availability: "https://schema.org/InStock",
        }
      : undefined,
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
          {/* Breadcrumb */}
          <nav className="flex items-center justify-start gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              خانه
            </Link>
            <span className="text-border">/</span>
            <Link to="/products" className="hover:text-primary transition-colors">
              محصولات
            </Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images */}
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
              
              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <div 
                      key={idx}
                      className="w-20 h-20 rounded-xl overflow-hidden bg-secondary cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    >
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info - Right Aligned */}
            <div className="space-y-6 order-1 lg:order-2 text-right">
              {/* Product Code */}
              <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                <span className="text-sm text-muted-foreground">
                  کد محصول: <span className="font-bold text-foreground">{product.productCode}</span>
                </span>
              </div>

              {/* Badges */}
              {product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-start">
                  {product.badges.map((badge) => (
                    <span 
                      key={badge} 
                      className="bg-gradient-to-l from-gold/20 to-amber-500/20 text-amber-800 px-4 py-1.5 rounded-full text-sm font-semibold border border-gold/30"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.longDescription}
              </p>

              {/* Price & Weight */}
              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border">
                {product.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-3xl md:text-4xl font-black bg-gradient-to-l from-primary to-cocoa bg-clip-text text-transparent">
                      {product.price.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-muted-foreground">تومان</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-xl">
                    <Package size={18} className="text-muted-foreground" />
                    <span className="text-foreground font-medium">{product.weight}</span>
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

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href={generateWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex-1 overflow-hidden bg-[#25D366] py-4 px-8 rounded-xl text-center text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center gap-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    پشتیبانی واتساپ
                  </span>
                </a>
                <a
                  href={generatePhoneUrl()}
                  className="group flex items-center justify-center gap-3 px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-bold"
                >
                  <Phone size={22} className="group-hover:scale-110 transition-transform" />
                  تماس تلفنی
                </a>
              </div>

              {/* Details Cards */}
              <div className="grid gap-4 pt-6">
                {/* Ingredients */}
                <div className="bg-gradient-to-l from-secondary to-muted p-5 rounded-2xl border border-border">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-8 h-1 bg-primary rounded-full" />
                    مواد تشکیل‌دهنده
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.ingredients.join("، ")}
                  </p>
                </div>

                {/* Allergens */}
                {product.allergens.length > 0 && (
                  <div className="bg-gradient-to-l from-rose/10 to-red-50 p-5 rounded-2xl border border-rose/30">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-rose/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={20} className="text-destructive" />
                      </div>
                      <div>
                        <h3 className="font-bold text-destructive mb-1">هشدار آلرژی</h3>
                        <p className="text-sm text-muted-foreground">
                          حاوی: {product.allergens.join("، ")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shelf Life & Storage */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-5 rounded-2xl border border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock size={18} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">ماندگاری</h3>
                        <p className="text-sm text-muted-foreground">{product.shelfLife}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-secondary/50 p-5 rounded-2xl border border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package size={18} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">نگهداری</h3>
                        <p className="text-sm text-muted-foreground">{product.storageTips}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-24 pt-12 border-t border-border">
              <div className="flex items-center gap-4 mb-10">
                <span className="w-12 h-1 bg-primary rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">محصولات مرتبط</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetailPage;