import { ShoppingCart, Snowflake, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { formatToman } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import {
  getDiscountPercent,
  getProductDisplayPrice,
  getProductPriceRange,
  getProductRegularPrice,
  getProductSalePrice,
  getProductStock,
  getStockPresentation,
} from "@/lib/catalog";

interface ProductCardProps {
  product: Product;
}

const stockToneClasses = {
  danger: "bg-destructive/10 text-destructive",
  warning: "bg-amber-100 text-amber-800",
  success: "bg-emerald-100 text-emerald-800",
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, items } = useCart();
  const ShippingIcon = product.requiresCooling ? Snowflake : Truck;
  const shippingLabel = product.requiresCooling
    ? "ارسال یخچالی تهران/کرج"
    : "ارسال به سراسر ایران";
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const regularPrice = getProductRegularPrice(product);
  const salePrice = getProductSalePrice(product);
  const displayPrice = getProductDisplayPrice(product);
  const priceRange = getProductPriceRange(product);
  const discountPercent = getDiscountPercent(product);
  const stock = getProductStock(product);
  const stockPresentation = getStockPresentation(stock);
  const cartItem = items.find((item) => item.id === product.id && !item.selectedVariant);
  const isOutOfStock = stock <= 0;
  const isCartAtStockLimit = Boolean(cartItem && cartItem.quantity >= stock);

  const handleAdd = () => {
    if (hasVariants) {
      toast.info("برای انتخاب نوع یا سایز وارد صفحه محصول شوید");
      return;
    }

    if (isOutOfStock) {
      toast.error("این محصول در حال حاضر ناموجود است");
      return;
    }

    if (isCartAtStockLimit) {
      toast.info("تمام موجودی قابل سفارش این محصول در سبد شماست");
      return;
    }

    if (!displayPrice) {
      toast.error("قیمت این محصول با هماهنگی مشخص می‌شود");
      return;
    }

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      productCode: product.productCode,
      priceToman: displayPrice,
      requiresCooling: Boolean(product.requiresCooling),
      image: product.images[0]?.url ?? "",
    });
    toast.success(`${product.name} به سبد اضافه شد`);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-card shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-hover">
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
        aria-label={`مشاهده ${product.name}`}
      >
        {product.images[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            width={600}
            height={450}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <span className="text-8xl opacity-20" aria-hidden="true">
              🍪
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute right-4 top-4 flex flex-col items-start gap-2">
          {discountPercent > 0 && (
            <span className="rounded-full bg-destructive px-3 py-1.5 text-xs font-black text-white shadow-lg">
              {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
            </span>
          )}
          {product.badges.slice(0, discountPercent > 0 ? 1 : 2).map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-lg"
            >
              {badge}
            </span>
          ))}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/65 backdrop-blur-[2px]">
            <span className="rounded-full bg-destructive px-5 py-2 text-sm font-black text-white shadow-lg">
              ناموجود
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            کد: {product.productCode}
          </span>
          <Link
            to={`/products?category=${product.categorySlug}`}
            className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/15"
          >
            {product.category}
          </Link>
        </div>

        <Link to={`/products/${product.slug}`}>
          <h2 className="line-clamp-2 text-lg font-bold leading-7 text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h2>
        </Link>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>

        <div className="grid gap-2">
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
              product.requiresCooling
                ? "bg-sky-50 text-sky-800"
                : "bg-primary/10 text-primary"
            }`}
          >
            <ShippingIcon size={15} aria-hidden="true" />
            <span className="line-clamp-1">{shippingLabel}</span>
          </div>
          <div
            className={`rounded-xl px-3 py-2 text-xs font-bold ${stockToneClasses[stockPresentation.tone]}`}
          >
            {stockPresentation.label}
          </div>
        </div>

        <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent" />

        <div className="mt-auto flex items-end justify-between gap-3">
          {displayPrice ? (
            <div className="space-y-1">
              {salePrice && regularPrice && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatToman(regularPrice)}
                </p>
              )}
              {hasVariants && priceRange.min !== priceRange.max && (
                <span className="block text-[10px] text-muted-foreground">شروع از</span>
              )}
              <p className="text-xl font-black leading-none text-primary">
                {formatToman(displayPrice).replace(" تومان", "")}
              </p>
              <span className="text-xs text-muted-foreground">تومان</span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">قیمت با هماهنگی</div>
          )}

          {hasVariants ? (
            <Link
              to={`/products/${product.slug}`}
              aria-disabled={isOutOfStock}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition-all ${
                isOutOfStock
                  ? "pointer-events-none bg-muted text-muted-foreground"
                  : "bg-primary text-primary-foreground hover:scale-105"
              }`}
            >
              {isOutOfStock ? "ناموجود" : "انتخاب نوع"}
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock || isCartAtStockLimit}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:scale-105 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:hover:scale-100"
              aria-label={`افزودن ${product.name} به سبد خرید`}
            >
              <ShoppingCart size={16} aria-hidden="true" />
              {isOutOfStock ? "ناموجود" : isCartAtStockLimit ? "حد موجودی" : cartItem ? "افزودن بیشتر" : "افزودن"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
