import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  Cookie,
  Gift,
  Heart,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Snowflake,
  Sparkles,
  Truck,
} from "lucide-react";
import { CategoryShowcase } from "@/components/catalog/CategoryShowcase";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
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

const marqueeItems = [
  "کوکی‌های خانگی",
  "کیک و چیزکیک",
  "رول و کروسان",
  "باکس هدیه",
  "انتخاب برای پذیرایی",
  "جزئیات نگهداری محصول",
];

const occasionCards = [
  {
    icon: Gift,
    eyebrow: "Gift",
    title: "برای هدیه‌ای که انتخابش شخصی‌تر است",
    description:
      "باکس‌های فعال و راهنمای هدیه را ببین و براساس مناسبت، تعداد و نوع محصول تصمیم بگیر.",
    image: galleryGiftBoxes,
    href: "/gift",
    action: "راهنمای انتخاب هدیه",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    icon: ShoppingBag,
    eyebrow: "Gathering",
    title: "برای دورهمی و پذیرایی",
    description:
      "از مینی‌کوکی و گزینه‌های چندتایی شروع کن و بعد تعداد و جزئیات هر محصول را بررسی کن.",
    image: galleryBaking,
    href: "/products/category/mini-cookies",
    action: "دیدن گزینه‌های پذیرایی",
    className: "md:col-span-1",
  },
  {
    icon: Snowflake,
    eyebrow: "Cake & dessert",
    title: "برای کیک و دسرهای نیازمند نگهداری دقیق‌تر",
    description:
      "محصولات سرد با نشان مشخص نمایش داده می‌شوند تا پیش از سفارش شرایط تحویل را ببینی.",
    image: lifestyleMilk,
    href: "/products/category/cakes",
    action: "دیدن کیک و دسر",
    className: "md:col-span-1",
  },
];

const orderSteps = [
  {
    number: "01",
    title: "دسته یا مناسبت را انتخاب کن",
    description:
      "از دسته‌بندی‌ها، راهنمای هدیه یا فروشگاه وارد مسیری شو که به نیازت نزدیک‌تر است.",
    icon: ShoppingBag,
  },
  {
    number: "02",
    title: "جزئیات محصول را مقایسه کن",
    description:
      "تصویر، گزینه فعال، قیمت، نیاز سرمایشی و اطلاعات تأییدشده هر محصول را بررسی کن.",
    icon: ShoppingCart,
  },
  {
    number: "03",
    title: "تحویل را مشخص و سفارش را ثبت کن",
    description:
      "مقصد و روش قابل انتخاب را وارد کن؛ مبلغ و موجودی پیش از پرداخت دوباره بررسی می‌شوند.",
    icon: PackageCheck,
  },
];

const HomePage = () => {
  const { products, isLoading, error } = useCatalogProducts();
  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .slice(0, 6);
  const visualProducts = products.slice(0, 3);

  return (
    <>
      <SEO
        title="خرید کوکی، کیک و باکس هدیه"
        description="سفارش آنلاین کوکی، مینی کوکی، کیک، چیزکیک، رول و کروسان و باکس هدیه وینیمی؛ انتخاب بر اساس دسته، مناسبت و جزئیات محصول."
      />

      <section className="relative min-h-[calc(100svh-1rem)] overflow-hidden pb-16 pt-8 sm:pb-24 lg:pt-16">
        <div className="soft-grid pointer-events-none absolute inset-0 opacity-45" aria-hidden="true" />
        <div className="container-custom relative">
          <div className="grid min-h-[78svh] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
            <div className="relative z-10 order-2 lg:order-1">
              <Reveal>
                <span className="editorial-label mb-6">
                  <Sparkles size={15} className="text-gold" aria-hidden="true" />
                  Winimi bakery catalogue
                </span>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="max-w-5xl text-[clamp(3.2rem,7vw,7.4rem)] font-black leading-[0.94] tracking-[-0.07em] text-foreground">
                  سفارش آنلاین کوکی،
                  <span className="block text-gradient-modern">
                    کیک و باکس هدیه.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={150}>
                <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
                  از طعم‌های روزمره تا انتخاب‌های مناسب هدیه و پذیرایی؛ دسته موردنظرت
                  را پیدا کن، جزئیات هر محصول را ببین و مسیر سفارش را مرحله‌به‌مرحله
                  ادامه بده.
                </p>
              </Reveal>

              <Reveal delay={220}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    to="/categories"
                    className="btn-primary group inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-black sm:px-9"
                  >
                    انتخاب از دسته‌بندی‌ها
                    <ArrowLeft
                      size={20}
                      className="transition-transform group-hover:-translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    to="/products"
                    className="btn-secondary group inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-black sm:px-9"
                  >
                    <ShoppingBag size={19} aria-hidden="true" />
                    مشاهده همه محصولات
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={290}>
                <div className="mt-8 grid max-w-2xl grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    ["چند مسیر", "برای نوع محصول"],
                    ["هدیه و پذیرایی", "بر اساس موقعیت"],
                    ["جزئیات روشن", "پیش از سفارش"],
                  ].map(([value, label]) => (
                    <div
                      key={value}
                      className="glass-panel rounded-2xl px-3 py-4 text-center sm:px-5"
                    >
                      <strong className="block text-sm font-black text-primary sm:text-base">
                        {value}
                      </strong>
                      <span className="mt-1 block text-[10px] font-bold text-muted-foreground sm:text-xs">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="order-1 lg:order-2" delay={100}>
              <div className="relative mx-auto w-full max-w-3xl lg:max-w-none">
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-accent/25 via-transparent to-peach/25 blur-2xl" />
                <figure className="relative overflow-hidden rounded-[2.4rem] border border-white/35 bg-card shadow-[0_46px_120px_-50px_hsl(var(--foreground)/0.65)] sm:rounded-[3.2rem]">
                  <img
                    src={heroImage}
                    alt="نمایی از کوکی، کیک و محصولات وینیمی"
                    className="aspect-[4/4.8] h-full w-full object-cover sm:aspect-[5/4.5] lg:aspect-[4/5]"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    width={1200}
                    height={1450}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/78 via-transparent to-white/10" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/58">
                          Choose your moment
                        </span>
                        <p className="mt-2 max-w-md text-lg font-black leading-8 sm:text-2xl">
                          کوکی، کیک، دسر و هدیه در یک مسیر قابل انتخاب
                        </p>
                      </div>
                      <Link
                        to="/gallery"
                        className="touch-target flex shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/12 backdrop-blur-xl transition hover:bg-white/20"
                        aria-label="مشاهده گالری تصاویر"
                      >
                        <ArrowUpLeft size={20} aria-hidden="true" />
                      </Link>
                    </div>
                  </figcaption>
                </figure>

                <div className="float-slow absolute -bottom-7 -right-2 rounded-[1.6rem] border border-white/45 bg-card/88 p-3 shadow-2xl backdrop-blur-2xl sm:-right-7 sm:p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                      <Cookie size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <strong className="block text-sm font-black">انتخاب بر اساس دسته</strong>
                      <span className="text-[10px] font-bold text-muted-foreground sm:text-xs">
                        کوتاه‌تر از جست‌وجوی اتفاقی
                      </span>
                    </div>
                  </div>
                </div>

                <div className="float-slower absolute -left-2 top-8 hidden rounded-[1.6rem] border border-white/35 bg-primary/90 p-4 text-primary-foreground shadow-2xl backdrop-blur-2xl sm:block lg:-left-10">
                  <Truck size={20} className="mb-3 text-accent" aria-hidden="true" />
                  <strong className="block text-sm font-black">روش تحویل متناسب</strong>
                  <span className="mt-1 block max-w-40 text-xs leading-6 text-primary-foreground/62">
                    براساس محصول و مقصد سفارش
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        className="overflow-hidden border-y border-border/60 bg-primary py-4 text-primary-foreground"
        aria-label="دسته‌ها و کاربردهای محصولات"
      >
        <div className="marquee-track gap-8 pr-8 sm:gap-12 sm:pr-12">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex shrink-0 items-center gap-3 text-sm font-black sm:text-base"
            >
              <Sparkles size={15} className="text-accent" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="section-padding relative overflow-hidden">
        <div className="container-custom">
          <CategoryShowcase
            limit={6}
            title="اول دسته را پیدا کن، بعد میان انتخاب‌های مرتبط بگرد"
            description="از کوکی و مینی کوکی تا کیک، چیزکیک، رول و کروسان و باکس هدیه؛ دسته‌بندی مسیر انتخاب را کوتاه‌تر می‌کند."
          />
          <Link
            to="/categories"
            className="sr-only"
            aria-label="مشاهده همه دسته‌بندی‌ها"
          >
            مشاهده همه دسته‌بندی‌ها
          </Link>
        </div>
      </section>

      <section className="section-padding relative overflow-hidden bg-secondary/25">
        <div className="container-custom">
          <Reveal className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="editorial-label mb-5">Winimi selection</span>
              <h2 className="modern-section-title">
                پیشنهادهای وینیمی برای شروع انتخاب
              </h2>
            </div>
            <div className="max-w-xl lg:text-left">
              <p className="leading-8 text-muted-foreground">
                گزینه‌های منتخب کاتالوگ را ببین؛ برای تصمیم نهایی وارد صفحه محصول
                شو و قیمت، موجودی و جزئیات تأییدشده را بررسی کن.
              </p>
              <Link
                to="/products"
                className="group mt-4 inline-flex items-center gap-2 font-black text-primary"
              >
                مشاهده کل فروشگاه
                <ArrowLeft
                  size={18}
                  className="transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>

          {isLoading ? (
            <div
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              aria-busy="true"
              aria-label="در حال بارگذاری محصولات منتخب"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="bento-card overflow-hidden">
                  <div className="aspect-[4/3] animate-pulse bg-muted" />
                  <div className="space-y-3 p-5">
                    <div className="h-6 w-3/4 animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                    <div className="h-12 w-full animate-pulse rounded-2xl bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product, index) => (
                <Reveal key={product.id} delay={(index % 3) * 80}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="bento-card p-12 text-center">
              <Cookie className="mx-auto mb-4 text-primary" size={48} aria-hidden="true" />
              <h3 className="text-xl font-black text-foreground">
                پیشنهاد فعالی در کاتالوگ ثبت نشده است
              </h3>
              <p className="mt-2 text-muted-foreground">
                همه محصولات فعال را از فروشگاه مشاهده کن.
              </p>
            </div>
          )}

          {error && (
            <p
              className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-center text-sm font-bold text-amber-900"
              role="status"
            >
              به‌روزرسانی کاتالوگ موقتاً انجام نشد؛ برای اطلاعات نهایی دوباره تلاش کن.
            </p>
          )}
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="container-custom">
          <Reveal className="mb-10 text-center">
            <span className="editorial-label mb-5">Shop by occasion</span>
            <h2 className="modern-section-title mx-auto">
              خرید بر اساس موقعیت، نه فقط نام محصول
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-muted-foreground">
              برای هدیه، دورهمی یا یک دسر سرد مسیر جداگانه داشته باش تا لازم نباشد
              از میان همه محصولات شروع کنی.
            </p>
          </Reveal>

          <div className="grid auto-rows-[minmax(18rem,auto)] gap-5 md:grid-cols-3">
            {occasionCards.map((card, index) => (
              <Reveal
                key={card.title}
                delay={index * 80}
                className={`bento-card group ${card.className}`}
              >
                <Link
                  to={card.href}
                  className="absolute inset-0 z-20"
                  aria-label={card.action}
                />
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  width={900}
                  height={900}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/58 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6 text-primary-foreground sm:p-8">
                  <div className="mb-auto flex items-center justify-between">
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em]">
                      {card.eyebrow}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xl">
                      <card.icon size={20} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-16 max-w-xl text-2xl font-black leading-tight sm:text-3xl">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-primary-foreground/72">
                    {card.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-accent">
                    {card.action}
                    <ArrowUpLeft size={17} aria-hidden="true" />
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding overflow-hidden bg-secondary/20">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <Reveal>
              <span className="editorial-label mb-5">How it flows</span>
              <h2 className="modern-section-title">
                سه قدم تا انتخاب و ثبت سفارش
              </h2>
              <p className="mt-5 max-w-xl leading-8 text-muted-foreground">
                صفحه اصلی مسیر را کوتاه می‌کند، صفحه محصول جزئیات را نشان می‌دهد و
                Checkout شرایط نهایی سفارش را براساس مقصد بررسی می‌کند.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {brandConfig.trustPillars.map((pillar) => (
                  <span
                    key={pillar}
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-4 py-2 text-xs font-bold text-muted-foreground shadow-soft"
                  >
                    <Check size={14} className="text-primary" aria-hidden="true" />
                    {pillar}
                  </span>
                ))}
              </div>
            </Reveal>

            <div className="grid gap-4">
              {orderSteps.map((step, index) => (
                <Reveal key={step.number} delay={index * 90}>
                  <article className="group grid items-center gap-5 rounded-[2rem] border border-border/70 bg-card/78 p-5 shadow-soft transition duration-500 hover:border-primary/25 hover:bg-card hover:shadow-card sm:grid-cols-[auto_1fr_auto] sm:p-6">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl transition-transform group-hover:-rotate-3 group-hover:scale-105">
                      <step.icon size={24} aria-hidden="true" />
                    </span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                        Step {step.number}
                      </span>
                      <h3 className="mt-1 text-xl font-black text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    <span className="hidden text-5xl font-black text-primary/10 sm:block">
                      {step.number}
                    </span>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal className="group relative min-h-[25rem] overflow-hidden rounded-[2.4rem]">
              <img
                src={galleryBakery}
                alt="فضای بصری مرتبط با داستان وینیمی"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={1000}
                height={800}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/48 to-transparent" />
              <div className="relative flex min-h-[25rem] flex-col justify-end p-7 text-primary-foreground sm:p-9">
                <Heart className="mb-auto text-accent" size={28} aria-hidden="true" />
                <span className="text-xs font-black uppercase tracking-[0.16em] text-accent">
                  Our story
                </span>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  داستان وینیمی را قبل از خرید بشناس
                </h2>
                <p className="mt-4 max-w-xl leading-8 text-primary-foreground/72">
                  صفحه داستان وینیمی جای معرفی آدم‌ها، مسیر شکل‌گیری برند و چیزهایی
                  است که این مجموعه را از یک کاتالوگ معمولی جدا می‌کند.
                </p>
                <Link
                  to="/about"
                  className="mt-6 inline-flex items-center gap-2 font-black text-accent"
                >
                  خواندن داستان وینیمی
                  <ArrowUpLeft size={18} aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <Reveal className="group relative min-h-[25rem] overflow-hidden rounded-[2.4rem]" delay={80}>
              <img
                src={lifestyleTwine}
                alt="بسته‌بندی و ارائه محصول وینیمی"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={1000}
                height={800}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-transparent" />
              <div className="relative flex min-h-[25rem] flex-col justify-end p-7 text-primary-foreground sm:p-9">
                <ShieldCheck className="mb-auto text-accent" size={28} aria-hidden="true" />
                <span className="text-xs font-black uppercase tracking-[0.16em] text-accent">
                  Verified reviews
                </span>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  نظر تأییدشده را جدا از شعار تبلیغاتی ببین
                </h2>
                <p className="mt-4 max-w-xl leading-8 text-primary-foreground/72">
                  بخش نظرها برای نمایش تجربه‌های تأییدشده ساخته شده است؛ بدون عدد یا
                  امتیاز ساختگی در صفحه اصلی.
                </p>
                <Link
                  to="/reviews"
                  className="mt-6 inline-flex items-center gap-2 font-black text-accent"
                >
                  مشاهده نظرهای تأییدشده
                  <ArrowUpLeft size={18} aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="container-custom">
          <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-primary p-6 text-primary-foreground shadow-[0_50px_130px_-55px_hsl(var(--primary)/0.95)] sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <span className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/18 blur-[90px]" />
              <span className="absolute -bottom-36 left-12 h-96 w-96 rounded-full bg-gold/12 blur-[110px]" />
              <div className="soft-grid absolute inset-0 opacity-10" />
            </div>

            <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black text-accent">
                  <Gift size={16} aria-hidden="true" />
                  برای خودت، پذیرایی یا هدیه
                </span>
                <h2 className="text-3xl font-black leading-[1.1] sm:text-5xl lg:text-6xl">
                  از دسته درست شروع کن،
                  <span className="block text-accent">بعد جزئیات را مقایسه کن.</span>
                </h2>
                <p className="mt-5 max-w-2xl leading-8 text-primary-foreground/68">
                  دسته‌بندی‌ها برای کشف سریع‌تر ساخته شده‌اند و فروشگاه برای زمانی
                  است که می‌خواهی همه گزینه‌ها را جست‌وجو و فیلتر کنی.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/categories"
                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-accent px-8 font-black text-accent-foreground transition hover:-translate-y-1"
                  >
                    مشاهده دسته‌بندی‌ها
                    <ArrowUpLeft
                      size={19}
                      className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </Link>
                  <a
                    href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/15 bg-white/8 px-8 font-black transition hover:bg-white/13"
                  >
                    <MessageCircle size={19} aria-hidden="true" />
                    سؤال از پشتیبانی
                  </a>
                </div>
              </div>

              <div className="relative hidden min-h-[22rem] lg:block">
                {visualProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className={`absolute overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-xl transition duration-500 hover:z-20 hover:scale-105 ${
                      index === 0
                        ? "right-4 top-2 z-10 w-56 rotate-6"
                        : index === 1
                          ? "left-8 top-12 z-0 w-48 -rotate-6"
                          : "bottom-0 right-36 z-10 w-44 rotate-2"
                    }`}
                  >
                    <img
                      src={product.images[0]?.url}
                      alt={product.images[0]?.alt || product.name}
                      className="aspect-square w-full rounded-[1.5rem] object-cover"
                      loading="lazy"
                      decoding="async"
                      width={360}
                      height={360}
                    />
                    <p className="line-clamp-1 px-2 py-3 text-center text-xs font-black text-white">
                      {product.name}
                    </p>
                  </Link>
                ))}
                {visualProducts.length === 0 && (
                  <img
                    src={lifestyleBreaking}
                    alt="نمای نزدیک محصول وینیمی"
                    className="absolute inset-0 h-full w-full rounded-[2rem] object-cover opacity-90"
                    loading="lazy"
                    width={700}
                    height={700}
                  />
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default HomePage;
