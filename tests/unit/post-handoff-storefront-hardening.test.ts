import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("Home product autoplay never invokes scrollIntoView", () => {
  const source = readSource("src/components/home/HomeProductRail.tsx");

  assert.equal(/\.scrollIntoView\s*\(/.test(source), false);
  assert.equal(source.includes("rail.scrollBy({"), true);
  assert.equal(source.includes("targetRect.right - railRect.right"), true);
  assert.equal(source.includes("targetRect.left - railRect.left"), true);
  assert.equal(source.includes("AUTOPLAY_DELAY = 6000"), true);
});

test("desktop Store submenu has a dedicated high stacking layer and Winimi brand mark", () => {
  const source = readSource("src/components/layout/Header.tsx");

  assert.equal(source.includes('z-[100]'), true);
  assert.equal(source.includes('z-[120]'), true);
  assert.equal(source.includes('/brand/winimi-logo.svg'), true);
  assert.equal(source.includes('<Cookie'), false);
});

test("managed category image wins over curated frontend fallbacks", () => {
  const source = readSource("src/components/catalog/CategoryShowcase.tsx");
  const managedIndex = source.indexOf('if (backendImage?.trim()) return backendImage;');
  const curatedIndex = source.indexOf('const curated =');

  assert.ok(managedIndex >= 0);
  assert.ok(curatedIndex > managedIndex);
});

test("homepage categories retain catalog authority without a second placement contract", () => {
  const showcase = readSource("src/components/catalog/CategoryShowcase.tsx");
  const home = readSource("src/pages/HomePage.tsx");

  assert.equal(showcase.includes('showOnHome'), false);
  assert.equal(showcase.includes('homeSortOrder'), false);
  assert.equal(showcase.includes('surface?: "catalog" | "home"'), false);
  assert.equal(home.includes('surface="home"'), false);
});

test("footer navigation remains NavigationItem-authoritative with StoreSetting/catalog fallbacks", () => {
  const source = readSource("src/components/layout/Footer.tsx");

  assert.equal(source.includes('rootData?.footerNavigation'), true);
  assert.equal(source.includes('managedFooterGroups.length > 0'), true);
  assert.equal(source.includes('fallbackFooterGroups'), true);
  assert.equal(source.includes('category.showInFooter'), false);
  assert.equal(source.includes('footerSortOrder'), false);
  assert.equal(source.includes('managedFooterGroups.slice('), false);
  assert.equal(source.includes('/brand/winimi-logo.svg'), true);
});

test("homepage hero has a thin full boundary", () => {
  const source = readSource("src/pages/HomePage.tsx");

  assert.equal(
    source.includes('home-color-wash relative overflow-hidden border border-[#27390c]/15'),
    true,
  );
});

test("article detail exposes mobile and desktop tables of contents and reading time", () => {
  const source = readSource("src/pages/BlogDetailPage.tsx");

  assert.equal(source.includes("extractStructuredHeadings"), true);
  assert.equal(source.includes("estimateReadingMinutes"), true);
  assert.equal(source.includes("فهرست این راهنما"), true);
  assert.equal(source.includes("فهرست راهنما"), true);
});

test("Editorial Guides mobile cards clamp long copy and center a single guide", () => {
  const source = readSource("src/components/home/EditorialGuides.tsx");

  assert.equal(source.includes('guides.length === 1 ? "mx-auto max-w-4xl"'), true);
  assert.equal(source.includes("line-clamp-3"), true);
  assert.equal(source.includes("min-h-[25rem]"), true);
});
