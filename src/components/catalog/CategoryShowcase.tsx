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
  pastry: galleryBakery,
  "gift-boxes": galleryGiftBoxes,
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

  return (
    <div className="category-showcase-wash rounded-[2rem] border border-foreground/10 bg-white/55 p-4 shadow-[0_18px_55px_-46px_hsl(var(--foreground)/0.45)] sm:p-6 lg:p-7">
      {showHeader && (
        <Reveal className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="editorial-label mb-4">{eyebrow}</span>
            <h2 className="modern-section-title">{title}</h2>
            <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">
              {description}
            </p>
          </div>

          {showAllLink && (
            <Link
              to="/products"
              className="group inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[#d88972]/35 bg-[#f7e4dc]/80 px-5 font-black text-[#6f3e33] transition hover:border-[#b96552] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b96552] focus-visible:ring-offset-2 lg:self-auto"
            >
              مشاهده همه محصولات
              <ArrowUpLeft
                size={18}
                className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </Link>
          )}
        </Reveal>
      )}

      <ul
        className="winimi-snap-nav -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0"
        aria-label="دسته‌بندی محصولات وینیمی"
      >
        {visibleCategories.map((category, index) => {
          const image =
            category.image ||
            categoryVisuals[
              category.routeSlug as keyof typeof categoryVisuals
            ] ||
            categoryVisuals.cookies;

          return (
            <li
              key={category.routeSlug}
              className="min-w-0 basis-[44%] shrink-0 snap-start sm:basis-[30%] md:basis-[23%] lg:basis-auto lg:shrink"
            >
              <Reveal className="h-full" delay={(index % 6) * 45}>
                <Link
                  to={`/products/category/${category.routeSlug}`}
                  className={`group flex h-full flex-col rounded-[1.5rem] border border-foreground/10 bg-white/70 ${
                    compact ? "p-2" : "p-2.5"
                  } transition duration-300 hover:-translate-y-0.5 hover:border-[#91b33f]/60 hover:bg-[#d0e596]/70 hover:shadow-[0_18px_40px_-30px_hsl(var(--foreground)/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#91b33f] focus-visible:ring-offset-2`}
                  aria-label={`مشاهده محصولات دسته ${category.name}`}
                >
                  <span className="block overflow-hidden rounded-[1.1rem] bg-[#f7f9ee]">
                    <img
                      src={image}
                      alt={`محصولات دسته ${category.name} وینیمی`}
                      className="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={480}
                    />
                  </span>

                  <span
                    className={`flex min-h-14 items-center justify-center px-2 text-center font-black leading-6 text-foreground ${
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
