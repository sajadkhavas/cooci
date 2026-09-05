import { ArrowUpLeft } from "lucide-react";
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
  cookies: categoryCookies,
  "mini-cookies": galleryBaking,
  "diet-diabetic": lifestyleTwine,
  cakes: heroImage,
  cheesecakes: lifestyleMilk,
  pastry: galleryBaking,
  "gift-boxes": galleryGiftBoxes,
} as const;

const getCuratedCategoryImage = (
  routeSlug: string,
  name: string,
  backendImage?: string,
) => {
  const curated =
    categoryVisuals[routeSlug as keyof typeof categoryVisuals];

  if (curated) return curated;
  if (/رول|کروسان|خمیر/.test(name)) return categoryVisuals.pastry;
  if (/مینی/.test(name)) return categoryVisuals["mini-cookies"];
  if (/رژیمی|قند/.test(name)) return categoryVisuals["diet-diabetic"];
  if (/چیزکیک/.test(name)) return categoryVisuals.cheesecakes;
  if (/کیک|دسر/.test(name)) return categoryVisuals.cakes;
  if (/هدیه|باکس/.test(name)) return categoryVisuals["gift-boxes"];
  if (/کوکی/.test(name)) return categoryVisuals.cookies;

  return backendImage || galleryBakery;
};

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
  title = "دسته‌بندی محصولات وینیمی",
  description =
    "دسته موردنظرت را انتخاب کن و محصولات فعال، قیمت و جزئیات سفارش را ببین.",
  eyebrow = "دسته‌های فعال فروشگاه",
  limit = 6,
  excludeSlug,
  showHeader = true,
  showAllLink = true,
  compact = false,
}: CategoryShowcaseProps) => {
  const { categories } = useCatalogCategories();
  const resolvedLimit = Math.min(Math.max(limit, 0), 6);
  const visibleCategories = buildVisibleCatalogCategories(
    categoryContents,
    categories,
  )
    .filter((category) => category.routeSlug !== excludeSlug)
    .slice(0, resolvedLimit);

  if (visibleCategories.length === 0) return null;

  const desktopColumns =
    visibleCategories.length >= 6
      ? "lg:grid-cols-6"
      : visibleCategories.length === 5
        ? "lg:grid-cols-5"
        : visibleCategories.length === 4
          ? "lg:grid-cols-4"
          : visibleCategories.length === 3
            ? "lg:grid-cols-3"
            : visibleCategories.length === 2
              ? "lg:grid-cols-2"
              : "lg:grid-cols-1";

  return (
    <div className="category-showcase-wash rounded-[1.5rem] border border-foreground/10 bg-white/55 p-4 shadow-[0_16px_46px_-42px_hsl(var(--foreground)/0.42)] sm:p-5 lg:p-6">
      {showHeader && (
        <Reveal className="mb-5 flex flex-col gap-3 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="editorial-label mb-2">{eyebrow}</span>
            <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>

          {showAllLink && (
            <Link
              to="/products"
              className="group inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-[#d88972]/30 bg-[#f7e4dc]/70 px-4 text-sm font-black text-[#6f3e33] transition hover:border-[#b96552] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b96552] focus-visible:ring-offset-2 lg:self-auto"
            >
              مشاهده همه محصولات
              <ArrowUpLeft
                size={17}
                className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </Link>
          )}
        </Reveal>
      )}

      <ul
        className={`winimi-snap-nav -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 lg:mx-0 lg:grid ${desktopColumns} lg:overflow-visible lg:px-0 lg:pb-0`}
        aria-label="دسته‌بندی محصولات وینیمی"
      >
        {visibleCategories.map((category, index) => {
          const image = getCuratedCategoryImage(
            category.routeSlug,
            category.name,
            category.image,
          );

          return (
            <li
              key={category.routeSlug}
              className="min-w-0 basis-[44%] shrink-0 snap-start sm:basis-[30%] md:basis-[23%] lg:basis-auto lg:shrink"
            >
              <Reveal className="h-full" delay={(index % 6) * 45}>
                <Link
                  to={`/products/category/${category.routeSlug}`}
                  className={`group flex h-full flex-col rounded-[1.15rem] border border-foreground/10 bg-white/72 ${
                    compact ? "p-1.5" : "p-2"
                  } transition duration-300 hover:-translate-y-0.5 hover:border-[#91b33f]/55 hover:bg-[#d0e596]/70 hover:shadow-[0_16px_34px_-28px_hsl(var(--foreground)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#91b33f] focus-visible:ring-offset-2`}
                  aria-label={`مشاهده محصولات دسته ${category.name}`}
                >
                  <span className="block overflow-hidden rounded-[0.85rem] bg-[#f7f9ee]">
                    <img
                      src={image}
                      alt={`محصولات دسته ${category.name} وینیمی`}
                      className="aspect-[5/4] h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={512}
                    />
                  </span>

                  <span
                    className={`flex min-h-11 items-center justify-center px-1.5 py-1 text-center font-black leading-5 text-foreground ${
                      compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"
                    }`}
                  >
                    {category.name}
                  </span>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
