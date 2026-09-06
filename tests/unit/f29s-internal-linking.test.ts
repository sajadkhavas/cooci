import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const categoryGuideSource = fs.readFileSync(
  new URL("../../src/components/content/CategoryGuideLinks.tsx", import.meta.url),
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
const blogDetailSource = fs.readFileSync(
  new URL("../../src/pages/BlogDetailPage.tsx", import.meta.url),
  "utf8",
);

test("canonical category routes render contextual guide links", () => {
  assert.match(categoryRouteSource, /<CategoryGuideLinks slug=\{slug\} \/>/);

  for (const destination of [
    "/blog/cookie-storage-guide",
    "/blog/cookies-per-guest-guide",
    "/blog/cheesecake-cold-storage",
  ]) {
    assert.ok(
      categoryGuideSource.includes(`href: "${destination}"`),
      `missing category-to-guide destination: ${destination}`,
    );
  }
});

test("home routes visitors to dedicated guides rather than only the generic hub", () => {
  for (const destination of [
    "/blog/choose-food-gift-box",
    "/blog/cookie-storage-guide",
    "/blog/cookies-per-guest-guide",
  ]) {
    assert.ok(
      homeGuideSource.includes(`href: "${destination}"`),
      `missing home-to-guide destination: ${destination}`,
    );
  }
});

test("guide pages expose topic and related-guide navigation", () => {
  assert.match(blogDetailSource, /getContentTopicPath\(post\.category\)/);
  assert.match(blogDetailSource, /relatedPosts\.map/);
  assert.match(blogDetailSource, /مشاهده همه موضوع/);
});

test("contextual category links keep operational truth on product pages", () => {
  assert.match(
    categoryGuideSource,
    /جایگزین اطلاعات قیمت، موجودی، ترکیبات یا شرایط نگهداری تأییدشده هر محصول نیستند/,
  );
});
