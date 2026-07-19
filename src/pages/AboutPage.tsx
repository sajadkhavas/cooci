import {
  CheckCircle2,
  Database,
  Eye,
  ServerCog,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";
import galleryBakery from "@/assets/cookies/gallery-bakery-interior.jpg";

const principles = [
  {
    icon: Eye,
    title: "شفافیت قبل از تبلیغ",
    description:
      "آمار فروش، امتیاز مشتری، گواهی، موجودی و ویژگی محصول فقط زمانی قطعی نمایش داده می‌شوند که منبع قابل‌بررسی داشته باشند.",
  },
  {
    icon: Database,
    title: "داده واقعی از بک‌اند",
    description:
      "کاتالوگ داخلی برای تکمیل فرانت‌اند استفاده می‌شود؛ قیمت، موجودی، ترکیبات و سفارش نهایی باید از API معتبر دریافت شوند.",
  },
  {
    icon: ShieldCheck,
    title: "مرزبندی اطلاعات حساس",
    description:
      "اطلاعات پزشکی، آلرژن، مجوز و روش پرداخت با متن تبلیغاتی جایگزین نمی‌شوند و نیازمند تأیید جداگانه‌اند.",
  },
];

const workflow = [
  {
    title: "انتخاب از کاتالوگ",
    description:
      "کاربر محصول و گزینه فعلی را می‌بیند و موارد نیازمند تأیید با برچسب روشن مشخص می‌شوند.",
  },
  {
    title: "افزودن به سبد",
    description:
      "سبد در مرورگر حفظ می‌شود و پیش از Checkout دوباره با کاتالوگ همگام خواهد شد.",
  },
  {
    title: "تأیید سمت سرور",
    description:
      "بعد از اتصال بک‌اند، قیمت، موجودی، روش تحویل و مالکیت سفارش در Laravel دوباره بررسی می‌شوند.",
  },
  {
    title: "پرداخت و پیگیری",
    description:
      "پرداخت واقعی و وضعیت سفارش فقط از پاسخ تأییدشده سرور معتبر خواهند بود.",
  },
];

const AboutPage = () => (
  <>
    <SEO
      title="درباره وینیمی و وضعیت اطلاعات سایت"
      description="معرفی وینیمی بیکری و سیاست سایت برای تفکیک داده تأییدشده، محتوای کاتالوگ داخلی و اطلاعاتی که باید از بک‌اند دریافت شوند."
    />

    <section className="section-padding bg-secondary/50">
      <div className="container-custom max-w-4xl text-center">
        <h1 className="heading-1 mb-5 text-foreground">درباره وینیمی بیکری</h1>
        <p className="body-large mx-auto max-w-3xl leading-9 text-muted-foreground">
          وینیمی یک فروشگاه آنلاین در حال تکمیل است. فرانت‌اند مسیر کاتالوگ، سبد، Checkout و حساب کاربری را فراهم می‌کند و مرحله بعد اتصال آن به بک‌اند واقعی پروژه است.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-custom">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <ServerCog size={17} aria-hidden="true" />
              وضعیت فعلی پروژه
            </span>
            <h2 className="heading-2 text-foreground">
              فرانت‌اند کامل، داده نهایی وابسته به بک‌اند
            </h2>
            <div className="space-y-4 leading-8 text-muted-foreground">
              <p>
                صفحات فروشگاه، فیلتر محصولات، جزئیات محصول، سبد خرید، فرم ارسال، پرداخت و حساب کاربری طراحی شده‌اند. این بخش‌ها از نظر تجربه کاربری آماده اتصال به API هستند.
              </p>
              <p>
                بخشی از اطلاعات فعلی از کاتالوگ داخلی فرانت‌اند می‌آید. این داده‌ها برای توسعه رابط استفاده می‌شوند و نباید جایگزین موجودی، ترکیبات، مجوز یا وضعیت سفارش در سرور شوند.
              </p>
              <p>
                در مرحله اتصال به <strong>Winimi-bakery-backend</strong>، منبع اصلی حقیقت برای محصول، مشتری، سفارش و پرداخت به بک‌اند منتقل خواهد شد.
              </p>
            </div>
          </div>

          <figure className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <img
              src={galleryBakery}
              alt="تصویر نمایشی فضای یک کارگاه شیرینی‌پزی"
              className="aspect-square h-full w-full object-cover"
              width={900}
              height={900}
            />
            <figcaption className="border-t border-border px-4 py-3 text-center text-xs leading-6 text-muted-foreground">
              تصویر نمایشی است و به‌عنوان عکس تأییدشده محل فعالیت وینیمی منتشر نشده است.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="section-padding bg-secondary/40">
      <div className="container-custom">
        <div className="mb-12 text-center">
          <h2 className="heading-2 mb-4 text-foreground">اصول انتشار محتوا</h2>
          <p className="mx-auto max-w-2xl leading-8 text-muted-foreground">
            کامل‌بودن ظاهر سایت نباید با ساختن اطلاعات غیرواقعی اشتباه گرفته شود.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="rounded-3xl border border-border bg-card p-7 text-center shadow-soft"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <principle.icon size={27} aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">
                {principle.title}
              </h3>
              <p className="leading-8 text-muted-foreground">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-custom">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <figure className="order-2 overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:order-1">
            <img
              src={galleryBaking}
              alt="تصویر نمایشی آماده‌سازی شیرینی"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
              width={900}
              height={675}
            />
            <figcaption className="border-t border-border px-4 py-3 text-center text-xs leading-6 text-muted-foreground">
              تصویر صرفاً برای نمایش موضوع فرآیند آماده‌سازی استفاده شده است.
            </figcaption>
          </figure>

          <div className="order-1 lg:order-2">
            <h2 className="heading-2 mb-7 text-foreground">
              مسیر سفارش پس از اتصال کامل
            </h2>
            <ol className="space-y-5">
              {workflow.map((step, index) => (
                <li key={step.title} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-black text-primary-foreground">
                    {(index + 1).toLocaleString("fa-IR")}
                  </span>
                  <div>
                    <h3 className="font-bold text-foreground">{step.title}</h3>
                    <p className="mt-1 leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container-custom text-center">
        <ShoppingCart
          className="mx-auto mb-4"
          size={38}
          aria-hidden="true"
        />
        <h2 className="heading-2 mb-4">
          فرانت‌اند را از مسیر واقعی کاربر بررسی کنید
        </h2>
        <p className="body-large mx-auto mb-8 max-w-2xl opacity-90">
          محصول را انتخاب کنید، سبد را بسازید و تا مرحله Checkout پیش بروید. پرداخت و ورود واقعی تا اتصال امن بک‌اند غیرفعال باقی می‌مانند.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/products"
            className="rounded-xl bg-gold px-8 py-4 text-lg font-black text-primary transition hover:bg-gold/90"
          >
            مشاهده محصولات
          </Link>
          <Link
            to="/quality"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-foreground/30 px-8 py-4 text-lg font-bold transition hover:bg-primary-foreground/10"
          >
            <CheckCircle2 size={20} aria-hidden="true" />
            سیاست شفافیت
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default AboutPage;
