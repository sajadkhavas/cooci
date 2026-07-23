import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_META_DESCRIPTION_LENGTH,
  MIN_META_DESCRIPTION_LENGTH,
  resolveMetaDescription,
} from "@/lib/seo/meta-description";

const fallback =
  "مشاهده و سفارش آنلاین محصولات وینیمی با اطلاعات منتشرشده کاتالوگ.";

test("useful page descriptions are preserved after whitespace normalization", () => {
  const description = resolveMetaDescription(
    "  توضیح معتبر و اختصاصی برای صفحه شهر و محدوده ارسال.  ",
    fallback,
  );
  assert.equal(description, "توضیح معتبر و اختصاصی برای صفحه شهر و محدوده ارسال.");
});

test("short backend descriptions keep their context and receive a safe brand fallback", () => {
  const description = resolveMetaDescription("صفحه شهری staging.", fallback);
  assert.match(description, /^صفحه شهری staging\. /);
  assert.match(description, /محصولات وینیمی/);
  assert.ok(description.length >= MIN_META_DESCRIPTION_LENGTH);
});

test("empty and oversized descriptions remain bounded", () => {
  assert.equal(resolveMetaDescription(undefined, fallback), fallback);
  const oversized = resolveMetaDescription("ت".repeat(500), fallback);
  assert.equal(oversized.length, MAX_META_DESCRIPTION_LENGTH);
  assert.match(oversized, /…$/);
});
