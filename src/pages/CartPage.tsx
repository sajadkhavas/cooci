import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Snowflake,
  Trash2,
  Truck,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckoutSteps } from "@/components/cart/CheckoutSteps";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import { useCartCatalogReconciliation } from "@/hooks/useCartCatalogReconciliation";
import {
  getCartItemStock,
  getCartRegularUnitPrice,
  getCartUnitPrice,
} from "@/lib/cart";

const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    syncWithCatalog,
    subtotal,
    regularSubtotal,
    savings,
    packagingFee,
    estimatedDeliveryFee,
    estimatedTotal,
    hasCoolingItems,
    hasUnavailableItems,
    hasStockIssues,
    isReadyForCheckout,
    totalItems,
    uniqueItems,
  } = useCart();
  const navigate = useNavigate();
  const {
    isLoading: cartCatalogLoading,
    isReconciled: cartCatalogReconciled,
    error: cartCatalogError,
    refetch: refetchCartCatalog,
  } = useCartCatalogReconciliation(items, syncWithCatalog);

  const handleRemove = (id: string, variantId: string | undefined, name: string) => {
    removeItem(id, variantId);
    toast.success(`${name} از سبد حذف شد`);
  };

  const handleClear = () => {
    const shouldClear = window.confirm("همه محصولات از سبد خرید حذف شوند؟");
    if (!shouldClear) return;

    clearCart();
    toast.success("سبد خرید خالی شد");
  };

  const handleCheckout = () => {
    if (cartCatalogLoading || !cartCatalogReconciled || cartCatalogError) {
      toast.error("ابتدا تطبیق سبد با کاتالوگ سرور را کامل کنید");
      return;
    }
    if (!isReadyForCheckout) {
      toast.error("ابتدا مشکلات موجودی یا محصولات نامعتبر سبد را برطرف کنید");
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <SEO title="سبد خرید" noIndex />
      <section className="section-padding bg-gradient-to-b from-secondary/20 to-background">
        <div className="container-custom">
          <CheckoutSteps current="cart" />

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">سبد خرید</h1>
              {items.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {uniqueItems.toLocaleString("fa-IR")} محصول متفاوت، مجموعاً {totalItems.toLocaleString("fa-IR")} عدد
                </p>
              )}
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-destructive/30 px-4 py-2 text-sm font-bold text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 size={16} aria-hidden="true" />
                خالی کردن سبد
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card px-6 py-16 text-center shadow-soft">
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag className="text-primary" size={48} aria-hidden="true" />
              </div>
              <h2 className="heading-2 mb-3 text-foreground">سبد شما خالی است</h2>
              <p className="mx-auto mb-8 max-w-lg leading-8 text-muted-foreground">
                محصولات دلخواه‌تان را از کاتالوگ انتخاب کنید و برای ثبت سفارش به این صفحه برگردید.
              </p>
              <Link
                to="/products"
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3"
              >
                مشاهده محصولات
                <ArrowLeft size={18} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {cartCatalogLoading && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary" role="status">
                    در حال تطبیق تک‌تک محصولات سبد با کاتالوگ سرور…
                  </div>
                )}

                {cartCatalogError && (
                  <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-destructive" role="alert">
                    <p className="font-bold">به‌روزرسانی سبد ناموفق بود</p>
                    <p className="mt-1 text-sm leading-7">{cartCatalogError.message}</p>
                    <button
                      type="button"
                      onClick={() => void refetchCartCatalog()}
                      className="mt-3 rounded-xl border border-destructive/30 px-4 py-2 text-sm font-bold"
                    >
                      تلاش دوباره
                    </button>
                  </div>
                )}

                {hasCoolingItems && (
                  <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-900">
                    <Snowflake size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <p className="text-sm leading-7">
                      سبد شما شامل محصول یخچالی است؛ ارسال سرد فقط برای تهران، کرج و اندیشه امکان‌پذیر خواهد بود.
                    </p>
                  </div>
                )}

                {(hasUnavailableItems || hasStockIssues) && (
                  <div className="flex items-start gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-destructive" role="alert">
                    <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-bold">سبد نیاز به اصلاح دارد</p>
                      <p className="mt-1 text-sm leading-7">
                        محصول ناموجود را حذف کنید یا تعداد اقلامی که بیشتر از موجودی هستند کاهش دهید.
                      </p>
                    </div>
                  </div>
                )}

                {items.map((item) => {
                  const unitPrice = getCartUnitPrice(item);
                  const regularUnitPrice = getCartRegularUnitPrice(item);
                  const stock = getCartItemStock(item);
                  const isUnavailable = item.availability !== "available" || stock <= 0;
                  const hasQuantityIssue = stock > 0 && item.quantity > stock;
                  const isAtStockLimit = item.quantity >= stock && stock > 0;
                  const variantId = item.selectedVariant?.id;

                  return (
                    <article
                      key={`${item.id}-${variantId ?? ""}`}
                      className={`rounded-3xl border bg-card p-4 shadow-soft transition-colors md:p-5 ${
                        isUnavailable || hasQuantityIssue
                          ? "border-destructive/35"
                          : "border-border"
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <Link
                          to={`/products/${item.slug}`}
                          className="aspect-square w-full overflow-hidden rounded-2xl bg-secondary sm:h-32 sm:w-32 sm:shrink-0"
                          aria-label={`مشاهده ${item.name}`}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              width={256}
                              height={256}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-5xl" aria-hidden="true">
                              🍪
                            </div>
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col text-right">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                to={`/products/${item.slug}`}
                                className="line-clamp-2 text-lg font-bold text-foreground transition-colors hover:text-primary"
                              >
                                {item.name}
                              </Link>
                              {item.selectedVariant && (
                                <span className="mt-1 block text-sm font-medium text-primary">
                                  {item.selectedVariant.name}
                                </span>
                              )}
                              <span className="mt-1 block text-xs text-muted-foreground">
                                کد: {item.productCode}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemove(item.id, variantId, item.name)}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10"
                              aria-label={`حذف ${item.name}`}
                            >
                              <Trash2 size={18} aria-hidden="true" />
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {isUnavailable ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">
                                <XCircle size={14} aria-hidden="true" />
                                {item.availability === "unavailable" ? "دیگر قابل سفارش نیست" : "ناموجود"}
                              </span>
                            ) : hasQuantityIssue ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                                <AlertTriangle size={14} aria-hidden="true" />
                                موجودی فعلی: {stock.toLocaleString("fa-IR")} عدد
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                                <CheckCircle2 size={14} aria-hidden="true" />
                                موجود
                              </span>
                            )}

                            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                              {item.requiresCooling ? (
                                <Snowflake size={14} aria-hidden="true" />
                              ) : (
                                <Truck size={14} aria-hidden="true" />
                              )}
                              {item.requiresCooling ? "ارسال یخچالی" : "ارسال سراسری"}
                            </span>
                          </div>

                          <div className="mt-5 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="inline-flex w-fit items-center gap-1 rounded-xl bg-secondary p-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1, variantId)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-card transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                disabled={item.quantity <= 1 || isUnavailable}
                                aria-label="کم کردن تعداد"
                              >
                                <Minus size={15} aria-hidden="true" />
                              </button>
                              <span className="min-w-10 text-center font-black">
                                {item.quantity.toLocaleString("fa-IR")}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1, variantId)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-card transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                disabled={isUnavailable || isAtStockLimit || hasQuantityIssue}
                                aria-label="زیاد کردن تعداد"
                              >
                                <Plus size={15} aria-hidden="true" />
                              </button>
                            </div>

                            {hasQuantityIssue && (
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, stock, variantId)}
                                className="text-sm font-bold text-amber-800 hover:underline"
                              >
                                تنظیم روی موجودی فعلی
                              </button>
                            )}

                            <div className="text-left sm:mr-auto">
                              {regularUnitPrice > unitPrice && (
                                <p className="text-xs text-muted-foreground line-through">
                                  {formatToman(regularUnitPrice * item.quantity)}
                                </p>
                              )}
                              <p className="font-black text-primary">
                                {formatToman(unitPrice * item.quantity)}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                هر عدد {formatToman(unitPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  ادامه خرید
                  <ArrowLeft size={17} aria-hidden="true" />
                </Link>
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-5 rounded-3xl border border-border bg-card p-6 text-right shadow-card">
                  <h2 className="border-b border-border pb-4 text-xl font-bold text-foreground">
                    خلاصه سفارش
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">جمع قیمت محصولات</span>
                      <span className="font-bold">{formatToman(regularSubtotal)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between gap-3 text-emerald-700">
                        <span>سود شما از تخفیف</span>
                        <span className="font-black">− {formatToman(savings)}</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">مبلغ محصولات</span>
                      <span className="font-bold">{formatToman(subtotal)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">بسته‌بندی محافظ</span>
                      <span className="font-bold">{formatToman(packagingFee)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">برآورد هزینه ارسال</span>
                      <span className="font-bold">{formatToman(estimatedDeliveryFee)}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-secondary/70 p-4 text-xs leading-7 text-muted-foreground">
                    هزینه نهایی ارسال با توجه به شهر و روش انتخابی در مرحله بعد مشخص می‌شود. تحویل حضوری رایگان است.
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                    <span className="font-bold text-foreground">مبلغ برآوردی</span>
                    <span className="text-xl font-black text-primary">{formatToman(estimatedTotal)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={
                      !isReadyForCheckout ||
                      cartCatalogLoading ||
                      !cartCatalogReconciled ||
                      Boolean(cartCatalogError)
                    }
                    className="w-full rounded-xl bg-primary py-3.5 font-bold text-primary-foreground shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                  >
                    ادامه و ثبت اطلاعات ارسال
                  </button>

                  {(!isReadyForCheckout ||
                    cartCatalogLoading ||
                    !cartCatalogReconciled ||
                    cartCatalogError) && (
                    <p className="text-center text-xs leading-6 text-destructive">
                      برای ادامه، قیمت و موجودی همه محصولات باید با کاتالوگ سرور تطبیق داده شود.
                    </p>
                  )}

                  <div className="grid gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={17} className="text-primary" aria-hidden="true" />
                      بررسی دوباره قیمت و موجودی قبل از پرداخت
                    </div>
                    <div className="flex items-center gap-2">
                      <PackageCheck size={17} className="text-primary" aria-hidden="true" />
                      بسته‌بندی محافظ متناسب با نوع محصول
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CartPage;
