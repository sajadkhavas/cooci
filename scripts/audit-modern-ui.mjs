import { readFileSync } from "node:fs";

const errors = [];
const read = (path) => readFileSync(path, "utf8");

const files = {
  index: "src/index.css",
  modernPages: "src/styles/modern-pages.css",
  main: "src/main.tsx",
  layout: "src/components/layout/SiteLayout.tsx",
  header: "src/components/layout/Header.tsx",
  footer: "src/components/layout/Footer.tsx",
  home: "src/pages/HomePage.tsx",
  categories: "src/pages/CategoriesPage.tsx",
  categoryShowcase: "src/components/catalog/CategoryShowcase.tsx",
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
requireText("index", ".glass-panel", "modern glass surface primitive");
requireText("index", ".bento-card", "bento card primitive");
requireText("index", ".reveal.is-visible", "reveal motion state");
requireText("index", "prefers-reduced-motion", "reduced-motion fallback");
requireText("index", ".ambient-layer", "ambient visual layer");
requireText("index", ".scroll-progress", "scroll progress styling");

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
requireText("header", 'href: "/categories"', "category-first desktop/mobile navigation");

for (const validPath of [
  "/categories",
  "/products/category/diet-diabetic",
  "/products/category/cakes",
  "/products/category/gift-boxes",
]) {
  requireText("footer", validPath, `valid modern footer link ${validPath}`);
}
requireText("footer", "WINIMI BAKERY", "editorial footer wordmark");

for (const requirement of [
  "<Reveal",
  "marquee-track",
  "<CategoryShowcase",
  "occasionCards",
  "modern-section-title",
  "سفارش آنلاین کوکی،",
  "خرید بر اساس موقعیت",
]) {
  requireText("home", requirement, `modern product-led homepage contract: ${requirement}`);
}
forbidText("home", "داده نهایی با بک‌اند", "developer-facing homepage message");
forbidText("home", "وضعیت داده", "developer-facing homepage message");

for (const requirement of [
  '"@type": "CollectionPage"',
  '"@type": "ItemList"',
  "<CategoryShowcase",
  "startingPoints",
  "modern-section-title",
]) {
  requireText("categories", requirement, `modern category-index contract: ${requirement}`);
}
for (const requirement of [
  "categoryVisuals",
  "backendCategory?.image",
  "productCount",
  "group-hover:scale-105",
  "rounded-[2rem]",
]) {
  requireText("categoryShowcase", requirement, `modern category-card contract: ${requirement}`);
}

for (const requirement of [
  "getPublicProductBadges",
  "getStockPresentation",
  "isProductInventoryVerified",
  "isProductMediaVerified",
  "rounded-[2rem]",
  "group-hover:scale-[1.07]",
]) {
  requireText("productCard", requirement, `modern product-card contract: ${requirement}`);
}

requireText("reveal", "IntersectionObserver", "dependency-free reveal observer");
requireText("reveal", "prefers-reduced-motion", "reveal reduced-motion support");
requireText("progress", 'aria-hidden="true"', "decorative progress accessibility");
requireText("modernPages", 'nav[aria-label="مراحل ثبت سفارش"]', "modern checkout progress styling");
requireText("modernPages", "main details[open]", "modern FAQ/details styling");

if (errors.length) {
  console.error(`Modern UI audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Modern UI audit passed: ${Object.keys(files).length} design-system contracts verified, including the product-led homepage and category architecture.`,
);
