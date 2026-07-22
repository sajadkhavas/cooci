import {
  ArrowUpLeft,
  ImageIcon,
  ShoppingCart,
  Snowflake,
  Truck,
} from "lucide-react";
import { Link } from "react-router";
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
  getPublicProductBadges,
  getPublicProductSummary,
  getStockPresentation,
  isProductInventoryVerified,
  isProductMediaVerified,
} from "@/lib/catalog";

interface ProductCardProps {
  product: Product;
}

const stockToneClasses = {
  danger: "border-destructive/20 bg-destructive/8 text-destructive",
  warning: "border-amber-300/70 bg-amber-50/80 text-amber-950",
  success: "border-emerald-300/70 bg-emerald-50/80 text-emerald-900",
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, items } = useCart();
  const ShippingIcon = product.requiresCooling ? Snowflake : Truck;
  const shippingLabel = product.requiresCooling
    ? "نیازمند روش تحویل سرد"
    : "روش تحویل در Checkout تعیین می‌شود";
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const regularPrice = getProductRegularPrice(product);
  const salePrice = getProductSalePrice(product);
  const displayPrice = getProductDisplayPrice(product);
  const priceRange = getProductPriceRange(product);
  const discountPercent = getDiscountPercent(product);
  const stock = getProductStock(product);
  const inventoryVerified = isProductInventoryVerified(product);
  const mediaVerified = isProductMediaVerified(product);
  const stockPresentation = getStockPresentation(stock, inventoryVerified);
  const publicBadges = getPublicProductBadges(product);
  const publicSummary = getPublicProductSummary(product);
  const cartItem = items.find(
    (item) => item.id === product.id && !item.selectedVariant,
  );
  const isOutOfStock = stock <= 0;
  const isCartAtStockLimit = Boolean(
    cartItem && stock > 0 && cartItem.quantity >= stock,
  );

  const handleAdd = () => {
    if (hasVariants) {
      toast.info("برای انتخاب نوع یا سایز وارد صفحه محصول شوید");
      return;
    }
    if (isOutOfStock) {
      toast.error(
        inventoryVerified
          ? "این محصول براساس موجودی تأییدشده ناموجود است"
          : "موجودی قابل سفارش این محصول هنوز از سرور دریافت نشده است",
      );
      return;
    }
    if (isCartAtStockLimit) {
      toast.info("تمام موجودی تأییدشده این محصول در سبد شماست");
      return;
    }
    if (!displayPrice) {
      toast.error("قیمت این محصول نیازمند استعلام است");
      return;
    }

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      productCode: product.productCode,
      priceToman: displayPrice,
      regularPriceToman:
        regularPrice && regularPrice > displayPrice ? regularPrice : undefined,
      stock,
      requiresCooling: Boolean(product.requiresCooling),
      image: product.images[0]?.url ?? "",
    });
    toast.success(`${product.name} به سبد اضافه شد؛ موجودی در ادامه تأیید می‌شود`);
  };

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[2rem] border border-border/65 bg-card/75 shadow-card backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-primary/25 hover:shadow-hover focus-within:border-primary/40 focus-within:shadow-hover">
      <Link
        to={`/products/${encodeURIComponent(product.slug)}`}
        className="relative block aspect-[1.12/1] overflow-hidden bg-muted"
        aria-label={`مشاهده جزئیات ${product.name}`}
      >
        {product.images[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.07]"
            loading="lazy"
            decoding="async"
            width={640}
            height={570}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted text-muted-foreground">
            <ImageIcon size={42} aria-hidden="true" />
            <span className="text-sm">تصویر ثبت نشده است</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-white/5 opacity-75 transition duration-500 group-hover:opacity-95" />

        {!mediaVerified && product.images[0]?.url && (
          <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur-lg">
            تصویر نمایشی
          </span>
        )}

        <div className="absolute right-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-col items-start gap-2">
          {discountPercent > 0 && (
            <span className="rounded-full bg-destructive px-3 py-1.5 text-xs font-black text-white shadow-xl">
              {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
            </span>
          )}
          {publicBadges
            .slice(0, discountPercent > 0 ? 1 : 2)
            .map((badge) => (
              <span
                key={badge}
                className="max-w-full truncate rounded-full border border-white/20 bg-white/75 px-3 py-1.5 text-[10px] font-black text-primary shadow-lg backdrop-blur-xl"
              >
                {badge}
              </span>
            ))}
        </div>

        <span className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 shadow-xl transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpLeft size={19} aria-hidden="true" />
        </span>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/72 backdrop-blur-md">
            <span className="rounded-full bg-destructive px-5 py-2 text-sm font-black text-white shadow-xl">
              ناموجود
            </span>
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
          <Link
            to={`/products?category=${encodeURIComponent(product.categorySlug)}`}
            className="inline-flex min-h-8 items-center rounded-full border border-primary/12 bg-primary/8 px-3 text-[10px] font-black uppercase tracking-[0.1em] text-primary transition hover:bg-primary/12"
          >
            {product.category}
          </Link>
          <span className="overflow-wrap-anywhere text-[10px] font-bold text-muted-foreground/65">
            #{product.productCode}
          </span>
        </div>

        <Link to={`/products/${encodeURIComponent(product.slug)}`} className="rounded-xl">
          <h2 className="line-clamp-2 text-xl font-black leading-8 text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted-foreground">
          {publicSummary}
        </p>

        <div className="mt-5 grid gap-2">
          <div
            className={`flex min-w-0 items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-[11px] font-bold backdrop-blur-md ${
              product.requiresCooling
                ? "border-sky-200 bg-sky-50/80 text-sky-900"
                : "border-primary/10 bg-primary/7 text-primary"
            }`}
          >
            <ShippingIcon size={15} className="shrink-0" aria-hidden="true" />
            <span className="line-clamp-2">{shippingLabel}</span>
          </div>
          <div
            className={`rounded-2xl border px-3.5 py-2.5 text-[11px] font-bold ${stockToneClasses[stockPresentation.tone]}`}
            aria-label={`وضعیت موجودی: ${stockPresentation.label}`}
          >
            {stockPresentation.label}
          </div>
        </div>

        <div className="my-5 h-px bg-gradient-to-l from-transparent via-border to-transparent" />

        <div className="mt-auto flex min-w-0 items-end justify-between gap-4">
          {displayPrice ? (
            <div className="min-w-0">
              {salePrice && regularPrice && (
                <p className="mb-1 text-[11px] text-muted-foreground line-through">
                  {formatToman(regularPrice)}
                </p>
              )}
              {hasVariants && priceRange.min !== priceRange.max && (
                <span className="mb-1 block text-[10px] font-bold text-muted-foreground">
                  شروع از
                </span>
              )}
              <p className="overflow-wrap-anywhere text-xl font-black leading-none text-primary sm:text-2xl">
                {formatToman(displayPrice).replace(" تومان", "")}
              </p>
              <span className="mt-1 block text-[10px] font-bold text-muted-foreground">
                تومان
              </span>
            </div>
          ) : (
            <div className="text-xs font-bold text-muted-foreground">
              قیمت با استعلام
            </div>
          )}

          {hasVariants ? (
            isOutOfStock ? (
              <span
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-muted px-5 text-sm font-black text-muted-foreground"
                aria-disabled="true"
              >
                ناموجود
              </span>
            ) : (
              <Link
                to={`/products/${encodeURIComponent(product.slug)}`}
                className="btn-primary inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-black"
              >
                انتخاب نوع
              </Link>
            )
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock || isCartAtStockLimit}
              className="btn-primary flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-black"
              aria-label={`افزودن ${product.name} به سبد خرید`}
            >
              <ShoppingCart size={16} aria-hidden="true" />
              {isOutOfStock
                ? "ناموجود"
                : isCartAtStockLimit
                  ? "حد موجودی"
                  : cartItem
                    ? "افزودن بیشتر"
                    : "افزودن"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
