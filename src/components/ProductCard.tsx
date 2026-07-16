import { Link } from "react-router-dom";
import { Heart, MessageCircle, Snowflake, Truck } from "lucide-react";
import { Product } from "@/data/products";
import {
  brandConfig,
  formatToman,
  generateProductOrderMessage,
  generateWhatsAppUrl,
} from "@/config/brand";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const ShippingIcon = product.requiresCooling ? Snowflake : Truck;
  const shippingLabel = product.requiresCooling
    ? "ارسال یخچالی تهران/کرج"
    : "ارسال به سراسر ایران";
  const variantPrices = product.variants?.map((v) => v.price).filter((p): p is number => typeof p === "number") ?? [];
  const lowestVariantPrice = variantPrices.length ? Math.min(...variantPrices) : undefined;
  const displayPrice = product.price ?? lowestVariantPrice;
  const hasVariants = (product.variants?.length ?? 0) > 0;

  const whatsappUrl = generateWhatsAppUrl(
    generateProductOrderMessage(product.name, product.productCode),
  );

  return (
    <article className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 border border-border/50 hover:border-accent/30 flex flex-col">
      <Link to={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        {product.images[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            width={600}
            height={450}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <span className="text-8xl opacity-20">🍪</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {product.badges.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {product.badges.slice(0, 2).map((badge) => (
              <span key={badge} className="bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                {badge}
              </span>
            ))}
          </div>
        )}
      </Link>

      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            کد: {product.productCode}
          </span>
          <span className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full font-medium">
            {product.category}
          </span>
        </div>

        <Link to={`/products/${product.slug}`}>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${product.requiresCooling ? "bg-sky-50 text-sky-800" : "bg-primary/10 text-primary"}`}>
          <ShippingIcon size={15} />
          <span className="line-clamp-1">{shippingLabel}</span>
        </div>

        <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent" />

        <div className="flex items-center justify-between gap-3 mt-auto">
          {displayPrice ? (
            <div className="space-y-0.5">
              {hasVariants && (
                <span className="text-[10px] text-muted-foreground">شروع از</span>
              )}
              <p className="text-xl font-bold text-primary leading-none">
                {formatToman(displayPrice).replace(" تومان", "")}
              </p>
              <span className="text-xs text-muted-foreground">تومان</span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">قیمت با هماهنگی</div>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-whatsapp text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
            aria-label={`سفارش ${product.name} در واتساپ ${brandConfig.brandName}`}
          >
            <MessageCircle size={16} />
            سفارش
          </a>
        </div>
      </div>
    </article>
  );
};

export { Heart };
