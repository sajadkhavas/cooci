import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  Cookie,
  Gift,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { CategoryShowcase } from "@/components/catalog/CategoryShowcase";
import { DecisionSupportPanel, homeDecisionFaqSchema } from "@/components/home/DecisionSupportPanel";
import { DraggableMarquee } from "@/components/home/DraggableMarquee";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { SEO } from "@/components/SEO";
import {
  brandConfig,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { useCatalogCategories, useCatalogProducts } from "@/hooks/useCatalog";
import { buildVisibleCatalogCategories } from "@/lib/catalog-category-visibility";
import { categoryContents } from "@/data/categoriesContent";
import heroImage from "@/assets/cookies/hero-main.jpg";
import lifestyleBreaking from "@/assets/cookies/lifestyle-breaking.jpg";
import lifestyleMilk from "@/assets/cookies/lifestyle-milk.jpg";
import lifestyleTwine from "@/assets/cookies/lifestyle-twine.jpg";
import galleryGiftBoxes from "@/assets/cookies/gallery-gift-boxes.jpg";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";

const marqueeItems = [
  "کوکی‌های خانگی",
  "مینی‌کوکی برای پذیرایی",
  "کیک و چیزکیک",
  "رول و کروسان",
  "باکس هدیه",
  "راهنمای انتخاب هدیه",
  "سفارش سازمانی",
  "پشتیبانی وینیمی",
];

const occasionCards = [
  {
    icon: Gift,
    eyebrow: "راهنمای هدیه",
    title: "برای هدیه‌ای که انتخابش شخصی‌تر است",
    description:
      "راهنمای انتخاب هدیه را ببین و براساس مناسبت، تعداد و سلیقه گیرنده تصمیم بگیر.",
    image: galleryGiftBoxes,
    href: "/gift",
    action: "رفتن به راهنمای هدیه",
  },
  {
    icon: ShoppingBag,
    eyebrow: "پذیرایی و دورهمی",
    title: "انتخاب‌های جمع‌وجور برای چند نفر",
    description:
      "محصولات مناسب پذیرایی را کنار هم ببین و تعداد، طعم و جزئیات هر گزینه را مقایسه کن.",
    image: galleryBaking,
    href: "/products/category/mini-cookies",
    action: "دیدن گزینه‌های پذیرایی",
  },
  {
    icon: Cookie,
    eyebrow: "انتخاب روزمره",
    title: "یک همراه شیرین برای چای و قهوه",
    description:
      "از میان کوکی‌های فعال، طعمی را پیدا کن که به حال‌وهوای امروزت نزدیک‌تر است.",
    image: lifestyleMilk,
    href: "/products/category/cookies",
    action: "دیدن کوکی‌ها",
  },
];

const orderSteps = [
  {
    number: "۰۱",
    title: "دسته یا مناسبت را انتخاب کن",
    description: "از مسیر کوتاهی شروع کن که به نیاز و موقعیت تو نزدیک‌تر است.",
    icon: ShoppingBag,
  },
  {
    number: "۰۲",
    title: "جزئیات محصول را مقایسه کن",
    description: "تصویر، قیمت، موجودی و شرایط نگهداری هر انتخاب را ببین.",
    icon: ShoppingCart,
  },
  {
    number: "۰۳",
    title: "تحویل را مشخص و سفارش را ثبت کن",
    description: "مقصد و روش تحویل را انتخاب کن و مبلغ نهایی را پیش از پرداخت ببین.",
    icon: PackageCheck,
  },
];

const guideCards = [
  {
    title: "چطور برای هدیه انتخاب کنیم؟",
    description:
      "از مناسبت و تعداد گیرنده‌ها شروع کن و بعد سراغ نوع محصول و بسته‌بندی برو.",
    image: lifestyleTwine,
    href: "/blog",
    label: "راهنمای انتخاب هدیه",
  },
  {
    title: "پیش از سفارش، شرایط نگهداری را ببین",
    description:
      "بعضی محصولات به سرمایش نیاز دارند؛ نشان و توضیح صفحه محصول را پیش از انتخاب بررسی کن.",
    image: lifestyleMilk,
    href: "/blog",
    label: "راهنمای نگهداری",
  },
  {
    title: "برای پذیرایی چه تعداد مناسب است؟",
    description:
      "نوع مراسم، تعداد مهمان‌ها و اندازه هر محصول سه سرنخ خوب برای شروع‌اند.",
    image: galleryBaking,
    href: "/blog",
    label: "راهنمای پذیرایی",
  },
];

const HomePage = () => {
  const { products, isLoading, error } = useCatalogProducts();
  const { categories } = useCatalogCategories();
  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .slice(0, 6);
  const visualProducts = products.slice(0, 3);
  const visibleCategories = buildVisibleCatalogCategories(
    categoryContents,
    categories,
  ).slice(0, 3);

  return (
    <>
      <SEO
        title="خرید کوکی، کیک و باکس هدیه"
        description="محصولات فعال وینیمی را براساس دسته یا مناسبت پیدا کنید؛ تصویر، قیمت، موجودی و شرایط هر انتخاب را ببینید و آنلاین سفارش دهید."
        schema={homeDecisionFaqSchema}
      />

      <section className="home-color-wash relative overflow-hidden pb-16 pt-8 sm:pb-24 lg:pt-16">
        <div className="soft-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
        <div className="container-custom relative">
          <div className="grid min-h-[74svh] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
            <div className="relative z-10 order-2 lg:order-1">
              <Reveal>
                <span className="editorial-label mb-6">
                  <Sparkles size={15} className="text-[#b96552]" aria-hidden="true" />
                  شیرینی دست‌ساز برای لحظه‌های شما
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="max-w-5xl text-[clamp(3rem,7vw,7rem)] font-black leading-[1.02] tracking-[-0.06em] text-foreground">
                  طعم خوب برای
                  <span className="block text-[#b96552]">
                    هدیه، پذیرایی و حال خوب.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
                  محصولات فعال وینیمی را براساس دسته یا مناسبت پیدا کن؛ تصویر،
                  قیمت، موجودی و شرایط هر انتخاب را ببین و با خیال روشن‌تر سفارش
                  بده.
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
                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#d88972]/45 bg-[#f7e4dc] px-7 text-base font-black text-[#6f3e33] transition hover:border-[#b96552] hover:bg-white sm:px-9"
                  >
                    <Gift size={19} aria-hidden="true" />
                    راهنمای انتخاب هدیه
                  </Link>
                </div>
              </Reveal>
              {visibleCategories.length > 0 && (
                <Reveal delay={290}>
                  <nav
                    className="winimi-snap-nav mt-8 flex max-w-2xl snap-x snap-mandatory gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0"
                    aria-label="دسته‌های فعال فروشگاه"
                  >
                    {visibleCategories.map((category) => (
                      <Link
                        key={category.routeSlug}
                        to={`/products/category/${category.routeSlug}`}
                        className="inline-flex min-h-11 shrink-0 snap-start items-center rounded-full border border-border bg-white/70 px-4 text-xs font-black text-foreground transition hover:border-[#d88972] hover:text-[#9b5545] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b96552]"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>
                </Reveal>
              )}
            </div>

            <Reveal className="order-1 lg:order-2" delay={100}>
              <figure className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2.4rem] border border-white/40 bg-card shadow-[0_46px_120px_-50px_hsl(var(--foreground)/0.55)] sm:rounded-[3.2rem] lg:max-w-none">
                <img
                  src={heroImage}
                  alt="کوکی شکلاتی تازه وینیمی"
                  className="aspect-[4/4.8] h-full w-full object-cover sm:aspect-[5/4.5] lg:aspect-[4/5]"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={1200}
                  height={1450}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#321d17]/80 via-transparent to-white/5" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <span className="text-xs font-black tracking-[0.12em] text-[#f7e4dc]">
                    انتخاب روشن، سفارش ساده
                  </span>
                  <p className="mt-2 max-w-lg text-xl font-black leading-8 sm:text-2xl">
                    یک انتخاب شیرین، با جزئیاتی که پیش از سفارش می‌بینی.
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <DraggableMarquee items={marqueeItems} />

      <section className="home-color-wash section-padding relative overflow-hidden">
        <div className="container-custom">
          <CategoryShowcase
            limit={6}
            eyebrow="دسته‌های فعال فروشگاه"
            title="دسته‌بندی محصولات وینیمی"
            description="دسته موردنظرت را انتخاب کن و محصولات فعال، قیمت و جزئیات سفارش را ببین."
          />
        </div>
      </section>

      <section className="home-color-wash section-padding relative overflow-hidden bg-secondary/25">
        <div className="container-custom">
          <Reveal className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="editorial-label mb-5">انتخاب‌های پیشنهادی</span>
              <h2 className="modern-section-title">چند انتخاب برای شروع</h2>
            </div>
            <div className="max-w-xl lg:text-left">
              <p className="leading-8 text-muted-foreground">
                محصولات منتخب فروشگاه را ببین و برای تصویر کامل، قیمت، موجودی و
                جزئیات وارد صفحه محصول شو.
              </p>
              <Link
                to="/products"
                className="group mt-4 inline-flex items-center gap-2 font-black text-[#9b5545]"
              >
                مشاهده همه محصولات
                <ArrowLeft
                  size={18}
                  className="transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
              {Array.from({ length: 3 }, (_, index) => (
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
          ) : featuredProducts.length === 1 ? (
            <ProductCard product={featuredProducts[0]} variant="featured" />
          ) : featuredProducts.length > 1 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product, index) => (
                <Reveal key={product.id} delay={(index % 3) * 80}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="bento-card p-12 text-center">
              <Cookie className="mx-auto mb-4 text-[#b96552]" size={48} aria-hidden="true" />
              <h3 className="text-xl font-black text-foreground">
                هنوز محصول پیشنهادی فعالی ثبت نشده است
              </h3>
              <Link to="/products" className="mt-4 inline-flex font-black text-[#9b5545]">
                مشاهده فروشگاه
              </Link>
            </div>
          )}

          {error && (
            <p className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-center text-sm font-bold text-amber-900" role="status">
              دریافت تازه‌ترین اطلاعات کاتالوگ انجام نشد؛ لطفاً دوباره تلاش کن.
            </p>
          )}
        </div>
      </section>

      <section className="home-color-wash section-padding pt-10">
        <div className="container-custom">
          <Reveal className="mb-10 text-center">
            <span className="editorial-label mb-5">انتخاب براساس موقعیت</span>
            <h2 className="modern-section-title mx-auto">
              برای چه لحظه‌ای انتخاب می‌کنی؟
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-muted-foreground">
              مسیر نزدیک به موقعیتت را انتخاب کن و بعد میان گزینه‌های مرتبط تصمیم
              بگیر.
            </p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {occasionCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 80}>
                <Link
                  to={card.href}
                  className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#d88972]/25 bg-card shadow-card transition hover:-translate-y-1 hover:border-[#d88972]/60"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={card.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                      loading="lazy"
                      decoding="async"
                      width={900}
                      height={675}
                    />
                  </div>
                  <div className="flex flex-1 flex-col bg-[linear-gradient(145deg,#fffdf8_0%,#f7e4dc_150%)] p-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-black text-[#9b5545]">{card.eyebrow}</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d88972] text-[#321d17]">
                        <card.icon size={19} aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-6 text-2xl font-black leading-tight text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                      {card.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-black text-[#9b5545]">
                      {card.action}
                      <ArrowUpLeft size={17} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-color-wash section-padding overflow-hidden bg-secondary/20">
        <div className="container-custom">
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <span className="editorial-label mb-5">مسیر سفارش</span>
            <h2 className="modern-section-title">سه قدم روشن تا ثبت سفارش</h2>
            <p className="mt-5 leading-8 text-muted-foreground">
              از انتخاب تا پرداخت، اطلاعات لازم در همان مرحله‌ای نمایش داده می‌شود
              که به آن نیاز داری.
            </p>
          </Reveal>
          <div className="grid gap-4 lg:grid-cols-3">
            {orderSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 80}>
                <article className="h-full rounded-[2rem] border border-border/70 bg-card/85 p-6 shadow-soft">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7e4dc] text-[#9b5545]">
                      <step.icon size={22} aria-hidden="true" />
                    </span>
                    <span className="text-4xl font-black text-[#d88972]/35">{step.number}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-black text-foreground">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {brandConfig.trustPillars.map((pillar) => (
              <span key={pillar} className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-bold text-muted-foreground">
                <Check size={14} className="text-[#9b5545]" aria-hidden="true" />
                {pillar}
              </span>
            ))}
          </div>
        </div>
      </section>

      <DecisionSupportPanel />

      <section className="home-color-wash section-padding">
        <div className="container-custom">
          <Reveal className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="editorial-label mb-5">راهنماهای وینیمی</span>
              <h2 className="modern-section-title">قبل از انتخاب، کمی بیشتر بدان</h2>
              <p className="mt-5 leading-8 text-muted-foreground">
                راهنماهای کوتاه برای انتخاب هدیه، پذیرایی و نگهداری بهتر محصولات.
              </p>
            </div>
            <Link to="/blog" className="group inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[#d88972]/35 bg-[#f7e4dc] px-5 font-black text-[#6f3e33] lg:self-auto">
              مشاهده همه راهنماها
              <ArrowUpLeft size={18} aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {guideCards.map((guide, index) => (
              <Reveal key={guide.title} delay={index * 70}>
                <Link to={guide.href} className="group block h-full overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-card transition hover:-translate-y-1 hover:border-[#d88972]/55">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={guide.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" loading="lazy" width={900} height={560} />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-black text-[#9b5545]">{guide.label}</span>
                    <h3 className="mt-3 text-xl font-black leading-8 text-foreground">{guide.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{guide.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 font-black text-[#9b5545]">
                      خواندن راهنما
                      <ArrowUpLeft size={17} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-color-wash section-padding pt-8">
        <div className="container-custom">
          <Reveal className="home-category-cta-lines relative overflow-hidden rounded-[2.5rem] border border-[#d88972]/35 bg-[linear-gradient(125deg,#f7e4dc_0%,#fffdf8_58%,#d0e596_145%)] p-6 shadow-card sm:p-10 lg:p-14">
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d88972]/35 bg-white/65 px-4 py-2 text-xs font-black text-[#6f3e33]">
                  <Gift size={16} aria-hidden="true" />
                  انتخاب سریع‌تر از مسیر دسته‌ها
                </span>
                <h2 className="text-3xl font-black leading-[1.12] text-foreground sm:text-5xl lg:text-6xl">
                  از دسته مناسب شروع کن؛
                  <span className="block text-[#b96552]">جزئیات را کنار هم ببین.</span>
                </h2>
                <p className="mt-5 max-w-2xl leading-8 text-muted-foreground">
                  دسته‌ها مسیر رسیدن به محصول را کوتاه می‌کنند؛ در فروشگاه هم
                  می‌توانی همه انتخاب‌های فعال را جست‌وجو و مقایسه کنی.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/products" className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#6f3e33] px-8 font-black text-white transition hover:-translate-y-1 hover:bg-[#563128]">
                    مشاهده دسته‌بندی‌ها
                    <ArrowUpLeft size={19} aria-hidden="true" />
                  </Link>
                  <a href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#d88972]/40 bg-white/60 px-8 font-black text-[#46271f] transition hover:bg-white">
                    <MessageCircle size={19} aria-hidden="true" />
                    سؤال از پشتیبانی
                  </a>
                </div>
              </div>

              <div className="relative hidden min-h-[22rem] lg:block" aria-label="چند محصول فعال فروشگاه">
                {visualProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className={`absolute overflow-hidden rounded-[2rem] border border-[#d88972]/30 bg-white/80 p-2 shadow-2xl transition duration-500 hover:z-20 hover:scale-[1.035] ${
                      index === 0
                        ? "right-4 top-2 z-10 w-56 rotate-6"
                        : index === 1
                          ? "left-8 top-12 z-0 w-48 -rotate-6"
                          : "bottom-0 right-36 z-10 w-44 rotate-2"
                    }`}
                  >
                    <img src={product.images[0]?.url} alt={product.images[0]?.alt || product.name} className="aspect-square w-full rounded-[1.5rem] object-cover" loading="lazy" width={360} height={360} />
                    <p className="line-clamp-1 px-2 py-3 text-center text-xs font-black text-[#46271f]">
                      {product.name}
                    </p>
                  </Link>
                ))}
                {visualProducts.length === 0 && (
                  <img src={lifestyleBreaking} alt="نمای نزدیک کوکی وینیمی" className="absolute inset-0 h-full w-full rounded-[2rem] object-cover" loading="lazy" width={700} height={700} />
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
