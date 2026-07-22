import { readFileSync } from "node:fs";

const errors = [];
const files = {
  brand: "src/config/brand.ts",
  seo: "src/components/SEO.tsx",
  contentClient: "src/lib/content.ts",
  contentSchema: "src/lib/content-schema.ts",
  reviewsPage: "src/pages/ReviewsPage.tsx",
  blogList: "src/pages/BlogListPage.tsx",
  blogDetail: "src/pages/BlogDetailPage.tsx",
  about: "src/pages/AboutPage.tsx",
  quality: "src/pages/QualityPage.tsx",
  corporate: "src/pages/CorporatePage.tsx",
  inquiry: "src/components/forms/InquiryForm.tsx",
  productCard: "src/components/ProductCard.tsx",
  productGallery: "src/components/catalog/ProductGallery.tsx",
  productDetail: "src/pages/ProductDetailPage.tsx",
  catalog: "src/lib/catalog.ts",
  trust: "src/components/trust/EnamadTrustSlot.tsx",
  trustSecurity: "src/lib/security/enamad.ts",
  footer: "src/components/layout/Footer.tsx",
  header: "src/components/layout/Header.tsx",
  routes: "src/routes.ts",
  home: "src/pages/HomePage.tsx",
  categoriesPage: "src/pages/CategoriesPage.tsx",
  categoryPage: "src/pages/CategoryPage.tsx",
  categoryShowcase: "src/components/catalog/CategoryShowcase.tsx",
  categoriesContent: "src/data/categoriesContent.ts",
  sitemapGenerator: "scripts/generate-sitemap.mjs",
  sitemap: "public/sitemap.xml",
  runtimeE2e: "e2e/runtime-performance.spec.mjs",
  phase10Documentation: "docs/FRONTEND_PHASE_10_0_HOME_CATEGORIES.md",
};
const sources = Object.fromEntries(
  Object.entries(files).map(([name, path]) => [name, readFileSync(path, "utf8")]),
);
const requireText = (sourceName, text, description = text) => {
  if (!sources[sourceName].includes(text)) {
    errors.push(`${files[sourceName]}: missing ${description}.`);
  }
};
const forbidText = (sourceName, text, description = text) => {
  if (sources[sourceName].includes(text)) {
    errors.push(`${files[sourceName]}: contains forbidden ${description}.`);
  }
};

for (const endpoint of [
  "/api/store/settings",
  "/api/store/pages/",
  "/api/store/posts",
  "/api/store/faqs",
  "/api/store/gallery",
  "/api/store/cities/",
  "/api/inquiries",
]) {
  requireText("contentClient", endpoint, `backend content endpoint ${endpoint}`);
}
requireText("contentClient", "apiRequest<unknown>", "runtime public-content response boundary");
requireText("contentSchema", 'code: "invalid_content_contract"', "runtime public-content parser");
requireText("reviewsPage", "loadProductReviews", "published verified-purchase reviews from backend");
requireText("reviewsPage", "خرید تأییدشده", "verified-purchase disclosure");
forbidText("reviewsPage", "نظرات واقعی مشتریان", "unverified real-review claim");
requireText("blogList", "loadPosts", "backend post listing");
requireText("blogDetail", "loadPost", "backend post detail");
requireText("about", "ManagedContentPage", "managed about content");
requireText("quality", "ManagedContentPage", "managed quality content");
requireText("corporate", "InquiryForm", "persisted corporate inquiry");
requireText("inquiry", "submitInquiry", "persisted public inquiry");
requireText("trust", "extractOfficialEnamadBadge", "isolated eNAMAD parser usage");
requireText(
  "trustSecurity",
  'const ENAMAD_HOST = "trustseal.enamad.ir"',
  "official eNAMAD host allowlist",
);
forbidText("trust", "dangerouslySetInnerHTML", "raw badge HTML execution");
forbidText("trustSecurity", "dangerouslySetInnerHTML", "raw trust-policy HTML execution");

for (const claim of [
  "بیش از ۵ سال تجربه",
  "رعایت اصول HACCP",
  "شکلات اروپایی",
  "بدون پالم و مارگارین در هیچ محصولی",
  "امکان ارائه فاکتور رسمی برای شرکت‌ها",
]) {
  for (const sourceName of [
    "brand",
    "about",
    "quality",
    "corporate",
    "footer",
    "home",
    "categoriesContent",
  ]) {
    forbidText(sourceName, claim, `unverified claim: ${claim}`);
  }
}

for (const claim of ["openingHours", "priceRange", '"@type": "Bakery"']) {
  forbidText("seo", claim, `unsupported structured-data field ${claim}`);
}
requireText("seo", "sanitizeSchema", "schema sanitization");
requireText("seo", "delete cloned.aggregateRating", "rating sanitization");
requireText("seo", "delete offers.availability", "inventory schema sanitization");
requireText("seo", "serializeJsonLd", "safe JSON-LD serialization");

for (const sourceName of ["productCard", "productDetail"]) {
  requireText(sourceName, "getPublicProductBadges", "filtered public product badges");
  requireText(sourceName, "getStockPresentation", "inventory presentation policy");
}
requireText("productCard", "isProductInventoryVerified", "inventory verification flag");
requireText("productCard", "isProductMediaVerified", "media verification flag");
requireText("productGallery", "تصویر نمایشی کاتالوگ", "product media disclosure");
requireText("productDetail", "getPublicProductDescription", "public product description policy");
requireText("productDetail", "getPublicIngredients", "verified ingredient policy");
requireText("productDetail", "getPublicAllergens", "verified allergen policy");
requireText("catalog", "isProductInventoryVerified", "inventory verification helper");
requireText("catalog", "isProductContentVerified", "content verification helper");
requireText("catalog", "isProductMediaVerified", "media verification helper");

requireText(
  "routes",
  'route("categories", "./pages/CategoriesPage.tsx")',
  "category index route module",
);
requireText(
  "routes",
  'route("products/category/:slug", "./pages/CategoryPage.tsx")',
  "category detail route module",
);
requireText("header", 'href: "/categories"', "header category index link");
requireText("footer", 'href: "/categories"', "footer category index link");
for (const validPath of [
  "/products/category/cookies",
  "/products/category/mini-cookies",
  "/products/category/diet-diabetic",
  "/products/category/cakes",
  "/products/category/cheesecakes",
  "/products/category/pastry",
  "/products/category/gift-boxes",
]) {
  requireText("footer", validPath, `valid editorial category link ${validPath}`);
  requireText("sitemap", validPath, `category sitemap URL ${validPath}`);
}

requireText("home", "سفارش آنلاین کوکی،", "product-led homepage H1");
requireText("home", "<CategoryShowcase", "homepage category discovery");
requireText("home", "خرید بر اساس موقعیت", "occasion-led homepage section");
forbidText("home", "داده نهایی با بک‌اند", "developer-facing homepage copy");
forbidText("home", "وضعیت داده", "developer-facing homepage copy");

requireText("categoriesPage", '"@type": "CollectionPage"', "category collection schema");
requireText("categoriesPage", '"@type": "ItemList"', "category ItemList schema");
requireText("categoryShowcase", "productCount", "backend category count support");
requireText(
  "categoryPage",
  "content?.productCategorySlug || slug",
  "editorial-to-backend category mapping",
);
requireText("categoryPage", "content?.catalogSearch", "subcategory search mapping");
requireText("categoryPage", '"@type": "CollectionPage"', "category detail schema");
requireText("sitemapGenerator", '{ path: "/categories"', "generated category index URL");
requireText(
  "runtimeE2e",
  "homepage is product-led and exposes the category architecture",
  "homepage browser acceptance",
);
requireText("runtimeE2e", "editorial slugs map to Laravel", "category mapping browser acceptance");
requireText(
  "phase10Documentation",
  "homepage_and_category_architecture=ready",
  "Phase 10.0 marker",
);

for (const claim of [
  "ارسال سراسری",
  "بدون مواد نگهدارنده",
  "تخفیف ویژه برای سفارش",
]) {
  forbidText("categoriesContent", claim, `unsupported static category claim: ${claim}`);
}

if (errors.length) {
  console.error(`Content integrity audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(
  `Content integrity audit passed: ${Object.keys(files).length} production content contracts verified, including the SSR Phase 10.0 homepage and category route architecture.`,
);
