import assert from "node:assert/strict";
import test from "node:test";
import { resolveMetaTitle } from "@/lib/seo/meta-title";

const brandName = "وینیمی بیکری";
const fallback = "خرید کوکی، کیک و باکس هدیه | وینیمی بیکری";

test("page title receives the brand exactly once", () => {
  assert.equal(
    resolveMetaTitle("کوکی شکلاتی", brandName, fallback),
    "کوکی شکلاتی | وینیمی بیکری",
  );
});

test("already branded backend product title is not branded again", () => {
  assert.equal(
    resolveMetaTitle(
      "کوکی شکلاتی | وینیمی بیکری",
      brandName,
      fallback,
    ),
    "کوکی شکلاتی | وینیمی بیکری",
  );
});

test("managed content title containing the brand is not duplicated", () => {
  assert.equal(
    resolveMetaTitle(
      "درباره وینیمی بیکری",
      brandName,
      fallback,
    ),
    "درباره وینیمی بیکری",
  );
});

test("blank titles use the normalized default title", () => {
  assert.equal(
    resolveMetaTitle("   ", brandName, `  ${fallback}  `),
    fallback,
  );
});

test("title whitespace is normalized before branding", () => {
  assert.equal(
    resolveMetaTitle(
      "  راهنمای   نگهداری محصولات  ",
      brandName,
      fallback,
    ),
    "راهنمای نگهداری محصولات | وینیمی بیکری",
  );
});
