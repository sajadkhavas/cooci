import {
  Clock,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { brandConfig, generatePhoneUrl } from "@/config/brand";

const ContactPage = () => (
  <>
    <SEO
      title="تماس با ما"
      description="راه‌های ارتباط با وینیمی بیکری؛ تلفن، اینستاگرام، آدرس، ایمیل و ساعات کاری."
    />

    <section className="bg-secondary/50 py-10 sm:py-12">
      <div className="container-custom text-center">
        <h1 className="heading-1 text-foreground">تماس با ما</h1>
        <p className="body-large mx-auto mt-4 max-w-2xl text-muted-foreground">
          برای پشتیبانی، همکاری، سفارش سازمانی یا پیگیری سفارش از مسیرهای رسمی زیر استفاده کنید.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-custom max-w-4xl">
        <div className="grid min-w-0 gap-8 md:grid-cols-2">
          <div className="min-w-0 space-y-4 sm:space-y-6">
            <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <Phone className="shrink-0 text-primary" size={24} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="font-semibold">تلفن</h2>
                <a
                  href={generatePhoneUrl()}
                  className="touch-target inline-flex items-center overflow-wrap-anywhere font-medium text-primary hover:underline"
                  dir="ltr"
                >
                  {brandConfig.phone}
                </a>
              </div>
            </article>

            <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <Mail className="shrink-0 text-primary" size={24} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="font-semibold">ایمیل</h2>
                <a
                  href={`mailto:${brandConfig.email}`}
                  className="touch-target inline-flex items-center overflow-wrap-anywhere font-medium text-primary hover:underline"
                  dir="ltr"
                >
                  {brandConfig.email}
                </a>
              </div>
            </article>

            <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <MapPin className="shrink-0 text-primary" size={24} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="font-semibold">آدرس</h2>
                <p className="mt-1 leading-7 text-muted-foreground">
                  {brandConfig.address}
                </p>
                <a
                  href={brandConfig.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target mt-1 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  aria-label="مشاهده آدرس وینیمی در نقشه، در پنجره جدید"
                >
                  مشاهده در نقشه
                </a>
              </div>
            </article>

            <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <Clock className="shrink-0 text-primary" size={24} aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="font-semibold">ساعات کاری</h2>
                <p className="mt-1 leading-7 text-muted-foreground">
                  شنبه تا پنج‌شنبه: {brandConfig.workingHours.weekdays}
                </p>
                <p className="leading-7 text-muted-foreground">
                  جمعه: {brandConfig.workingHours.weekends}
                </p>
              </div>
            </article>
          </div>

          <div className="min-w-0 space-y-4">
            <Link
              to="/products"
              className="btn-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-center text-lg font-bold"
            >
              <ShoppingBag size={20} aria-hidden="true" />
              شروع سفارش از محصولات
            </Link>

            <a
              href={brandConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-4 font-bold transition-colors hover:bg-secondary"
              aria-label="بازکردن اینستاگرام وینیمی در پنجره جدید"
            >
              <Instagram size={20} aria-hidden="true" />
              اینستاگرام
            </a>

            <section className="rounded-2xl border border-accent/20 bg-accent/10 p-5 sm:p-6" aria-labelledby="cooperation-title">
              <h2 id="cooperation-title" className="mb-2 font-semibold">
                سفارش عمده و همکاری
              </h2>
              <p className="mb-4 text-sm leading-7 text-muted-foreground">
                برای سفارش‌های تعداد بالا، همکاری با کافه‌ها یا سفارش سازمانی، از تماس تلفنی یا ایمیل استفاده کنید تا جزئیات زمان آماده‌سازی و قیمت نهایی مشخص شود.
              </p>
              <a
                href={`mailto:${brandConfig.email}`}
                className="touch-target inline-flex items-center font-medium text-primary hover:underline"
              >
                ارسال ایمیل همکاری
              </a>
            </section>

            <div className="rounded-2xl border border-border bg-secondary/70 p-5 text-sm leading-7 text-muted-foreground sm:p-6">
              مسیر خرید اصلی سایت از سبد خرید و تکمیل سفارش انجام می‌شود؛ واتساپ فقط برای پشتیبانی و هماهنگی موارد ویژه است.
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default ContactPage;
