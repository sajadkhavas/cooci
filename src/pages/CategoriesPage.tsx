import { ArrowLeft, Gift, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryShowcase } from "@/components/catalog/CategoryShowcase";
import { Reveal } from "@/components/motion/Reveal";
import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";
import { categoryContents } from "@/data/categoriesContent";

const startingPoints = [
  {
    icon: Search,
    title: "برای انتخاب روزمره",
    description:
      "از کوکی‌ها شروع کن و طعم، وزن، قیمت و گزینه‌های فعال را کنار هم ببین.",
    href: "/products/category/cookies",
    action: "دیدن کوکی‌ها",
  },
  {
    icon: Users,
    title: "برای پذیرایی و دورهمی",
    description:
      "مینی‌کوکی و محصولات چندتایی مسیر سریع‌تری برای سفارش‌های چندنفره هستند.",
    href: "/products/category/mini-cookies",
    action: "گزینه‌های پذیرایی",
  },
  {
    icon: Gift,
    title: "برای هدیه و مناسبت",
    description:
      "باکس‌های فعال و راهنمای هدیه را ببین و بعد براساس تعداد و موقعیت انتخاب کن.",
    href: "/products/category/gift-boxes",
    action: "دیدن باکس هدیه",
  },
];

const CategoriesPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "دسته‌بندی محصولات وینیمی",
    description:
      "دسترسی به دسته‌های کوکی، مینی‌کوکی، محصولات رژیمی، کیک، چیزکیک، رول و کروسان و باکس هدیه.",
    url: `${brandConfig.website}/categories`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categoryContents.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: category.name,
        url: `${brandConfig.website}/products/category/${category.slug}`,
      })),
    },
  };

  return (
    <>
      <SEO
        title="دسته‌بندی محصولات"
        description="دسته‌بندی محصولات وینیمی؛ کوکی، مینی کوکی، رژیمی و بدون قند افزوده، کیک، چیزکیک، رول و کروسان و باکس هدیه."
        schema={schema}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/55 to-background py-12 sm:py-16 lg:py-20">
        <div className="soft-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="container-custom relative">
          <Breadcrumbs
            className="mb-8"
            items={[{ name: "خانه", href: "/" }, { name: "دسته‌بندی‌ها" }]}
          />
          <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <span className="editorial-label mb-5">Find your starting point</span>
              <h1 className="max-w-5xl text-[clamp(2.8rem,7vw,7rem)] font-black leading-[0.95] tracking-[-0.065em] text-foreground">
                دسته‌بندی محصولات وینیمی؛
                <span className="block text-gradient-modern">از چیزی که دوست داری شروع کن.</span>
              </h1>
            </Reveal>
            <Reveal delay={100}>
              <p className="max-w-2xl text-base leading-9 text-muted-foreground sm:text-lg">
                لازم نیست میان همه محصولات بگردی. ابتدا نوع محصول یا موقعیت خرید را انتخاب کن؛ بعد قیمت، گزینه‌ها و جزئیات هر محصول را در همان دسته مقایسه کن.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-padding pb-6">
        <div className="container-custom">
          <div className="grid gap-4 lg:grid-cols-3">
            {startingPoints.map((item, index) => (
              <Reveal key={item.href} delay={index * 80}>
                <Link
                  to={item.href}
                  className="group flex h-full flex-col rounded-[2rem] border border-border/70 bg-card p-6 shadow-soft transition duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card sm:p-7"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl">
                    <item.icon size={21} aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 text-2xl font-black text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-8 text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-black text-primary">
                    {item.action}
                    <ArrowLeft
                      size={17}
                      className="transition-transform group-hover:-translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-10">
        <div className="container-custom">
          <CategoryShowcase
            title="همه مسیرهای اصلی فروشگاه"
            description="هر کارت یک صفحه مستقل و قابل اشتراک دارد؛ بنابراین می‌توانی مستقیم وارد همان گروه شوی و محصولات مرتبط را ببینی."
            showAllLink={false}
          />
        </div>
      </section>

      <section className="section-padding pt-4">
        <div className="container-custom">
          <Reveal className="rounded-[2.4rem] bg-primary p-7 text-primary-foreground shadow-[0_45px_120px_-55px_hsl(var(--primary)/0.95)] sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:p-12">
            <div>
              <span className="editorial-label mb-5 border-white/15 bg-white/10 text-accent">
                Full catalogue
              </span>
              <h2 className="text-3xl font-black leading-tight sm:text-5xl">
                هنوز مطمئن نیستی؟ همه محصولات را یک‌جا ببین.
              </h2>
              <p className="mt-4 max-w-2xl leading-8 text-primary-foreground/65">
                جست‌وجو، مرتب‌سازی و فیلترهای فروشگاه برای زمانی هستند که می‌خواهی چند دسته را هم‌زمان مقایسه کنی.
              </p>
            </div>
            <Link
              to="/products"
              className="mt-7 inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-accent px-8 font-black text-accent-foreground transition hover:-translate-y-1 lg:mt-0"
            >
              ورود به همه محصولات
              <ArrowLeft size={19} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default CategoriesPage;
