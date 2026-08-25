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
  products: "src/pages/ProductsPage.tsx",
  categoryShowcase: "src/components/catalog/CategoryShowcase.tsx",
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

requireText("main", 'import "./styles/modern-pages.css"', "modern routed-page stylesheet");
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
  requireText("header", requirement, `modern accessible navigation contract: ${requirement}`);
}
requireText("header", 'href: "/products"', "single shop desktop/mobile navigation");
forbidText("header", 'href: "/categories"', "duplicate category-index navigation");

for (const validPath of [
  "/products",
  "/products/category/diet-diabetic",
  "/products/category/cakes",
  "/products/category/gift-boxes",
]) {
  requireText("footer", validPath, `valid modern footer link ${validPath}`);
}
forbidText("footer", "/categories", "duplicate category-index footer link");
requireText("footer", "WINIMI BAKERY", "editorial footer wordmark");

for (const requirement of [
  "<Reveal",
  "<DraggableMarquee",
  "<CategoryShowcase",
  "occasionCards",
  "modern-section-title",
  "طعم خوب برای",
  "برای چه لحظه‌ای انتخاب می‌کنی؟",
  "product-rail-background.webp",
  "<HomeProductRail",
  "rgba(255, 253, 247, 0.58)",
]) {
  requireText("home", requirement, `modern product-led homepage contract: ${requirement}`);
}
forbidText("home", "داده نهایی با بک‌اند", "developer-facing homepage message");
forbidText("home", "وضعیت داده", "developer-facing homepage message");
forbidText("home", 'to="/categories"', "standalone category-index link");

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
  requireText("homeProductRail", requirement, `refined product rail controls: ${requirement}`);
}

for (const requirement of [
  "productRailBackground",
  "bg-[#fffdf7]",
  "sm:max-w-4xl",
]) {
  requireText("productCard", requirement, `branded quick-view surface: ${requirement}`);
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
  requireText("productCard", requirement, `modern product-card contract: ${requirement}`);
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

requireText("reveal", "IntersectionObserver", "dependency-free reveal observer");
requireText("reveal", "prefers-reduced-motion", "reveal reduced-motion support");
requireText("progress", 'aria-hidden="true"', "decorative progress accessibility");
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
  `Modern UI audit passed: ${Object.keys(files).length} design-system contracts verified, including one category-aware shop UI.`,
);
