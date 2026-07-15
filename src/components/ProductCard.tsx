import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Heart, ShoppingBag, Snowflake, Truck } from "lucide-react";
import { Product } from "@/data/products";
import { formatToman, useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const ShippingIcon = product.requiresCooling ? Snowflake : Truck;
  const shippingLabel = product.requiresCooling
    ? "ارسال یخچالی تهران و کرج"
    : "ارسال به سراسر ایران";
  const variantPrices = product.variants?.map((v) => v.price).filter((p): p is number => typeof p === "number") ?? [];
  const lowestVariantPrice = variantPrices.length ? Math.min(...variantPrices) : undefined;
  const displayPrice = product.price ?? lowestVariantPrice;
  const hasVariants = (product.variants?.length ?? 0) > 0;

  const handleAddToCart = () => {
    addItem(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

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
          aria-label="افزودن به علاقه‌مندی"
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
            <div className="text-xs text-muted-foreground">
              قیمت با هماهنگی
            </div>
          )}

          {/* Action Button */}
          {hasVariants || !displayPrice ? (
            <Link
              to={`/products/${product.slug}`}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <ShoppingBag size={17} />
              انتخاب نوع
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {justAdded ? <Check size={17} /> : <ShoppingBag size={17} />}
              {justAdded ? "اضافه شد" : "افزودن"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};