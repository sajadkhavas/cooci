import {
  ArrowUpLeft,
  Cookie,
  Gift,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import categoryCookies from "@/assets/cookies/category-homemade-cookies-v2.webp";
import galleryBakery from "@/assets/cookies/gallery-bakery-interior.jpg";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";
import galleryGiftBoxes from "@/assets/cookies/gallery-gift-boxes.jpg";
import heroImage from "@/assets/cookies/hero-main.jpg";
import lifestyleMilk from "@/assets/cookies/lifestyle-milk.jpg";
import lifestyleTwine from "@/assets/cookies/lifestyle-twine.jpg";
import { categoryContents } from "@/data/categoriesContent";
import { useCatalogCategories } from "@/hooks/useCatalog";
import { buildVisibleCatalogCategories } from "@/lib/catalog-category-visibility";
import { Reveal } from "@/components/motion/Reveal";

const categoryVisuals = {
  cookies: { image: categoryCookies, icon: Cookie },
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
  title = "از دسته‌ای شروع کن که به انتخابت نزدیک‌تر است",
  description =
    "هر دسته محصولات مرتبط را کنار هم می‌گذارد تا تصویر، قیمت، موجودی و شرایط سفارش را ساده‌تر مقایسه کنی.",
  eyebrow = "دسته‌های فعال فروشگاه",
  limit,
  excludeSlug,
  showHeader = true,
  showAllLink = true,
  compact = false,
}: CategoryShowcaseProps) => {
  const { categories } = useCatalogCategories();
  const visibleCategories = buildVisibleCatalogCategories(
    categoryContents,
    categories,
  )
    .filter((category) => category.routeSlug !== excludeSlug)
    .slice(0, limit);
  const isSingleCategory = visibleCategories.length === 1;

  if (visibleCategories.length === 0) return null;

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
              className="group inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[#d88972]/35 bg-[#f7e4dc] px-5 font-black text-[#6f3e33] transition hover:border-[#b96552] hover:bg-white lg:self-auto"
            >
              مشاهده همه دسته‌بندی‌ها
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
          isSingleCategory
            ? "grid-cols-1"
            : compact
              ? "sm:grid-cols-2 xl:grid-cols-3"
              : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {visibleCategories.map((category, index) => {
          const visual =
            categoryVisuals[
              category.routeSlug as keyof typeof categoryVisuals
            ] ?? categoryVisuals.cookies;
          const Icon = visual.icon;
          const editorial = category.editorial;

          return (
            <Reveal key={category.routeSlug} delay={(index % 3) * 70}>
              <Link
                to={`/products/category/${category.routeSlug}`}
                className={`group grid h-full overflow-hidden rounded-[2rem] border border-[#d88972]/25 bg-card shadow-card transition duration-500 hover:-translate-y-1 hover:border-[#d88972]/60 hover:shadow-hover ${
                  isSingleCategory
                    ? "lg:grid-cols-[1.35fr_0.65fr]"
                    : "grid-cols-1"
                }`}
                aria-label={`مشاهده دسته ${category.name}`}
              >
                <div
                  className={`relative overflow-hidden bg-muted ${
                    isSingleCategory
                      ? "min-h-[22rem] lg:min-h-[30rem]"
                      : compact
                        ? "aspect-[4/3]"
                        : "aspect-[5/4]"
                  }`}
                >
                  <img
                    src={category.image || visual.image}
                    alt={`تصویر دسته ${category.name}`}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={900}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#321d17]/55 via-transparent to-white/5" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white sm:p-6">
                    <span className="rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-[10px] font-black backdrop-blur-md">
                      {editorial?.eyebrow || "فروشگاه وینیمی"}
                    </span>
                    {typeof category.productCount === "number" &&
                      category.productCount > 0 && (
                        <span className="rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-xs font-black backdrop-blur-md">
                          {category.productCount.toLocaleString("fa-IR")} محصول فعال
                        </span>
                      )}
                  </div>
                </div>

                <div className="flex min-h-[18rem] flex-col justify-between bg-[linear-gradient(145deg,#fffdf8_0%,#f7e4dc_135%)] p-6 sm:p-8">
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d88972] text-[#321d17] shadow-lg">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <h3 className="mt-7 text-2xl font-black leading-tight text-foreground sm:text-3xl">
                      {category.name}
                    </h3>
                    <p className="mt-4 text-sm leading-8 text-muted-foreground">
                      {category.description ||
                        "محصولات فعال این دسته را ببین و جزئیات هر انتخاب را مقایسه کن."}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 font-black text-[#9b5545]">
                    دیدن محصولات این دسته
                    <ArrowUpLeft
                      size={18}
                      className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};
