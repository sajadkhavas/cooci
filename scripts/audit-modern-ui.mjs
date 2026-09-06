import { readFileSync } from "node:fs";

const errors = [];
const read = (path) => readFileSync(path, "utf8");

const files = {
  index: "src/index.css",
  modernPages: "src/styles/modern-pages.css",
  main: "src/root.tsx",
  layout: "src/components/layout/SiteLayout.tsx",
  header: "src/components/layout/Header.tsx",
  footer: "src/components/layout/Footer.tsx",
  home: "src/pages/HomePage.tsx",
  gift: "src/pages/GiftPage.tsx",
  occasionSelector: "src/components/home/OccasionSelector.tsx",
  homeColdGallery: "src/components/home/HomeColdGallery.tsx",
  products: "src/pages/ProductsPage.tsx",
  categoryShowcase: "src/components/catalog/CategoryShowcase.tsx",
  categoriesContent: "src/data/categoriesContent.ts",
  storefrontContent: "src/lib/storefront-content.ts",
  homeProductRail: "src/components/home/HomeProductRail.tsx",
  productCard: "src/components/ProductCard.tsx",
  reveal: "src/components/motion/Reveal.tsx",
  progress: "src/components/layout/ScrollProgress.tsx",
};

const sources = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, read(path)]),
);

const requireText = (file, text, description = text) => {
  if (!sources[file].includes(text)) {
    errors.push(`${files[file]}: missing ${description}.`);
  }
};

const forbidText = (file, text, description = text) => {
  if (sources[file].includes(text)) {
    errors.push(`${files[file]}: contains forbidden ${description}.`);
  }
};

forbidText("index", "@import url(", "render-blocking remote font import");
for (const requirement of [
  ".glass-panel",
  ".bento-card",
  ".reveal.is-visible",
  "prefers-reduced-motion",
  ".ambient-layer",
  ".scroll-progress",
]) {
  requireText("index", requirement);
}

for (const requirement of [
  'aria-roledescription="carousel"',
  'aria-label="محصولات یخچالی وینیمی"',
  'aria-live="polite"',
  "onKeyDown={handleKeyDown}",
  "selectColdGalleryProducts",
  "نیازمند نگهداری سرد",
  "مشاهده محصول",
  "برای دیدن محصولات دیگر، تصویر را بکشید",
  "lg:grid-cols-[minmax(0,1fr)_15.5rem]",
  "#e5f0d6_100%",
]) {
  requireText(
    "homeColdGallery",
    requirement,
    `accessible refrigerated gallery contract: ${requirement}`,
  );
}
forbidText(
  "homeColdGallery",
  "setInterval",
  "automatic refrigerated-gallery rotation",
);

requireText(
  "main",
  'import "./styles/modern-pages.css"',
  "modern routed-page stylesheet",
);
requireText("layout", "<ScrollProgress", "global scroll progress");
requireText("layout", "ambient-layer", "ambient backdrop markup");
requireText("layout", "page-enter", "route transition wrapper");

for (const requirement of [
  'role="dialog"',
  'aria-modal="true"',
  "focusableSelector",
  'aria-controls="mobile-navigation-dialog"',
  "backdrop-blur-2xl",
]) {
  requireText(
    "header",
    requirement,
    `modern accessible navigation contract: ${requirement}`,
  );
}
requireText(
  "header",
  'href: "/products"',
  "single shop desktop/mobile navigation",
);
forbidText(
  "header",
  'href: "/categories"',
  "duplicate category-index navigation",
);

requireText(
  "footer",
  "buildVisibleCatalogCategories",
  "backend-authoritative modern footer category directory",
);
requireText(
  "footer",
  'href: `/products/category/${category.routeSlug}`',
  "canonical modern footer category route builder",
);
for (const validSlug of ["diet-diabetic", "cakes"]) {
  requireText(
    "categoriesContent",
    `slug: "${validSlug}"`,
    `modern footer editorial category fallback ${validSlug}`,
  );
}
requireText("footer", "content.footer.watermark", "backend-driven editorial footer wordmark renderer");
requireText("storefrontContent", '"WINIMI BAKERY"', "editorial footer wordmark fallback");
forbidText("footer", 'to="/categories"', "duplicate category-index footer CTA");
forbidText("footer", 'href: "/categories"', "duplicate category-index footer link");
requireText("gift", "gift.primary.href", "backend-driven gift page safe shop CTA renderer");
requireText(
  "storefrontContent",
  'internalPath(settings, ["gift", "hero_primary_href"], "/products")',
  "gift page safe shop fallback CTA",
);
forbidText(
  "gift",
  "/products/category/gift-boxes",
  "unpublished gift category CTA",
);

for (const requirement of [
  "<Reveal",
  "<DraggableMarquee",
  "<CategoryShowcase",
  "<OccasionSelector",
  "product-rail-background.webp",
  "<HomeProductRail",
  "rgba(255, 253, 247, 0.58)",
  "lg:min-h-[68svh]",
  "lg:grid-cols-[1fr_1fr]",
  "gap-6 sm:gap-8",
  "aspect-[4/3.15]",
  "text-[#667c22]",
  "lg:max-w-[12ch]",
]) {
  requireText(
    "home",
    requirement,
    `modern product-led homepage contract: ${requirement}`,
  );
}
requireText("home", "home.hero.titleLine1", "backend-driven modern homepage title renderer");
requireText("home", "home.hero.primary.label", "backend-driven modern homepage primary CTA renderer");
requireText("storefrontContent", '"طعم خوب برای"', "modern product-led homepage title fallback");
requireText("storefrontContent", '"مشاهده محصولات"', "modern homepage primary CTA fallback");

for (const requirement of [
  "occasion.items",
  "occasion.title",
  "modern-section-title",
  "aria-pressed={active}",
]) {
  requireText(
    "occasionSelector",
    requirement,
    `modern occasion-selector contract: ${requirement}`,
  );
}
requireText(
  "storefrontContent",
  '"برای چه لحظه‌ای انتخاب می‌کنی؟"',
  "modern occasion-selector title fallback",
);
forbidText("home", "داده نهایی با بک‌اند", "developer-facing homepage message");
forbidText("home", "وضعیت داده", "developer-facing homepage message");
forbidText("home", 'to="/categories"', "standalone category-index link");
forbidText(
  "home",
  'aria-label="دسته‌های فعال فروشگاه"',
  "duplicated category chips inside the hero",
);
forbidText("home", "min-h-[74svh]", "oversized legacy hero height");

for (const requirement of [
  "group/rail",
  "group-hover/rail:opacity-100",
  "bg-[#31520f]",
  "وضعیت نمایش محصولات پیشنهادی",
  'role="region"',
  'aria-roledescription="carousel"',
  'aria-labelledby="home-products-heading"',
  'aria-controls="home-product-rail"',
  'id="home-product-rail"',
]) {
  requireText(
    "homeProductRail",
    requirement,
    `refined product rail controls: ${requirement}`,
  );
}

for (const requirement of [
  "productRailBackground",
  "bg-[#fffdf7]",
  "sm:max-w-4xl",
]) {
  requireText(
    "productCard",
    requirement,
    `branded quick-view surface: ${requirement}`,
  );
}

for (const requirement of [
  "<CategoryShowcase",
  'aria-label="دسته‌بندی محصولات"',
  "categoryNavigation",
  "CatalogPagination",
  "hasNonCanonicalFilters",
  "rounded-3xl",
  "heading-1",
]) {
  requireText("products", requirement, `unified shop contract: ${requirement}`);
}

for (const requirement of [
  "categoryVisuals",
  "getCuratedCategoryImage",
  "resolvedLimit",
  ".slice(0, resolvedLimit)",
  "desktopColumns",
  "lg:grid-cols-5",
  "lg:grid-cols-6",
  "winimi-snap-nav",
  "snap-mandatory",
  "basis-[44%]",
  "hover:bg-[#d0e596]/70",
  "group-hover:scale-[1.03]",
  "rounded-[1.15rem]",
  "text-2xl",
]) {
  requireText(
    "categoryShowcase",
    requirement,
    `compact accessible category-rail contract: ${requirement}`,
  );
}
forbidText(
  "categoryShowcase",
  "category.productCount",
  "legacy category count badge",
);

for (const requirement of [
  "getPublicProductBadges",
  "getStockPresentation",
  "isProductInventoryVerified",
  "isProductMediaVerified",
  "rounded-[2rem]",
  "group-hover:scale-[1.035]",
  'variant?: "default" | "featured" | "rail"',
  "پیش‌نمایش سریع",
  "<DialogContent",
  "افزودن به سبد",
]) {
  requireText(
    "productCard",
    requirement,
    `modern product-card contract: ${requirement}`,
  );
}
forbidText(
  "productCard",
  "روش‌های تحویل در مرحله سفارش نمایش داده می‌شوند",
  "verbose delivery-stage product-card copy",
);

for (const requirement of [
  "AUTOPLAY_DELAY = 6000",
  "IntersectionObserver",
  "prefers-reduced-motion: reduce",
  "visibilitychange",
  "onMouseEnter={stopAutoPlay}",
  "onFocusCapture={stopAutoPlay}",
  "onPointerDown={stopAutoPlay}",
  "onTouchStart={stopAutoPlay}",
  "basis-[86%]",
  "xl:basis-[23.5%]",
  'aria-live="off"',
  "توقف حرکت خودکار",
]) {
  requireText(
    "homeProductRail",
    requirement,
    `accessible shoppable product-rail contract: ${requirement}`,
  );
}

requireText(
  "reveal",
  "IntersectionObserver",
  "dependency-free reveal observer",
);
requireText(
  "reveal",
  "prefers-reduced-motion",
  "reveal reduced-motion support",
);
requireText(
  "progress",
  'aria-hidden="true"',
  "decorative progress accessibility",
);
requireText(
  "modernPages",
  'nav[aria-label="مراحل ثبت سفارش"]',
  "modern checkout progress styling",
);
requireText("modernPages", "main details[open]", "modern FAQ/details styling");

if (errors.length) {
  console.error(`Modern UI audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Modern UI audit passed: ${Object.keys(files).length} design-system contracts verified, including Backend-driven storefront copy and one category-aware shop UI.`,
);
