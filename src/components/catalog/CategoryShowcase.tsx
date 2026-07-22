import { ArrowUpLeft, Cookie, Gift, Package, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router";
import galleryBakery from "@/assets/cookies/gallery-bakery-interior.jpg";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";
import galleryGiftBoxes from "@/assets/cookies/gallery-gift-boxes.jpg";
import heroImage from "@/assets/cookies/hero-main.jpg";
import lifestyleBreaking from "@/assets/cookies/lifestyle-breaking.jpg";
import lifestyleMilk from "@/assets/cookies/lifestyle-milk.jpg";
import lifestyleTwine from "@/assets/cookies/lifestyle-twine.jpg";
import { categoryContents } from "@/data/categoriesContent";
import { useCatalogCategories } from "@/hooks/useCatalog";
import { Reveal } from "@/components/motion/Reveal";

const categoryVisuals = {
  cookies: { image: lifestyleBreaking, icon: Cookie },
  "mini-cookies": { image: galleryBaking, icon: Sparkles },
  "diet-diabetic": { image: lifestyleTwine, icon: ShieldCheck },
  cakes: { image: heroImage, icon: Package },
  cheesecakes: { image: lifestyleMilk, icon: Package },
  pastry: { image: galleryBakery, icon: Cookie },
  "gift-boxes": { image: galleryGiftBoxes, icon: Gift },
} as const;

interface CategoryShowcaseProps {
  title?: string;
  description?: string;
  eyebrow?: string;
  limit?: number;
  excludeSlug?: string;
  showHeader?: boolean;
  showAllLink?: boolean;
  compact?: boolean;
}

export const CategoryShowcase = ({
  title = "دسته‌ای را انتخاب کن که به چیزی که می‌خواهی نزدیک‌تر است",
  description =
    "از کوکی و مینی‌کوکی تا کیک، چیزکیک، محصولات خمیری و باکس هدیه؛ هر دسته مسیر کوتاه‌تری برای رسیدن به انتخاب مناسب می‌سازد.",
  eyebrow = "Browse by category",
  limit,
  excludeSlug,
  showHeader = true,
  showAllLink = true,
  compact = false,
}: CategoryShowcaseProps) => {
  const { categories } = useCatalogCategories();
  const visibleCategories = categoryContents
    .filter((category) => category.slug !== excludeSlug)
    .slice(0, limit);

  return (
    <div>
      {showHeader && (
        <Reveal className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="editorial-label mb-5">{eyebrow}</span>
            <h2 className="modern-section-title">{title}</h2>
            <p className="mt-5 max-w-2xl leading-8 text-muted-foreground">
              {description}
            </p>
          </div>
          {showAllLink && (
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 self-start font-black text-primary lg:self-auto"
            >
              مشاهده همه دسته‌بندی‌ها در فروشگاه
              <ArrowUpLeft
                size={18}
                className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </Link>
          )}
        </Reveal>
      )}

      <div
        className={`grid gap-5 ${
          compact ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {visibleCategories.map((content, index) => {
          const visual =
            categoryVisuals[content.slug as keyof typeof categoryVisuals] ??
            categoryVisuals.cookies;
          const Icon = visual.icon;
          const backendCategory = categories.find(
            (category) => category.slug === content.productCategorySlug,
          );
          const productCount = backendCategory?.productCount;

          return (
            <Reveal key={content.slug} delay={(index % 3) * 70}>
              <Link
                to={`/products/category/${content.slug}`}
                className={`group relative block overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-soft transition duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card ${
                  compact ? "min-h-[19rem]" : "min-h-[22rem]"
                }`}
                aria-label={`مشاهده دسته ${content.name}`}
              >
                <img
                  src={backendCategory?.image || visual.image}
                  alt={`تصویر دسته ${content.name}`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  width={900}
                  height={900}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/62 to-primary/5" />
                <div
                  className={`relative flex h-full flex-col justify-between p-6 text-primary-foreground sm:p-7 ${
                    compact ? "min-h-[19rem]" : "min-h-[22rem]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]">
                      {content.eyebrow}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-xl">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                  </div>

                  <div className="mt-20">
                    {typeof productCount === "number" && productCount > 0 && (
                      <span className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
                        {productCount.toLocaleString("fa-IR")} محصول فعال
                      </span>
                    )}
                    <h3 className="text-2xl font-black leading-tight sm:text-3xl">
                      {content.name}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-primary-foreground/72">
                      {content.cardDescription}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-accent">
                      دیدن این دسته
                      <ArrowUpLeft
                        size={17}
                        className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};
