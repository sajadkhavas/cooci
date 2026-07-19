import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Cookie,
  Gift,
  Heart,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Snowflake,
  Sparkles,
  Truck,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import {
  brandConfig,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { useCatalogProducts } from "@/hooks/useCatalog";
import heroImage from "@/assets/cookies/hero-main.jpg";
import lifestyleBreaking from "@/assets/cookies/lifestyle-breaking.jpg";
import lifestyleMilk from "@/assets/cookies/lifestyle-milk.jpg";
import lifestyleTwine from "@/assets/cookies/lifestyle-twine.jpg";
import galleryBakery from "@/assets/cookies/gallery-bakery-interior.jpg";
import galleryGiftBoxes from "@/assets/cookies/gallery-gift-boxes.jpg";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";

const features = [
  {
    title: "اطلاعات قابل‌بررسی",
    description:
      "قیمت فعلی، نیاز به سرمایش و وضعیت تأیید هر بخش جداگانه نمایش داده می‌شود.",
    icon: Cookie,
    image: galleryBaking,
  },
  {
    title: "زمان آماده‌سازی قابل تأیید",
    description:
      "زمان آماده‌سازی پس از دریافت داده معتبر محصول و روش تحویل نهایی می‌شود.",
    icon: Heart,
    image: lifestyleBreaking,
  },
  {
    title: "تحویل متناسب با محصول",
    description:
      "Checkout روش‌های قابل انتخاب را نمایش می‌دهد و بک‌اند محدوده و مبلغ نهایی را تأیید می‌کند.",
    icon: Truck,
    image: galleryGiftBoxes,
  },
];

const orderSteps = [
  {
    number: "۱",
    title: "انتخاب محصول",
    description:
      "محصول و گزینه دلخواه را انتخاب کنید؛ موجودی نهایی در سمت سرور بررسی خواهد شد.",
    icon: Cookie,
  },
  {
    number: "۲",
    title: "افزودن به سبد",
    description:
      "تعداد را مشخص کنید؛ قیمت، تخفیف و شرایط ارسال قبل از ادامه نمایش داده می‌شود.",
    icon: ShoppingCart,
  },
  {
    number: "۳",
    title: "ارسال و پرداخت",
    description:
      "اطلاعات گیرنده و روش تحویل را ثبت کنید؛ پرداخت واقعی بعد از اتصال امن بک‌اند فعال می‌شود.",
    icon: PackageCheck,
  },
];

const instagramImages = [
  lifestyleBreaking,
  lifestyleMilk,
  lifestyleTwine,
  galleryBakery,
  galleryGiftBoxes,
  galleryBaking,
];

const HomePage = () => {
  const { products, isLoading, error } = useCatalogProducts();
  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .slice(0, 6);

  return (
    <>
      <SEO />

      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="محصولات تازه وینیمی بیکری"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-black/55 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>

        <div className="absolute right-10 top-20 h-40 w-40 rounded-full bg-accent/30 blur-[100px]" />
        <div className="absolute bottom-20 left-20 h-52 w-52 rounded-full bg-gold/20 blur-[120px]" />

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-2xl space-y-7 text-right">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-white/90 shadow-lg backdrop-blur-md">
              <Sparkles size={18} className="text-amber-400" aria-hidden="true" />
              <span className="text-sm font-semibold">
                {brandConfig.brandNameEn} — {brandConfig.brandName}
              </span>
            </div>

            <h1 className="text-5xl font-black leading-[1.12] text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
              کاتالوگ وینیمی
              <span className="block bg-gradient-to-l from-amber-300 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                برای انتخاب روشن‌تر
              </span>
              آماده شده است
            </h1>

            <p className="max-w-xl text-lg leading-9 text-white/85 md:text-xl">
              {brandConfig.slogan}. قیمت فعلی را ببینید، محصول را به سبد اضافه کنید و موارد نیازمند تأیید را پیش از پرداخت بررسی کنید.
            </p>

            <div className="flex flex-wrap gap-3 py-2">
              {[
                ["قیمت کاتالوگ", "نمایش در فرانت‌اند"],
                ["نیاز به سرمایش", "مشخص برای هر محصول"],
                ["تأیید نهایی", "داده نهایی با بک‌اند"],
              ].map(([value, label]) => (
                <div
                  key={value}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm"
                >
                  <div className="font-black text-gold">{value}</div>
                  <div className="mt-1 text-xs text-white/70">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gold px-9 py-4 text-lg font-black text-primary shadow-xl transition hover:scale-[1.03]"
              >
                مشاهده و انتخاب محصولات
                <ArrowLeft size={20} aria-hidden="true" />
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-9 py-4 text-lg font-bold text-white shadow-xl backdrop-blur-md transition hover:bg-white/20"
              >
                <ShoppingCart size={20} aria-hidden="true" />
                مشاهده سبد خرید
              </Link>
            </div>

            <a
              href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-white/75 transition hover:text-white"
            >
              <MessageCircle size={17} aria-hidden="true" />
              سؤال دارید؟ پشتیبانی واتساپ
            </a>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="section-padding bg-gradient-to-b from-background to-secondary/30">
        <div className="container-custom">
          <div className="mb-12 space-y-4 text-center">
            <span className="font-medium text-accent">انتخاب‌های پیشنهادی کاتالوگ</span>
            <h2 className="heading-2 text-foreground">محصولات منتخب</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              قیمت فعلی و نیاز به سرمایش نمایش داده می‌شوند؛ موجودی، ترکیبات و تحویل نهایی نیازمند تأیید هستند.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="در حال بارگذاری محصولات منتخب">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="aspect-[4/3] animate-pulse bg-muted" />
                  <div className="space-y-3 p-5">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
              <Cookie className="mx-auto mb-4 text-primary" size={48} aria-hidden="true" />
              <h3 className="text-xl font-bold text-foreground">محصول منتخب فعالی وجود ندارد</h3>
              <p className="mt-2 text-muted-foreground">
                همه محصولات فعال را از کاتالوگ مشاهده کنید.
              </p>
            </div>
          )}

          {error && (
            <p className="mt-5 text-center text-sm text-amber-800" role="status">
              نسخه داخلی کاتالوگ نمایش داده شده است؛ اتصال به منبع اصلی محصولات موقتاً برقرار نیست.
            </p>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3 font-bold"
            >
              مشاهده همه محصولات
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-14 space-y-4 text-center">
            <span className="inline-flex rounded-full bg-accent/20 px-4 py-1.5 text-sm font-bold text-accent-foreground">
              چرا وینیمی؟
            </span>
            <h2 className="heading-2 text-foreground">اطلاعات روشن، قبل از خرید</h2>
            <p className="mx-auto max-w-2xl leading-8 text-muted-foreground">
              تصویر نمایشی جای داده محصول را نمی‌گیرد؛ وضعیت تأیید اطلاعات باید برای کاربر روشن باشد.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card transition hover:-translate-y-1 hover:shadow-hover"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                    width={640}
                    height={420}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent shadow-lg">
                    <feature.icon className="text-accent-foreground" size={28} aria-hidden="true" />
                  </div>
                </div>
                <div className="space-y-3 p-6">
                  <h3 className="heading-3 text-foreground">{feature.title}</h3>
                  <p className="leading-8 text-muted-foreground">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="mb-14 space-y-4 text-center">
            <span className="font-bold text-primary">سه مرحله روشن</span>
            <h2 className="heading-2 text-foreground">مسیر سفارش آنلاین</h2>
            <p className="mx-auto max-w-xl leading-8 text-muted-foreground">
              هیچ سفارش محصولی خارج از سبد خرید ثبت نمی‌شود؛ پشتیبانی فقط برای سؤال و هماهنگی موارد ویژه است.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {orderSteps.map((step) => (
              <article key={step.number} className="relative rounded-3xl border border-border bg-card p-7 text-right shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon size={24} aria-hidden="true" />
                  </div>
                  <span className="text-5xl font-black text-primary/15">{step.number}</span>
                </div>
                <h3 className="mb-3 text-xl font-black text-foreground">{step.title}</h3>
                <p className="leading-8 text-muted-foreground">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-l from-primary via-cocoa to-primary text-primary-foreground">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <Sparkles className="mx-auto mb-4 text-gold" size={28} aria-hidden="true" />
            <h2 className="text-3xl font-black md:text-4xl">چهار اصل ثابت هر سفارش</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {brandConfig.trustPillars.map((pillar) => (
              <div key={pillar} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <CheckCircle2 className="mb-3 text-gold" size={23} aria-hidden="true" />
                <p className="font-bold leading-8">{pillar}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <span className="font-medium text-accent">پشت صحنه وینیمی</span>
            <h2 className="heading-2 mt-3 text-foreground">پخت، بسته‌بندی و لحظه‌های شیرین</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {instagramImages.map((image, index) => (
              <a
                key={image}
                href={brandConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group aspect-square overflow-hidden rounded-2xl"
                aria-label={`مشاهده اینستاگرام وینیمی، تصویر ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`محصولات و فضای وینیمی ${index + 1}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  width={360}
                  height={360}
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-primary via-cocoa to-primary text-primary-foreground">
        <div className="container-custom text-center">
          <Gift className="mx-auto mb-5 text-gold" size={38} aria-hidden="true" />
          <h2 className="text-3xl font-black md:text-5xl">برای انتخاب شیرین آماده‌اید؟</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-9 text-primary-foreground/80">
            کاتالوگ را ببینید، محصول را به سبد اضافه کنید و هزینه‌ها و روش تحویل را قبل از پرداخت بررسی کنید.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gold px-9 py-4 text-lg font-black text-primary"
            >
              مشاهده محصولات
              <ArrowLeft size={20} aria-hidden="true" />
            </Link>
            <Link
              to="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-9 py-4 text-lg font-bold text-white"
            >
              <ShoppingCart size={20} aria-hidden="true" />
              رفتن به سبد خرید
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/75">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={18} className="text-gold" aria-hidden="true" />
              اطلاعات شفاف محصول
            </span>
            <span className="inline-flex items-center gap-2">
              <Snowflake size={18} className="text-gold" aria-hidden="true" />
              قانون ارسال یخچالی
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck size={18} className="text-gold" aria-hidden="true" />
              ارسال سراسری محصولات خشک
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
