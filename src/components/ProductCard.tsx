import {
  ArrowUpLeft,
  Eye,
  ImageIcon,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { OptimizedImage } from "@/components/media/OptimizedImage";
import productRailBackground from "@/assets/product-rail-background.webp";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  variant?: "default" | "featured" | "rail";
}

const stockToneClasses = {
  danger: "border-destructive/20 bg-destructive/8 text-destructive",
  warning: "border-amber-300/70 bg-amber-50/80 text-amber-950",
  success: "border-emerald-300/70 bg-emerald-50/80 text-emerald-900",
};

export const ProductCard = ({
  product,
  variant = "default",
}: ProductCardProps) => {
  const { addItem, items } = useCart();
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
  const isRail = variant === "rail";

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
    <article
      className={`group relative h-full min-w-0 overflow-hidden border border-border/65 bg-card/90 shadow-card backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#d88972]/55 hover:shadow-hover focus-within:border-[#d88972]/70 focus-within:shadow-hover ${
        isRail ? "rounded-[1.35rem]" : "rounded-[2rem]"
      } ${
        variant === "featured"
          ? "md:grid md:grid-cols-[1.2fr_0.8fr]"
          : "flex flex-col"
      }`}
    >
      <Link
        to={`/products/${encodeURIComponent(product.slug)}`}
        className={`relative isolate block overflow-hidden bg-gradient-to-br from-card via-secondary/70 to-muted ${
          variant === "featured"
            ? "aspect-[4/3] md:min-h-[31rem] md:aspect-auto"
            : isRail
              ? "aspect-[5/4]"
              : "aspect-[4/3]"
        }`}
        aria-label={`مشاهده جزئیات ${product.name}`}
      >
        {product.images[0]?.url ? (
          <OptimizedImage
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="relative z-[1] h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
            loading="lazy"
            fetchPriority="low"
            sizes={
              variant === "featured"
                ? "(min-width: 768px) 60vw, 100vw"
                : "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            }
            width={900}
            height={675}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted text-muted-foreground">
            <ImageIcon size={42} aria-hidden="true" />
            <span className="text-sm">تصویر ثبت نشده است</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-primary/45 via-transparent to-white/10 opacity-70 transition duration-500 group-hover:opacity-90" />

        {!mediaVerified && product.images[0]?.url && (
          <span className="absolute bottom-3 left-3 z-20 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur-lg">
            تصویر نمایشی
          </span>
        )}

        <div className="absolute right-3 top-3 z-20 flex max-w-[calc(100%-1.5rem)] flex-col items-start gap-2">
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

        <span className="absolute bottom-4 right-4 z-20 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 shadow-xl transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpLeft size={19} aria-hidden="true" />
        </span>

        {isOutOfStock && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/72 backdrop-blur-md">
            <span className="rounded-full bg-destructive px-5 py-2 text-sm font-black text-white shadow-xl">
              ناموجود
            </span>
          </div>
        )}
      </Link>

      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="absolute left-3 top-3 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-white/88 text-primary opacity-100 shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#91b33f] sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            aria-label={`پیش‌نمایش سریع ${product.name}`}
          >
            <Eye size={18} aria-hidden="true" />
          </button>
        </DialogTrigger>
        <DialogContent
          dir="rtl"
          className="max-h-[90vh] overflow-y-auto border-[#b8c98d]/45 bg-[#fffdf7] p-0 text-[#263b12] shadow-[0_32px_90px_-28px_rgba(28,45,12,0.55)] [&>button]:left-3 [&>button]:right-auto [&>button]:top-3 [&>button]:z-30 [&>button]:rounded-full [&>button]:bg-white/90 [&>button]:p-2 [&>button]:text-[#496a16] [&>button]:opacity-100 sm:max-w-4xl"
        >
          <div className="grid md:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-72 overflow-hidden bg-secondary md:min-h-[31rem]">
              {product.images[0]?.url ? (
                <OptimizedImage
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  sizes="(min-width: 768px) 40vw, 100vw"
                  width={900}
                  height={900}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <ImageIcon size={48} aria-hidden="true" />
                </div>
              )}
            </div>

            <div
              className="relative flex flex-col overflow-hidden p-6 sm:p-8"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 253, 247, 0.88), rgba(255, 253, 247, 0.92)), url(${productRailBackground})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <div className="relative z-10 flex h-full flex-col">
                <span className="mb-3 text-xs font-black text-[#9b5545]">
                  {product.category}
                </span>
                <DialogTitle className="text-2xl font-black leading-9 text-[#263b12] sm:text-3xl">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="mt-3 text-sm leading-7 text-[#5f6d4c]">
                  {publicSummary}
                </DialogDescription>

                <div
                  className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-bold ${stockToneClasses[stockPresentation.tone]}`}
                >
                  {stockPresentation.label}
                </div>

                <div className="mt-6">
                  {displayPrice ? (
                    <>
                      {salePrice && regularPrice && (
                        <p className="text-sm text-[#7d866e] line-through">
                          {formatToman(regularPrice)}
                        </p>
                      )}
                      <p className="mt-1 text-2xl font-black text-[#496a16]">
                        {formatToman(displayPrice)}
                      </p>
                    </>
                  ) : (
                    <p className="font-bold text-[#687456]">قیمت با استعلام</p>
                  )}
                </div>

                <div className="mt-auto grid gap-3 pt-7 sm:grid-cols-2">
                  <DialogClose asChild>
                    <Link
                      to={`/products/${encodeURIComponent(product.slug)}`}
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#496a16]/25 bg-white/55 px-5 text-sm font-black text-[#31520f] transition hover:bg-[#d0e596]/45"
                    >
                      مشاهده جزئیات
                    </Link>
                  </DialogClose>

                  {hasVariants ? (
                    <DialogClose asChild>
                      <Link
                        to={`/products/${encodeURIComponent(product.slug)}`}
                        className="btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-black"
                      >
                        انتخاب نوع
                      </Link>
                    </DialogClose>
                  ) : (
                    <DialogClose asChild>
                      <button
                        type="button"
                        onClick={handleAdd}
                        disabled={isOutOfStock || isCartAtStockLimit || !displayPrice}
                        className="btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ShoppingCart size={17} aria-hidden="true" />
                        {isOutOfStock
                          ? "ناموجود"
                          : isCartAtStockLimit
                            ? "حد موجودی"
                            : "افزودن به سبد"}
                      </button>
                    </DialogClose>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div
        className={`flex min-w-0 flex-1 flex-col ${
          isRail ? "p-4" : "p-5 sm:p-6"
        } ${
          variant === "featured" ? "md:justify-center md:p-9 lg:p-12" : ""
        }`}
      >
        <div className={`${isRail ? "mb-2" : "mb-4"} flex min-w-0 items-center justify-between gap-3`}>
          <Link
            to={`/products/category/${encodeURIComponent(product.categorySlug)}`}
            className="inline-flex min-h-8 items-center rounded-full border border-primary/12 bg-primary/8 px-3 text-[10px] font-black uppercase tracking-[0.1em] text-primary transition hover:bg-primary/12"
          >
            {product.category}
          </Link>
          <span className="overflow-wrap-anywhere text-[10px] font-bold text-muted-foreground/65">
            #{product.productCode}
          </span>
        </div>

        <Link to={`/products/${encodeURIComponent(product.slug)}`} className="rounded-xl">
          <h2
            className={`line-clamp-2 font-black text-foreground transition-colors group-hover:text-[#9b5545] ${
              variant === "featured"
                ? "text-3xl leading-[1.35] lg:text-4xl"
                : isRail
                  ? "text-lg leading-7"
                  : "text-xl leading-8"
            }`}
          >
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted-foreground">
          {publicSummary}
        </p>

        <div className={`${isRail ? "mt-3" : "mt-5"} grid gap-2`}>
          <div
            className={`rounded-xl border px-3 py-2 text-[11px] font-bold ${stockToneClasses[stockPresentation.tone]}`}
            aria-label={`وضعیت موجودی: ${stockPresentation.label}`}
          >
            {stockPresentation.label}
          </div>
        </div>

        <div className={`${isRail ? "my-3" : "my-5"} h-px bg-gradient-to-l from-transparent via-border to-transparent`} />

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
