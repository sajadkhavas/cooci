import { Link } from "react-router-dom";
import { Phone, ShoppingBag, Heart, Truck, Snowflake } from "lucide-react";
import { Product } from "@/data/products";
import { generateWhatsAppUrl, generateProductOrderMessage, generatePhoneUrl } from "@/config/brand";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const whatsappMessage = generateProductOrderMessage(product.name, product.productCode);
  const [isLiked, setIsLiked] = useState(false);
  const ShippingIcon = product.requiresCooling ? Snowflake : Truck;
  const shippingLabel = product.requiresCooling
    ? "ارسال یخچالی تهران و کرج"
    : "ارسال به سراسر ایران";
  const variantPrices = product.variants?.map((v) => v.price).filter((p): p is number => typeof p === "number") ?? [];
  const lowestVariantPrice = variantPrices.length ? Math.min(...variantPrices) : undefined;
  const displayPrice = product.price ?? lowestVariantPrice;
  const hasVariants = (product.variants?.length ?? 0) > 0;

  return (
    <article className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 border border-border/50 hover:border-accent/30">
      {/* Image Section */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        {product.images[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <span className="text-8xl opacity-20">🍪</span>
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badges - Top Right */}
        {product.badges.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {product.badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        
        {/* Like Button - Top Left */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <Heart 
            size={20} 
            className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
          />
        </button>
        
        {/* Quick View on Hover */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <div className="flex gap-2">
            <Link 
              to={`/products/${product.slug}`}
              className="flex-1 bg-white/95 backdrop-blur-sm text-foreground py-3 rounded-xl text-center text-sm font-bold shadow-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              مشاهده محصول
            </Link>
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Header: Code & Category */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            کد: {product.productCode}
          </span>
          <span className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full font-medium">
            {product.category}
          </span>
        </div>

        {/* Title */}
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${product.requiresCooling ? "bg-sky-50 text-sky-800" : "bg-primary/10 text-primary"}`}>
          <ShippingIcon size={15} />
          <span className="line-clamp-1">{shippingLabel}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent" />

        {/* Footer: Price & Actions */}
        <div className="flex items-center justify-between gap-3">
          {/* Price */}
          {product.price && (
            <div className="space-y-0.5">
              <p className="text-xl font-bold text-primary">
                {product.price.toLocaleString("fa-IR")}
              </p>
              <span className="text-xs text-muted-foreground">تومان</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <a
              href={generateWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              سفارش
            </a>
            <a
              href={generatePhoneUrl()}
              className="w-11 h-11 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center hover:scale-105"
              aria-label="تماس تلفنی"
            >
              <Phone size={18} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};