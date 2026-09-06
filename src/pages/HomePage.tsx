import { ArrowLeft, Cookie, Gift, Sparkles } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { CategoryShowcase } from "@/components/catalog/CategoryShowcase";
import {
  buildHomeDecisionFaqSchema,
  DecisionSupportPanel,
} from "@/components/home/DecisionSupportPanel";
import { DraggableMarquee } from "@/components/home/DraggableMarquee";
import { EditorialGuides } from "@/components/home/EditorialGuides";
import { HomeColdGallery } from "@/components/home/HomeColdGallery";
import { HomeProductRail } from "@/components/home/HomeProductRail";
import { OccasionSelector } from "@/components/home/OccasionSelector";
import { Reveal } from "@/components/motion/Reveal";
import { SEO } from "@/components/SEO";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";
import { HOME_CHILLED_QUERY } from "@/lib/home-cold-gallery";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";
import productRailBackground from "@/assets/product-rail-background.webp";

const HomePage = () => {
  const { content } = useStorefrontSettings();
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const { products, isLoading, error } = useCatalogProducts();
  const {
    products: chilledProducts,
    isLoading: chilledProductsLoading,
  } = useCatalogProducts(HOME_CHILLED_QUERY);
  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .slice(0, 6);
  const home = content.home;
  const faqSchema = buildHomeDecisionFaqSchema(loaderData?.faqs ?? []);

  return (
    <>
      <SEO
        title={home.metaTitle}
        description={home.metaDescription}
        schema={faqSchema}
      />

      <section className="home-color-wash relative overflow-hidden pb-12 pt-7 sm:pb-18 sm:pt-10 lg:pb-20 lg:pt-14">
        <div className="soft-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
        <div className="float-slower pointer-events-none absolute -right-24 top-16 h-56 w-56 rounded-full bg-[#d0e596]/25 blur-3xl" aria-hidden="true" />
        <div className="float-slow pointer-events-none absolute -left-20 bottom-12 h-48 w-48 rounded-full bg-[#f3c9b9]/25 blur-3xl" aria-hidden="true" />
        <div className="container-custom relative">
          <div className="grid items-center gap-6 sm:gap-8 lg:min-h-[68svh] lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="relative z-10 order-1">
              <Reveal>
                <span className="editorial-label mb-5 border-[#b8cf79]/60 bg-white/85 text-[#667c22] shadow-[0_10px_30px_-22px_rgba(46,70,15,0.65)] sm:mb-6">
                  <Sparkles size={15} className="text-[#b96552]" aria-hidden="true" />
                  {home.hero.eyebrow}
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="max-w-5xl text-[clamp(2.55rem,6.2vw,6.25rem)] font-black leading-[1.04] tracking-[-0.055em] text-foreground lg:max-w-[12ch] lg:text-[clamp(4rem,5.25vw,5.75rem)]">
                  {home.hero.titleLine1}
                  <span className="block text-[#b96552]">
                    {home.hero.titleLine2}
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-7 sm:text-lg sm:leading-9">
                  {home.hero.description}
                </p>
              </Reveal>
              <Reveal delay={220}>
                <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                  <Link
                    to={home.hero.primary.href}
                    className="btn-primary group inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-black sm:px-9"
                  >
                    {home.hero.primary.label}
                    <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                  </Link>
                  <Link
                    to={home.hero.secondary.href}
                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#d88972]/45 bg-[#f7e4dc] px-7 text-base font-black text-[#6f3e33] transition hover:border-[#b96552] hover:bg-white sm:px-9"
                  >
                    <Gift size={19} aria-hidden="true" />
                    {home.hero.secondary.label}
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal className="order-2" delay={100}>
              <figure className="group/hero relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/55 bg-card shadow-[0_38px_100px_-48px_hsl(var(--foreground)/0.5)] sm:rounded-[3rem] lg:max-w-none">
                <img
                  src={home.hero.imageUrl}
                  alt={home.hero.imageAlt}
                  className="aspect-[4/3.15] h-full w-full object-cover transition duration-700 group-hover/hero:scale-[1.025] sm:aspect-[5/4] lg:aspect-[4/4.7]"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={1200}
                  height={1450}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#321d17]/80 via-transparent to-white/5" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                  <span className="text-xs font-black tracking-[0.12em] text-[#f7e4dc]">
                    {home.hero.captionLabel}
                  </span>
                  <p className="mt-2 max-w-lg text-xl font-black leading-8 sm:text-2xl">
                    {home.hero.captionText}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <DraggableMarquee items={home.marquee} />

      <section className="home-color-wash relative overflow-hidden py-10 sm:py-12 lg:py-14">
        <div className="container-custom">
          <CategoryShowcase
            limit={6}
            eyebrow={home.categories.eyebrow}
            title={home.categories.title}
            description={home.categories.description}
          />
        </div>
      </section>

      <section
        className="relative overflow-hidden border-y border-primary/8 bg-[#fbf8ef] py-12 sm:py-14 lg:py-16"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 253, 247, 0.58), rgba(255, 253, 247, 0.66)), url(${productRailBackground})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        aria-labelledby="home-products-heading"
      >
        <div className="container-custom relative">
          <Reveal className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="editorial-label mb-3">{home.featured.eyebrow}</span>
              <h2 id="home-products-heading" className="text-3xl font-black leading-tight text-foreground sm:text-4xl">
                {home.featured.title}
              </h2>
            </div>
            <div className="max-w-xl lg:text-left">
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                {home.featured.description}
              </p>
              <Link
                to={home.featured.cta.href}
                className="group mt-4 inline-flex items-center gap-2 font-black text-[#9b5545]"
              >
                {home.featured.cta.label}
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          {isLoading ? (
            <div className="flex gap-4 overflow-hidden" aria-busy="true" aria-label="در حال دریافت محصولات پیشنهادی">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="basis-[86%] shrink-0 overflow-hidden rounded-[1.35rem] border border-border/60 bg-white/80 sm:basis-[48%] lg:basis-[31%] xl:basis-[23.5%]">
                  <div className="aspect-[5/4] animate-pulse bg-muted" />
                  <div className="space-y-3 p-4">
                    <div className="h-6 w-3/4 animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                    <div className="h-12 w-full animate-pulse rounded-2xl bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <HomeProductRail products={featuredProducts} />
          ) : (
            <div className="bento-card p-12 text-center">
              <Cookie className="mx-auto mb-4 text-[#b96552]" size={48} aria-hidden="true" />
              <h3 className="text-xl font-black text-foreground">
                هنوز محصول پیشنهادی فعالی ثبت نشده است
              </h3>
              <Link to={home.featured.cta.href} className="mt-4 inline-flex font-black text-[#9b5545]">
                {home.featured.cta.label}
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

      {chilledProductsLoading ? (
        <section className="cold-gallery-shell border-y border-[#9eb9a5]/25 py-14" aria-busy="true" aria-label="در حال دریافت محصولات یخچالی">
          <div className="container-custom">
            <div className="mx-auto mb-8 h-12 w-72 animate-pulse rounded-full bg-[#cfded3]" />
            <div className="h-[34rem] animate-pulse rounded-[2rem] bg-[#c6d8cd]" />
          </div>
        </section>
      ) : (
        <HomeColdGallery products={chilledProducts} />
      )}

      <OccasionSelector />
      <DecisionSupportPanel />
      <EditorialGuides />
    </>
  );
};

export default HomePage;
