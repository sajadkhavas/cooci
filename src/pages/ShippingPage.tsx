import {
  CreditCard,
  MapPin,
  PackageCheck,
  ShoppingCart,
  Snowflake,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";

const shippingRules = [
  {
    icon: Truck,
    title: "ارسال محصولات خشک",
    description:
      "کوکی‌ها، مینی کوکی‌ها و باکس‌های هدیه با بسته‌بندی محافظ قابل ارسال به شهرهای تحت پوشش هستند. زمان تحویل به مقصد و روش حمل بستگی دارد.",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: Snowflake,
    title: "ارسال محصولات یخچالی",
    description:
      "کیک‌ها، چیزکیک‌ها، تیرامیسو و دسرهای سرد فقط با روش یخچالی و در محدوده فعال تهران و کرج قابل ثبت‌اند. Checkout روش ناسازگار را نمی‌پذیرد.",
    tone: "bg-sky-50 text-sky-800",
  },
  {
    icon: PackageCheck,
    title: "زمان آماده‌سازی",
    description: `زمان معمول آماده‌سازی ${brandConfig.preparationTime} است، اما زمان دقیق هر محصول و سفارش تعداد بالا باید پیش از پرداخت یا بعد از ثبت معتبر سفارش تأیید شود.`,
    tone: "bg-amber-50 text-amber-800",
  },
  {
    icon: CreditCard,
    title: "هزینه ارسال",
    description:
      "برآورد هزینه ارسال در سبد و Checkout براساس روش انتخابی نمایش داده می‌شود. مبلغ نهایی باید همراه با قیمت و موجودی سفارش توسط بک‌اند تأیید شود.",
    tone: "bg-emerald-50 text-emerald-800",
  },
];

const ShippingPage = () => (
  <>
    <SEO
      title="شرایط ارسال"
      description="قوانین ارسال وینیمی؛ ارسال محصولات خشک، ارسال یخچالی تهران و کرج، تحویل حضوری، هزینه و زمان آماده‌سازی."
    />

    <section className="section-padding bg-gradient-to-b from-secondary/20 to-background">
      <div className="container-custom max-w-5xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="heading-1 mb-6 text-foreground">شرایط ارسال و تحویل</h1>
          <p className="body-large leading-9 text-muted-foreground">
            نوع محصول، شهر مقصد و روش تحویل تعیین می‌کنند سفارش چگونه قابل ارسال است. اطلاعات نهایی پیش از پرداخت نمایش داده می‌شود.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {shippingRules.map((rule) => (
            <article
              key={rule.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${rule.tone}`}
              >
                <rule.icon size={24} aria-hidden="true" />
              </div>
              <h2 className="heading-3 mb-3 text-foreground">{rule.title}</h2>
              <p className="leading-8 text-muted-foreground">{rule.description}</p>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-3xl border border-primary/20 bg-primary/10 p-6" aria-labelledby="pickup-title">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MapPin size={21} aria-hidden="true" />
            </div>
            <div>
              <h2 id="pickup-title" className="mb-2 font-black text-foreground">
                تحویل حضوری
              </h2>
              <p className="leading-8 text-muted-foreground">
                محل فعالیت وینیمی {brandConfig.address} است. در صورت فعال‌بودن تحویل حضوری، این روش را در Checkout انتخاب کنید؛ زمان و جزئیات تحویل بعد از ثبت سفارش معتبر هماهنگ می‌شود.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/products"
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-bold"
          >
            مشاهده محصولات
          </Link>
          <Link
            to="/cart"
            className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl border border-border px-8 py-4 font-bold"
          >
            <ShoppingCart size={19} aria-hidden="true" />
            بررسی سبد خرید
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default ShippingPage;
