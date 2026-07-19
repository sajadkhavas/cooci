import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  Cookie,
  Gift,
  MessageCircle,
  PackageCheck,
  ScanSearch,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Snowflake,
  Sparkles,
  Truck,
} from "lucide-react";
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
  "کاتالوگ شفاف",
  "طراحی مدرن",
  "انتخاب سریع",
  "نیاز به سرمایش مشخص",
  "سبد خرید مرحله‌به‌مرحله",
  "داده نهایی با بک‌اند",
];

const discoveryCards = [
  {
    icon: ScanSearch,
    eyebrow: "Discover",
    title: "دیدن، مقایسه‌کردن، بعد انتخاب‌کردن",
    description:
      "کارت‌های محصول با قیمت فعلی، دسته‌بندی، نوع ارسال و وضعیت تأیید اطلاعات طراحی شده‌اند.",
    image: galleryBaking,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    icon: Snowflake,
    eyebrow: "Delivery",
    title: "نیاز به سرمایش، همان ابتدا روشن",
    description:
      "محصولات حساس به دما پیش از ورود به Checkout علامت‌گذاری می‌شوند.",
    image: lifestyleMilk,
    className: "md:col-span-1",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Trust",
    title: "مرز روشن بین داده نمایشی و تأییدشده",
    description:
      "تصویر، موجودی، ترکیبات و آلرژن فقط با وضعیت تأیید مشخص نمایش داده می‌شوند.",
    image: lifestyleTwine,
    className: "md:col-span-1",
  },
];

const orderSteps = [
  {
    number: "01",
    title: "کشف محصول",
    description:
      "در فروشگاه جستجو کنید، دسته‌بندی را تغییر دهید و گزینه مناسب را پیدا کنید.",
    icon: ShoppingBag,
  },
  {
    number: "02",
    title: "ساخت سبد",
    description:
      "نوع، تعداد و قیمت فعلی را بررسی کنید و سبد را بدون فشار و شلوغی تکمیل کنید.",
    icon: ShoppingCart,
  },
  {
    number: "03",
    title: "تأیید و ادامه",
    description:
      "اطلاعات تحویل را وارد کنید؛ موجودی و مبلغ نهایی هنگام اتصال بک‌اند دوباره بررسی می‌شوند.",
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
      <SEO />

      <section className="relative min-h-[calc(100svh-1rem)] overflow-hidden pb-16 pt-8 sm:pb-24 lg:pt-16">
        <div className="soft-grid pointer-events-none absolute inset-0 opacity-45" aria-hidden="true" />
        <div className="container-custom relative">
          <div className="grid min-h-[78svh] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
            <div className="relative z-10 order-2 lg:order-1">
              <Reveal>
                <span className="editorial-label mb-6">
                  <Sparkles size={15} className="text-gold" aria-hidden="true" />
                  Full modern bakery experience
                </span>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="max-w-4xl text-[clamp(3.35rem,7.2vw,7.7rem)] font-black leading-[0.92] tracking-[-0.075em] text-foreground">
                  انتخاب شیرین،
                  <span className="block text-gradient-modern">با تجربه‌ای تازه.</span>
                </h1>
              </Reveal>

              <Reveal delay={150}>
                <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
                  {brandConfig.slogan}. قیمت فعلی را ببینید، محصول را به سبد اضافه کنید و موارد نیازمند تأیید را پیش از پرداخت بررسی کنید.
                </p>
              </Reveal>

              <Reveal delay={220}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    to="/products"
                    className="btn-primary group inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-black sm:px-9"
                  >
                    ورود به فروشگاه
                    <ArrowLeft
                      size={20}
                      className="transition-transform group-hover:-translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    to="/gift"
                    className="btn-secondary group inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-black sm:px-9"
                  >
                    <Gift size={19} aria-hidden="true" />
                    راهنمای انتخاب هدیه
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={290}>
                <div className="mt-8 grid max-w-2xl grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    ["شفاف", "وضعیت داده"],
                    ["سریع", "مسیر انتخاب"],
                    ["واکنش‌گرا", "تمام دستگاه‌ها"],
                  ].map(([value, label]) => (
                    <div
                      key={value}
                      className="glass-panel rounded-2xl px-3 py-4 text-center sm:px-5"
                    >
                      <strong className="block text-base font-black text-primary sm:text-lg">
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
                    alt="تصویر نمایشی محصولات وینیمی"
                    className="aspect-[4/4.8] h-full w-full object-cover sm:aspect-[5/4.5] lg:aspect-[4/5]"
                    loading="eager"
                    decoding="async"
                    width={1200}
                    height={1450}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-white/10" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
                          Visual catalogue
                        </span>
                        <p className="mt-2 max-w-md text-lg font-black leading-8 sm:text-2xl">
                          تصویر نمایشی برای تجربه بصری کاتالوگ
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

                <div className="float-slow absolute -bottom-7 -right-2 rounded-[1.6rem] border border-white/45 bg-card/80 p-3 shadow-2xl backdrop-blur-2xl sm:-right-7 sm:p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                      <Cookie size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <strong className="block text-sm font-black">کاتالوگ بصری</strong>
                      <span className="text-[10px] font-bold text-muted-foreground sm:text-xs">
                        محصول، قیمت، وضعیت تأیید
                      </span>
                    </div>
                  </div>
                </div>

                <div className="float-slower absolute -left-2 top-8 hidden rounded-[1.6rem] border border-white/35 bg-primary/88 p-4 text-primary-foreground shadow-2xl backdrop-blur-2xl sm:block lg:-left-10">
                  <Snowflake size={20} className="mb-3 text-accent" aria-hidden="true" />
                  <strong className="block text-sm font-black">تحویل هوشمند</strong>
                  <span className="mt-1 block max-w-36 text-xs leading-6 text-primary-foreground/55">
                    نوع ارسال متناسب با محصول
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-border/60 bg-primary py-4 text-primary-foreground" aria-label="ویژگی‌های تجربه فروشگاه">
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
          <Reveal className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="editorial-label mb-5">Curated selection</span>
              <h2 className="modern-section-title">انتخاب‌های پیشنهادی، با طراحی کم‌اصطکاک.</h2>
            </div>
            <div className="max-w-xl lg:text-left">
              <p className="leading-8 text-muted-foreground">
                قیمت فعلی و نیاز به سرمایش نمایش داده می‌شوند؛ موجودی، ترکیبات و تحویل نهایی نیازمند تأیید هستند.
              </p>
              <Link
                to="/products"
                className="group mt-4 inline-flex items-center gap-2 font-black text-primary"
              >
                مشاهده کل کاتالوگ
                <ArrowLeft
                  size={18}
                  className="transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="در حال بارگذاری محصولات منتخب">
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
              <h3 className="text-xl font-black text-foreground">محصول منتخب فعالی وجود ندارد</h3>
              <p className="mt-2 text-muted-foreground">
                همه محصولات فعال را از کاتالوگ مشاهده کنید.
              </p>
            </div>
          )}

          {error && (
            <p className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-center text-sm font-bold text-amber-900" role="status">
              نسخه داخلی کاتالوگ نمایش داده شده است؛ اتصال به منبع اصلی محصولات موقتاً برقرار نیست.
            </p>
          )}
        </div>
      </section>

      <section className="section-padding pt-4">
        <div className="container-custom">
          <Reveal className="mb-10 text-center">
            <span className="editorial-label mb-5">A better way to browse</span>
            <h2 className="modern-section-title mx-auto">هر بخش، یک تصمیم طراحی‌شده.</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-muted-foreground">
              تصویر نمایشی جای داده محصول را نمی‌گیرد؛ وضعیت تأیید اطلاعات باید برای کاربر روشن باشد.
            </p>
          </Reveal>

          <div className="grid auto-rows-[minmax(18rem,auto)] gap-5 md:grid-cols-3">
            {discoveryCards.map((card, index) => (
              <Reveal
                key={card.title}
                delay={index * 80}
                className={`bento-card group ${card.className}`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                  width={900}
                  height={900}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/52 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6 text-primary-foreground sm:p-8">
                  <div className="mb-auto flex items-center justify-between">
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] backdrop-blur-md">
                      {card.eyebrow}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xl">
                      <card.icon size={20} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-16 max-w-xl text-2xl font-black leading-tight sm:text-3xl">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-primary-foreground/65">
                    {card.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding overflow-hidden">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <Reveal>
              <span className="editorial-label mb-5">How it flows</span>
              <h2 className="modern-section-title">سه قدم، بدون پیچیدگی اضافه.</h2>
              <p className="mt-5 max-w-xl leading-8 text-muted-foreground">
                مسیر سفارش از کشف محصول تا Checkout برای موبایل و دسکتاپ یکپارچه طراحی شده است.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {brandConfig.trustPillars.map((pillar) => (
                  <span
                    key={pillar}
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/65 px-4 py-2 text-xs font-bold text-muted-foreground shadow-soft backdrop-blur-xl"
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
                  <article className="group grid items-center gap-5 rounded-[2rem] border border-border/70 bg-card/68 p-5 shadow-soft backdrop-blur-xl transition duration-500 hover:border-primary/25 hover:bg-card hover:shadow-card sm:grid-cols-[auto_1fr_auto] sm:p-6">
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
                  انتخاب برای خودت یا هدیه
                </span>
                <h2 className="text-3xl font-black leading-[1.1] sm:text-5xl lg:text-6xl">
                  آماده‌ای کاتالوگ را
                  <span className="block text-accent">با نگاه تازه ببینی؟</span>
                </h2>
                <p className="mt-5 max-w-2xl leading-8 text-primary-foreground/62">
                  محصولات را مقایسه کن، وضعیت داده را ببین و سبد را مرحله‌به‌مرحله بساز.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/products"
                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-accent px-8 font-black text-accent-foreground transition hover:-translate-y-1"
                  >
                    مشاهده محصولات
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
                      width={360}
                      height={360}
                    />
                    <p className="line-clamp-1 px-2 py-3 text-center text-xs font-black text-white">
                      {product.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default HomePage;
