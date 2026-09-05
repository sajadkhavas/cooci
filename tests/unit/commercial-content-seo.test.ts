import assert from "node:assert/strict";
import test from "node:test";
import {
  COMMERCIAL_SEO_PATHS,
  resolveCommercialSeoMeta,
} from "../../src/lib/seo/commercial-content.ts";

test("F29S commercial routes have unique intent-owned titles", () => {
  const expected = new Map([
    ["/", "خرید کوکی، کیک و باکس هدیه | وینیمی بیکری"],
    ["/products", "محصولات وینیمی | کوکی، کیک، دسر و شیرینی"],
    ["/gift", "باکس هدیه کوکی و شیرینی | وینیمی"],
    ["/corporate", "هدیه و پذیرایی سازمانی | استعلام سفارش وینیمی"],
  ]);

  assert.deepEqual(COMMERCIAL_SEO_PATHS, [...expected.keys()]);

  for (const [path, title] of expected) {
    const meta = resolveCommercialSeoMeta(path);
    assert.ok(meta, `missing commercial SEO ownership for ${path}`);
    assert.equal(meta.title, title);
    assert.ok(meta.description.length >= 70, `thin commercial meta description for ${path}`);
    assert.ok(meta.primaryIntent.length > 0, `missing primary intent for ${path}`);
  }

  assert.equal(
    new Set([...expected.keys()].map((path) => resolveCommercialSeoMeta(path)?.title)).size,
    expected.size,
  );
});

test("informational and dynamic URLs cannot be captured by the static commercial registry", () => {
  for (const path of [
    "/blog",
    "/blog/choose-food-gift-box",
    "/products/category/cookies",
    "/products/category/cheesecakes",
    "/products/example-product",
    "/shipping",
  ]) {
    assert.equal(resolveCommercialSeoMeta(path), undefined, `unexpected commercial override: ${path}`);
  }
});

test("commercial intent ownership remains separated from guide intent", () => {
  assert.match(resolveCommercialSeoMeta("/gift")?.primaryIntent ?? "", /باکس هدیه/);
  assert.match(resolveCommercialSeoMeta("/corporate")?.primaryIntent ?? "", /سازمانی/);
  assert.doesNotMatch(resolveCommercialSeoMeta("/products")?.primaryIntent ?? "", /خرید کوکی خانگی/);
});
