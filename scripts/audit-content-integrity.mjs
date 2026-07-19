import { existsSync, readFileSync } from "node:fs";

const errors = [];
const read = (path) => readFileSync(path, "utf8");

const files = {
  brand: "src/config/brand.ts",
  seo: "src/components/SEO.tsx",
  reviews: "src/data/reviews.ts",
  reviewsPage: "src/pages/ReviewsPage.tsx",
  blogData: "src/data/blogPosts.ts",
  blogList: "src/pages/BlogListPage.tsx",
  blogDetail: "src/pages/BlogDetailPage.tsx",
  quality: "src/pages/QualityPage.tsx",
  corporate: "src/pages/CorporatePage.tsx",
  productCard: "src/components/ProductCard.tsx",
  productGallery: "src/components/catalog/ProductGallery.tsx",
  productDetail: "src/pages/ProductDetailPage.tsx",
  catalog: "src/lib/catalog.ts",
  home: "src/pages/HomePage.tsx",
  about: "src/pages/AboutPage.tsx",
  footer: "src/components/layout/Footer.tsx",
};

const sources = Object.fromEntries(
  Object.entries(files).map(([name, path]) => [name, read(path)]),
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

requireText("reviews", "export const reviews: Review[] = [];", "an empty verified-review source");
requireText("reviews", 'source: "verified-order" | "manual-verification"', "review provenance");
requireText("reviewsPage", "publishedReviews", "verified review filtering");
requireText("reviewsPage", "هنوز نظر عمومی تأییدشده‌ای ثبت نشده است", "honest review empty state");
forbidText("reviewsPage", "نظرات واقعی مشتریان", "unverified real-review claim");

for (const claim of [
  "openingHours",
  "priceRange",
  '"@type": "Bakery"',
]) {
  forbidText("seo", claim, `unsupported structured-data field ${claim}`);
}
requireText("seo", "sanitizeSchema", "schema sanitization");
requireText("seo", "delete cloned.aggregateRating", "rating sanitization");
requireText("seo", "delete offers.availability", "inventory schema sanitization");

for (const phrase of [
  "بیش از ۵ سال تجربه",
  "رعایت اصول HACCP",
  "شکلات اروپایی",
  "بدون پالم و مارگارین در هیچ محصولی",
  "تخفیف ویژه برای سفارش‌های بالای",
  "برای هدایای شرکتی از ۲۰ عدد به بالا",
  "امکان ارائه فاکتور رسمی برای شرکت‌ها",
]) {
  for (const sourceName of [
    "brand",
    "about",
    "quality",
    "corporate",
    "home",
    "footer",
  ]) {
    forbidText(sourceName, phrase, `unverified claim: ${phrase}`);
  }
}

requireText("quality", "عدم ادعای گواهی بدون مدرک", "evidence-based quality policy");
requireText("corporate", "این صفحه فرم استعلام است، نه وعده قطعی خدمات", "conditional corporate capability notice");
requireText("brand", "contentNotice", "global content verification notice");
forbidText("brand", "founder:", "fabricated founder biography");

forbidText("blogData", "/images/blog/", "missing public blog image path");
forbidText("blogData", "publishDate:", "invented publication date");
forbidText("blogData", "تا ۲ هفته تازه", "fixed unsupported shelf-life advice");
forbidText("blogData", "تا ۳ ماه در فریزر", "fixed unsupported freezing advice");
forbidText("blogData", "ما همه این بسته‌بندی‌ها را ارائه می‌دهیم", "unsupported packaging capability");
requireText("blogData", 'reviewedAt: "2026-07-19"', "ISO review date");
requireText("blogData", "isRepresentative: true", "representative editorial media flag");
requireText("blogList", "تصویر نمایشی", "blog media disclosure");
requireText("blogDetail", "dateModified: post.reviewedAt", "reviewed article schema");
forbidText("blogDetail", "datePublished: post.publishDate", "invented publication schema");

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
requireText("productDetail", "فهرست ترکیبات تأییدشده هنوز از بک‌اند دریافت نشده است", "ingredient empty state");
forbidText("productDetail", "product.longDescription", "raw internal product description rendering");
forbidText("productDetail", "product.ingredients.join", "raw internal ingredient rendering");
forbidText("productDetail", "product.allergens.join", "raw internal allergen rendering");
forbidText("productDetail", "product.shelfLife}", "raw internal shelf-life rendering");

requireText("catalog", "isProductInventoryVerified", "inventory verification helper");
requireText("catalog", "isProductContentVerified", "content verification helper");
requireText("catalog", "isProductMediaVerified", "media verification helper");
requireText("catalog", "موجودی نهایی هنگام ثبت سفارش توسط بک‌اند بررسی می‌شود", "unverified inventory wording");

for (const [invalidPath, validPath] of [
  ["/products/category/diet-diabetic", "/products/category/diet"],
  ["/products/category/cheesecakes", "/products/category/cakes"],
  ["/products/category/gift-boxes", "/products/category/gift"],
]) {
  forbidText("footer", invalidPath, `invalid category link ${invalidPath}`);
  requireText("footer", validPath, `valid category link ${validPath}`);
}

requireText("home", "داده نهایی با بک‌اند", "homepage backend verification disclosure");
requireText("about", "فرانت‌اند کامل، داده نهایی وابسته به بک‌اند", "accurate project status");
forbidText("about", "از کودکی", "fabricated childhood story");

for (const temporaryFile of [
  "scripts/phase8-content-migration.mjs",
  ".github/workflows/phase8-content-migration.yml",
]) {
  if (existsSync(temporaryFile)) {
    errors.push(`${temporaryFile}: one-time migration artifact must not remain in production.`);
  }
}

if (errors.length) {
  console.error(`Content integrity audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Content integrity audit passed: ${Object.keys(files).length} production content contracts verified.`,
);
