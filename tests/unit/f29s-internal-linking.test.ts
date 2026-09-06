import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const categoryGuideSource = fs.readFileSync(
  new URL("../../src/components/content/CategoryGuideLinks.tsx", import.meta.url),
  "utf8",
);
const categoryGuideFallbackSource = fs.readFileSync(
  new URL("../../src/data/categoryGuideFallbacks.ts", import.meta.url),
  "utf8",
);
const categoryGuideCopySource = fs.readFileSync(
  new URL("../../src/lib/category-guide-content.ts", import.meta.url),
  "utf8",
);
const categoryRouteSource = fs.readFileSync(
  new URL("../../src/routes/category-shop.tsx", import.meta.url),
  "utf8",
);
const homeGuideSource = fs.readFileSync(
  new URL("../../src/components/home/EditorialGuides.tsx", import.meta.url),
  "utf8",
);
const storefrontContentSource = fs.readFileSync(
  new URL("../../src/lib/storefront-content.ts", import.meta.url),
  "utf8",
);
const blogDetailSource = fs.readFileSync(
  new URL("../../src/pages/BlogDetailPage.tsx", import.meta.url),
  "utf8",
);

test("canonical category routes render contextual guide links", () => {
  assert.match(categoryRouteSource, /<CategoryGuideLinks slug=\{slug\} \/>/);
  assert.match(categoryGuideSource, /landing\?\.guides \?\? \[\]/);
  assert.match(categoryGuideSource, /getCategoryGuideFallbacks\(slug\)/);

  for (const destination of [
    "/blog/cookie-storage-guide",
    "/blog/cookies-per-guest-guide",
    "/blog/cheesecake-cold-storage",
  ]) {
    assert.ok(
      categoryGuideFallbackSource.includes(`href: "${destination}"`),
      `missing category-to-guide fallback destination: ${destination}`,
    );
  }
});

test("home routes visitors to dedicated guides rather than only the generic hub", () => {
  for (const slug of [
    "choose-food-gift-box",
    "cookie-storage-guide",
    "cookies-per-guest-guide",
  ]) {
    assert.ok(
      storefrontContentSource.includes(`"${slug}"`),
      `missing home-to-guide fallback slug: ${slug}`,
    );
  }

  assert.match(homeGuideSource, /to=\{`\/blog\/\$\{guide\.slug\}`\}/);
});

test("guide pages expose topic and related-guide navigation", () => {
  assert.match(blogDetailSource, /getContentTopicPath\(post\.category\)/);
  assert.match(blogDetailSource, /relatedPosts\.map/);
  assert.match(blogDetailSource, /مشاهده همه موضوع/);
});

test("contextual category links keep operational truth on product pages", () => {
  assert.match(
    categoryGuideCopySource,
    /جایگزین اطلاعات قیمت، موجودی، ترکیبات یا شرایط نگهداری تأییدشده هر محصول نیستند/,
  );
});
