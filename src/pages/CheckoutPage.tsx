import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Lock, PackageCheck, ShoppingBag, Snowflake, Truck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { formatToman, useCart } from "@/context/CartContext";
import {
  createLocalOrder,
  deliveryMethods,
  getRecommendedDeliveryMethod,
  isCoolingDeliveryCity,
  isValidIranMobile,
  type CheckoutCustomer,
  type DeliveryMethod,
} from "@/lib/orders";

const initialCustomer: CheckoutCustomer = {
  fullName: "",
  phone: "",
  city: "",
  address: "",
  notes: "",
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, itemCount, hasCoolingItems, clearCart } = useCart();
  const [customer, setCustomer] = useState<CheckoutCustomer>(initialCustomer);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [error, setError] = useState("");

  const canDeliverCooling = useMemo(
    () => !hasCoolingItems || isCoolingDeliveryCity(customer.city),
    [customer.city, hasCoolingItems],
  );

  const availableDeliveryMethods = useMemo(() => {
    const entries = Object.entries(deliveryMethods) as Array<[DeliveryMethod, (typeof deliveryMethods)[DeliveryMethod]]>;
    if (hasCoolingItems) return entries.filter(([method]) => method === "chilled" || method === "pickup");
    return entries.filter(([method]) => method !== "chilled");
  }, [hasCoolingItems]);

  const deliveryFee = deliveryMethods[deliveryMethod].fee;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    const recommended = getRecommendedDeliveryMethod({ hasCoolingItems, city: customer.city });
    if (availableDeliveryMethods.some(([method]) => method === recommended)) {
      setDeliveryMethod(recommended);
    }
  }, [availableDeliveryMethods, customer.city, hasCoolingItems]);

  const updateField = (field: keyof CheckoutCustomer, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!items.length) {
      setError("سبد خرید شما خالی است.");
      return;
    }

    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.city.trim() || !customer.address.trim()) {
      setError("نام، شماره تماس، شهر و آدرس را کامل وارد کنید.");
      return;
    }

    if (!isValidIranMobile(customer.phone)) {
      setError("شماره موبایل را با فرمت درست وارد کنید؛ مثال: 09123456789");
      return;
    }

    if (hasCoolingItems && deliveryMethod === "chilled" && !canDeliverCooling) {
      setError("در این سبد محصول یخچالی وجود دارد و ارسال یخچالی فعلاً فقط برای تهران، کرج و اندیشه قابل ثبت است.");
      return;
    }

    const order = createLocalOrder({ customer, items, subtotal, deliveryMethod });
    clearCart();
    navigate(`/payment/callback?order=${encodeURIComponent(order.id)}&status=paid`);
  };

  if (!items.length) {
    return (
      <>
        <SEO title="تکمیل سفارش" description="تکمیل سفارش وینیمی بیکری" noIndex />
        <section className="section-padding">
          <div className="container-custom max-w-xl text-center bg-card border border-border rounded-3xl p-10 shadow-soft">
            <span className="text-6xl block mb-5">🛒</span>
            <h1 className="heading-2 text-foreground mb-4">سبد خرید خالی است</h1>
            <p className="text-muted-foreground mb-6">برای تکمیل سفارش ابتدا محصولی به سبد خرید اضافه کنید.</p>
            <Link to="/products" className="btn-primary px-8 py-3 rounded-xl inline-block">
              مشاهده محصولات
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title="تکمیل سفارش"
        description="ثبت اطلاعات ارسال، محاسبه هزینه ارسال و آماده‌سازی سفارش برای اتصال به درگاه پرداخت وینیمی بیکری."
        noIndex
      />

      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
            <CreditCard size={18} />
            پرداخت آنلاین آماده اتصال به درگاه
          </span>
          <h1 className="heading-1 text-foreground">تکمیل سفارش</h1>
          <p className="body-large text-muted-foreground mt-4 max-w-2xl mx-auto">
            اطلاعات ارسال، روش تحویل و خلاصه پرداخت را بررسی کنید. بعد از دریافت درگاه، همین مسیر به پرداخت بانکی واقعی وصل می‌شود.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-soft space-y-7">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">اطلاعات گیرنده</h2>
              <p className="text-muted-foreground text-sm">این اطلاعات برای ثبت سفارش، ارسال و پیگیری پرداخت استفاده می‌شود.</p>
            </div>

            {error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive p-4 text-sm font-semibold">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <label className="space-y-2">
                <span className="text-sm font-bold text-foreground">نام و نام خانوادگی</span>
                <input
                  className="input-field w-full"
                  value={customer.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  placeholder="مثلاً سجاد خواص"
                  autoComplete="name"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-foreground">شماره موبایل</span>
                <input
                  className="input-field w-full ltr:text-left"
                  value={customer.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="09xxxxxxxxx"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-foreground">شهر</span>
                <input
                  className="input-field w-full"
                  value={customer.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="تهران، کرج، اصفهان..."
                  autoComplete="address-level2"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-bold text-foreground">آدرس کامل</span>
                <textarea
                  className="input-field w-full min-h-28 resize-none"
                  value={customer.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  placeholder="آدرس، پلاک، واحد و توضیحات لازم برای ارسال"
                  autoComplete="street-address"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-bold text-foreground">توضیحات سفارش</span>
                <textarea
                  className="input-field w-full min-h-24 resize-none"
                  value={customer.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="زمان پیشنهادی تحویل، توضیح بسته‌بندی، پیام هدیه و..."
                />
              </label>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">روش ارسال</h2>
              <div className="grid gap-3">
                {availableDeliveryMethods.map(([method, option]) => {
                  const Icon = method === "chilled" ? Snowflake : method === "pickup" ? PackageCheck : Truck;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setDeliveryMethod(method)}
                      className={`text-right rounded-2xl border p-4 transition-all ${
                        deliveryMethod === method
                          ? "border-primary bg-primary/10 shadow-soft"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-bold text-foreground">{option.label}</h3>
                            <span className="text-primary font-black">{option.fee ? formatToman(option.fee) : "رایگان"}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-7 mt-1">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {hasCoolingItems && (
              <div className={`rounded-2xl border p-4 text-sm leading-7 ${canDeliverCooling ? "border-sky-200 bg-sky-50 text-sky-900" : "border-destructive/20 bg-destructive/10 text-destructive"}`}>
                <div className="flex items-start gap-3">
                  <Snowflake size={20} className="mt-1 flex-shrink-0" />
                  <p>
                    این سفارش محصول یخچالی دارد. ارسال یخچالی فقط برای تهران، کرج و اندیشه فعال است؛ برای شهرهای دیگر باید محصول یخچالی از سبد حذف شود یا تحویل حضوری انتخاب شود.
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm leading-7 text-primary">
              <div className="flex items-start gap-3">
                <Lock size={19} className="mt-1 flex-shrink-0" />
                <p>
                  پرداخت آنلاین به‌صورت آماده اتصال پیاده‌سازی شده است. بعد از گرفتن درگاه، همین جریان به API پرداخت و callback واقعی وصل می‌شود.
                </p>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2">
              ثبت سفارش و ورود به پرداخت
              <CreditCard size={21} />
            </button>
          </form>

          <aside className="bg-card border border-border rounded-3xl p-6 shadow-hover lg:sticky lg:top-28 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">خلاصه پرداخت</h2>
              <p className="text-sm text-muted-foreground">{itemCount.toLocaleString("fa-IR")} آیتم در سفارش</p>
            </div>

            <div className="space-y-4 max-h-80 overflow-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b border-border pb-3 last:border-b-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                    {item.image ? <img src={item.image} alt={item.imageAlt ?? item.name} className="w-full h-full object-cover" loading="lazy" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-foreground line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.variantName ?? item.weight}</p>
                    <p className="text-xs text-muted-foreground">تعداد: {item.quantity.toLocaleString("fa-IR")}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{formatToman(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border pt-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>جمع محصولات</span>
                <span className="font-bold text-foreground">{formatToman(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>ارسال</span>
                <span className="font-bold text-foreground">{deliveryFee ? formatToman(deliveryFee) : "رایگان"}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-black text-foreground pt-3 border-t border-border">
                <span>مبلغ قابل پرداخت</span>
                <span>{formatToman(total)}</span>
              </div>
            </div>

            <Link to="/cart" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ShoppingBag size={16} />
              بازگشت به سبد خرید
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;
