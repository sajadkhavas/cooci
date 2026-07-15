import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag, Snowflake, Trash2, Truck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { formatToman, useCart } from "@/context/CartContext";

const CartPage = () => {
  const { items, itemCount, subtotal, hasCoolingItems, updateQuantity, removeItem } = useCart();

  return (
    <>
      <SEO
        title="سبد خرید"
        description="سبد خرید وینیمی بیکری؛ بررسی محصولات، تعداد، شرایط ارسال و ادامه به پرداخت آنلاین."
        noIndex
      />

      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
            <ShoppingBag size={18} />
            {itemCount.toLocaleString("fa-IR")} آیتم در سبد
          </span>
          <h1 className="heading-1 text-foreground">سبد خرید</h1>
          <p className="body-large text-muted-foreground mt-4 max-w-2xl mx-auto">
            قبل از پرداخت، تعداد محصولات و شرایط ارسال را بررسی کنید.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {items.length === 0 ? (
            <div className="max-w-xl mx-auto text-center bg-card border border-border rounded-3xl p-10 shadow-soft">
              <span className="text-6xl block mb-5">🛒</span>
              <h2 className="heading-2 text-foreground mb-3">سبد خرید خالی است</h2>
              <p className="text-muted-foreground leading-8 mb-6">
                محصولات وینیمی را ببینید و موارد دلخواه را به سبد خرید اضافه کنید.
              </p>
              <Link to="/products" className="btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2">
                مشاهده محصولات
                <ArrowLeft size={18} />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
              <div className="space-y-4">
                {items.map((item) => {
                  const ShippingIcon = item.requiresCooling ? Snowflake : Truck;
                  return (
                    <article key={item.id} className="bg-card border border-border rounded-3xl p-4 md:p-5 shadow-soft">
                      <div className="grid md:grid-cols-[120px_1fr_auto] gap-5 items-center">
                        <Link to={`/products/${item.productSlug}`} className="block aspect-square rounded-2xl overflow-hidden bg-secondary">
                          {item.image ? (
                            <img src={item.image} alt={item.imageAlt ?? item.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🍪</div>
                          )}
                        </Link>

                        <div className="space-y-3 text-right">
                          <div className="flex flex-wrap gap-2 justify-start">
                            <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs">{item.productCode}</span>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">{item.category}</span>
                          </div>
                          <Link to={`/products/${item.productSlug}`} className="block">
                            <h2 className="text-lg font-bold text-foreground hover:text-primary transition-colors">{item.name}</h2>
                          </Link>
                          {item.variantName && <p className="text-sm text-muted-foreground">نوع انتخابی: {item.variantName}</p>}
                          {item.weight && <p className="text-sm text-muted-foreground">واحد: {item.weight}</p>}
                          <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${item.requiresCooling ? "bg-sky-50 text-sky-800" : "bg-primary/10 text-primary"}`}>
                            <ShippingIcon size={15} />
                            {item.requiresCooling ? "ارسال یخچالی تهران و کرج" : "ارسال به سراسر ایران"}
                          </div>
                        </div>

                        <div className="space-y-4 md:text-left">
                          <p className="text-xl font-black text-primary">{formatToman(item.price * item.quantity)}</p>
                          <div className="inline-flex items-center gap-2 bg-secondary rounded-xl p-1">
                            <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-9 h-9 rounded-lg bg-card hover:bg-muted flex items-center justify-center transition-colors" aria-label="کم کردن تعداد">
                              <Minus size={16} />
                            </button>
                            <span className="min-w-8 text-center font-bold">{item.quantity.toLocaleString("fa-IR")}</span>
                            <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-9 h-9 rounded-lg bg-card hover:bg-muted flex items-center justify-center transition-colors" aria-label="زیاد کردن تعداد">
                              <Plus size={16} />
                            </button>
                          </div>
                          <button type="button" onClick={() => removeItem(item.id)} className="text-destructive text-sm font-semibold hover:underline flex items-center gap-1 md:mr-auto">
                            <Trash2 size={15} />
                            حذف
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="bg-card border border-border rounded-3xl p-6 shadow-hover lg:sticky lg:top-28 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">خلاصه سفارش</h2>
                  <p className="text-sm text-muted-foreground">هزینه ارسال در مرحله تکمیل سفارش و بر اساس روش ارسال محاسبه می‌شود.</p>
                </div>

                <div className="space-y-3 border-y border-border py-5">
                  <div className="flex items-center justify-between text-muted-foreground gap-4">
                    <span>جمع محصولات</span>
                    <span className="font-bold text-foreground">{formatToman(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground gap-4">
                    <span>هزینه ارسال</span>
                    <span>مرحله بعد</span>
                  </div>
                </div>

                {hasCoolingItems && (
                  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-900 text-sm leading-7">
                    سبد شما محصول یخچالی دارد؛ ارسال این سفارش فقط برای تهران، کرج و محدوده‌های قابل ارسال سرد فعال است.
                  </div>
                )}

                <Link to="/checkout" className="btn-primary w-full py-4 rounded-xl text-center font-bold block">
                  ادامه ثبت سفارش و پرداخت
                </Link>
                <Link to="/products" className="block text-center text-sm text-muted-foreground hover:text-primary">
                  افزودن محصول دیگر
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CartPage;
