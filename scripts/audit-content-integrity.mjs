import { readFileSync } from "node:fs";

const errors = [];
const files = {
  brand: "src/config/brand.ts",
  seo: "src/components/SEO.tsx",
  contentClient: "src/lib/content.ts",
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
  footer: "src/components/layout/Footer.tsx",
};
const sources = Object.fromEntries(Object.entries(files).map(([name, path]) => [name, readFileSync(path, "utf8")]));
const requireText = (sourceName, text, description = text) => {
  if (!sources[sourceName].includes(text)) errors.push(`${files[sourceName]}: missing ${description}.`);
};
const forbidText = (sourceName, text, description = text) => {
  if (sources[sourceName].includes(text)) errors.push(`${files[sourceName]}: contains forbidden ${description}.`);
};

for (const endpoint of ["/api/store/settings", "/api/store/pages/", "/api/store/posts", "/api/store/faqs", "/api/store/gallery", "/api/store/cities/", "/api/inquiries"]) {
  requireText("contentClient", endpoint, `backend content endpoint ${endpoint}`);
}
requireText("reviewsPage", "loadProductReviews", "published verified-purchase reviews from backend");
requireText("reviewsPage", "خرید تأییدشده", "verified-purchase disclosure");
forbidText("reviewsPage", "نظرات واقعی مشتریان", "unverified real-review claim");
requireText("blogList", "loadPosts", "backend post listing");
requireText("blogDetail", "loadPost", "backend post detail");
requireText("about", "ManagedContentPage", "managed about content");
requireText("quality", "ManagedContentPage", "managed quality content");
requireText("corporate", "InquiryForm", "persisted corporate inquiry");
requireText("inquiry", "submitInquiry", "persisted public inquiry");
requireText("trust", "trustseal.enamad.ir", "official eNAMAD host allowlist");
forbidText("trust", "dangerouslySetInnerHTML", "raw badge HTML execution");

for (const claim of [
  "بیش از ۵ سال تجربه",
  "رعایت اصول HACCP",
  "شکلات اروپایی",
  "بدون پالم و مارگارین در هیچ محصولی",
  "امکان ارائه فاکتور رسمی برای شرکت‌ها",
]) {
  for (const sourceName of ["brand", "about", "quality", "corporate", "footer"]) {
    forbidText(sourceName, claim, `unverified claim: ${claim}`);
  }
}

for (const claim of ["openingHours", "priceRange", '"@type": "Bakery"']) forbidText("seo", claim, `unsupported structured-data field ${claim}`);
requireText("seo", "sanitizeSchema", "schema sanitization");
requireText("seo", "delete cloned.aggregateRating", "rating sanitization");
requireText("seo", "delete offers.availability", "inventory schema sanitization");
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
for (const validPath of ["/products/category/diet", "/products/category/cakes", "/products/category/gift"]) requireText("footer", validPath, `valid category link ${validPath}`);

if (errors.length) {
  console.error(`Content integrity audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Content integrity audit passed: ${Object.keys(files).length} production content contracts verified.`);
