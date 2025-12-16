import { useParams, Link } from "react-router-dom";
import { Phone, AlertTriangle, Clock, Package, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import { brandConfig, generateWhatsAppUrl, generateProductOrderMessage, generatePhoneUrl } from "@/config/brand";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");

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
        title={product.name}
        description={product.shortDescription}
        type="product"
        schema={productSchema}
      />

      <section className="section-padding">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary">
              خانه
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">
              محصولات
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
                {product.images[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl opacity-30">🍪</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              {/* Badges */}
              {product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.badges.map((badge) => (
                    <span key={badge} className="badge-accent">
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <span className="text-sm text-muted-foreground">
                  کد محصول: {product.productCode}
                </span>
                <h1 className="heading-1 text-foreground mt-2">{product.name}</h1>
              </div>

              <p className="body-large text-muted-foreground">
                {product.longDescription}
              </p>

              {/* Price */}
              {product.price && (
                <p className="text-3xl font-bold text-primary">
                  {product.price.toLocaleString("fa-IR")} تومان
                </p>
              )}

              {/* Weight */}
              {product.weight && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package size={18} />
                  <span>وزن: {product.weight}</span>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href={generateWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-whatsapp py-4 rounded-lg text-center text-lg font-medium"
                >
                  سفارش در واتساپ
                </a>
                <a
                  href={generatePhoneUrl()}
                  className="flex items-center justify-center gap-2 px-6 py-4 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Phone size={20} />
                  تماس تلفنی
                </a>
              </div>

              {/* Details */}
              <div className="border-t border-border pt-6 space-y-4">
                {/* Ingredients */}
                <div>
                  <h3 className="font-semibold mb-2">مواد تشکیل‌دهنده</h3>
                  <p className="text-muted-foreground">
                    {product.ingredients.join("، ")}
                  </p>
                </div>

                {/* Allergens */}
                {product.allergens.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-rose/20 rounded-lg">
                    <AlertTriangle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-destructive">آلرژن‌ها</h3>
                      <p className="text-sm text-muted-foreground">
                        حاوی: {product.allergens.join("، ")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Shelf Life */}
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">ماندگاری</h3>
                    <p className="text-sm text-muted-foreground">{product.shelfLife}</p>
                  </div>
                </div>

                {/* Storage */}
                <div>
                  <h3 className="font-semibold mb-1">نحوه نگهداری</h3>
                  <p className="text-sm text-muted-foreground">{product.storageTips}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="heading-2 text-foreground mb-8">محصولات مرتبط</h2>
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
