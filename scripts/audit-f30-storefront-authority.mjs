import fs from "node:fs";
import { execFileSync } from "node:child_process";

const read = (path) => fs.readFileSync(path, "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(`F30_AUTHORITY_FAIL: ${message}`);
};
const contains = (path, needle) =>
  assert(read(path).includes(needle), `${path} missing ${needle}`);
const excludes = (path, needle) =>
  assert(!read(path).includes(needle), `${path} still contains ${needle}`);

const categoryBaselineBlob = execFileSync(
  "git",
  ["hash-object", "src/data/categoriesContent.ts"],
  { encoding: "utf8" },
).trim();
assert(
  categoryBaselineBlob === "b204f0bbfc15398add79577287d1b8e07eea82b0",
  `SEO category fallback baseline changed: ${categoryBaselineBlob}`,
);

contains("src/root.tsx", "storeSettings: await loadStoreSettings()");
contains("src/root.tsx", "setQueryData(STORE_SETTINGS_QUERY_KEY");
contains("src/pages/HomePage.tsx", "title={home.metaTitle}");
contains("src/pages/HomePage.tsx", "schema={faqSchema}");
contains("src/pages/GiftPage.tsx", "title={gift.metaTitle}");
contains("src/pages/CorporatePage.tsx", "title={corporate.metaTitle}");
contains("src/components/layout/Header.tsx", "content.navigation.links.map");
contains("src/components/layout/Footer.tsx", "content.footer.discovery.links.map");
contains("src/components/home/DecisionSupportPanel.tsx", "loadFaqs(\"home-decision\")");
contains("src/components/home/EditorialGuides.tsx", "loaderData?.relatedPosts");
contains("src/routes/home.tsx", "loadEditorialPosts");
contains("src/routes/category-shop.tsx", "loadManagedCategoryShop");
contains("src/lib/category-shop-loader.server.ts", "fetchCatalogDirectory()");
contains("src/lib/category-shop-loader.server.ts", "landing?.catalogSearch");
contains("src/pages/ProductsPage.tsx", "landings.find((landing) => landing.slug === slug) ?? fallbackContent");
contains("src/components/catalog/CategoryShowcase.tsx", "landings.length > 0 ? landings : categoryContents");
contains("src/components/content/CategoryGuideLinks.tsx", "landing?.guides ?? []");
excludes("src/components/content/CategoryGuideLinks.tsx", "CATEGORY_GUIDES");

const forbiddenHomepageSeo = "خرید کوکی، کیک و باکس هدیه";
assert(
  !read("src/pages/HomePage.tsx").includes(forbiddenHomepageSeo),
  "Homepage SEO remained hard-coded instead of backend-managed",
);

console.log("F30_STOREFRONT_BACKEND_AUTHORITY=PASS");
console.log("SEO_BASELINE_PRESERVED=PASS");
console.log("SEO_BACKEND_AUTHORITY=PASS");
