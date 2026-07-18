import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Snowflake } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useCart, PACKAGING_FEE } from "@/context/CartContext";
import { formatToman } from "@/config/brand";

const CartPage = () => {
  const { items, updateQuantity, removeItem, subtotal, hasCoolingItems, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <SEO title="سبد خرید" noIndex />
      <section className="section-padding">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-right">سبد خرید</h1>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={64} />
              <h2 className="text-xl font-bold mb-2">سبد شما خالی است</h2>
              <p className="text-muted-foreground mb-6">
                هنوز محصولی به سبد اضافه نکرده‌اید.
              </p>
              <Link
                to="/products"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold"
              >
                مشاهده محصولات
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {hasCoolingItems && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-orange-900 flex items-start gap-3">
                    <Snowflake size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm leading-6">
                      سبد شما شامل محصولات یخچالی است. ارسال یخچالی فقط برای
                      تهران و کرج امکان‌پذیر است.
                    </p>
                  </div>
                )}

                {items.map((item) => {
                  const price = item.selectedVariant?.priceToman ?? item.priceToman;
                  return (
                    <div
                      key={`${item.id}-${item.selectedVariant?.id ?? ""}`}
                      className="bg-card border border-border rounded-2xl p-4 flex gap-4"
                    >
                      <Link
                        to={`/products/${item.slug}`}
                        className="w-24 h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="flex-1 flex flex-col text-right">
                        <div className="flex justify-between gap-2 items-start">
                          <Link
                            to={`/products/${item.slug}`}
                            className="font-bold hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id, item.selectedVariant?.id)}
                            className="text-destructive hover:opacity-70"
                            aria-label="حذف"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        {item.selectedVariant && (
                          <span className="text-xs text-muted-foreground mt-1">
                            {item.selectedVariant.name}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          کد: {item.productCode}
                        </span>
                        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                          <div className="inline-flex items-center gap-1 bg-secondary rounded-lg p-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1,
                                  item.selectedVariant?.id,
                                )
                              }
                              className="w-8 h-8 rounded-md bg-card flex items-center justify-center"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-8 text-center font-bold">
                              {item.quantity.toLocaleString("fa-IR")}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1,
                                  item.selectedVariant?.id,
                                )
                              }
                              className="w-8 h-8 rounded-md bg-card flex items-center justify-center"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-bold text-primary">
                            {formatToman(price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <aside className="lg:col-span-1">
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4 sticky top-24 text-right">
                  <h2 className="text-xl font-bold border-b border-border pb-3">
                    خلاصه سفارش
                  </h2>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">تعداد اقلام</span>
                    <span className="font-bold">{totalItems.toLocaleString("fa-IR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">جمع کل</span>
                    <span className="font-bold">{formatToman(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">هزینه بسته‌بندی</span>
                    <span className="font-bold">{formatToman(PACKAGING_FEE)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground bg-secondary/60 rounded-lg p-3">
                    هزینه ارسال بر اساس روش انتخابی در مرحله پرداخت محاسبه می‌شود.
                  </p>
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90"
                  >
                    ادامه و پرداخت
                  </button>
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
