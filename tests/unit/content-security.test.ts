import assert from "node:assert/strict";
import test from "node:test";
import {
  contentPageSchema,
  galleryItemSchema,
  inquiryResultSchema,
  paginationSchema,
  postDetailSchema,
  publicUrlSchema,
} from "@/lib/content-contract-schema";
import {
  normalizeInquiryEmail,
  normalizeInquiryMobile,
  sanitizeInquiryMetadata,
} from "@/lib/inquiry-form";
import { extractOfficialEnamadBadge } from "@/lib/security/enamad";
import {
  resolveCanonicalUrl,
  resolvePublicMediaUrl,
  serializeJsonLd,
} from "@/lib/security/seo";

const validPost = {
  id: "01JSTAGINGPOST",
  slug: "staging-welcome",
  title: "مقاله تست پذیرش وینیمی",
  excerpt: "رکورد مشخص برای تست.",
  category: "staging",
  tags: ["staging", "acceptance"],
  coverUrl: null,
  author: "Winimi QA",
  publishedAt: "2026-07-20T12:00:00+00:00",
  content: "این نوشته فقط در محیط staging استفاده می‌شود.",
  viewCount: 1,
};

test("valid managed content contracts accept staging-shaped payloads", () => {
  assert.equal(postDetailSchema.parse(validPost).slug, "staging-welcome");
  assert.equal(
    contentPageSchema.parse({
      id: "01JSTAGINGPAGE",
      type: "legal",
      slug: "staging-privacy",
      title: "حریم خصوصی تست",
      excerpt: null,
      content: "متن تست",
      seo: { title: null, description: null },
      publishedAt: "2026-07-20T12:00:00+00:00",
    }).title,
    "حریم خصوصی تست",
  );
});

test("public URL contracts reject executable, insecure and protocol-relative URLs", () => {
  for (const value of [
    "javascript:alert(1)",
    "http://cdn.example.com/image.jpg",
    "//evil.example/image.jpg",
    "https://user:pass@example.com/image.jpg",
  ]) {
    assert.equal(publicUrlSchema.safeParse(value).success, false, value);
  }
  assert.equal(publicUrlSchema.parse("/images/product.webp"), "/images/product.webp");
  assert.equal(
    publicUrlSchema.parse("https://cdn.example.com/image.jpg"),
    "https://cdn.example.com/image.jpg",
  );
});

test("gallery and content contracts reject unsafe links and slugs", () => {
  assert.equal(
    galleryItemSchema.safeParse({
      id: 1,
      title: "تصویر",
      caption: null,
      imageUrl: "https://cdn.example.com/a.jpg",
      linkUrl: "javascript:alert(1)",
    }).success,
    false,
  );
  assert.equal(
    postDetailSchema.safeParse({ ...validPost, slug: "../admin" }).success,
    false,
  );
});

test("pagination contracts reject impossible ranges", () => {
  assert.equal(
    paginationSchema.safeParse({
      page: 1,
      perPage: 12,
      total: 0,
      totalPages: 0,
      from: 1,
      to: 1,
      hasMore: false,
    }).success,
    false,
  );
  assert.equal(
    paginationSchema.safeParse({
      page: 1,
      perPage: 12,
      total: 5,
      totalPages: 1,
      from: 5,
      to: 2,
      hasMore: false,
    }).success,
    false,
  );
});

test("inquiry result must be a persisted server-shaped record", () => {
  assert.equal(
    inquiryResultSchema.safeParse({
      id: "01JINQUIRY",
      type: "contact",
      status: "new",
    }).success,
    true,
  );
  assert.equal(
    inquiryResultSchema.safeParse({
      id: "../fake",
      type: "contact",
      status: "new",
    }).success,
    false,
  );
});

test("canonical URL resolution never leaves the storefront origin", () => {
  const origin = "https://winimibakery.com";
  assert.equal(
    resolveCanonicalUrl("/products?q=cookie#results", origin),
    "https://winimibakery.com/products?q=cookie",
  );
  assert.equal(
    resolveCanonicalUrl("https://evil.example/phish", origin),
    "https://winimibakery.com/",
  );
  assert.equal(
    resolveCanonicalUrl("//evil.example/phish", origin),
    "https://winimibakery.com/",
  );
});

test("public media resolution rejects insecure or credential-bearing origins", () => {
  const origin = "https://winimibakery.com";
  assert.equal(
    resolvePublicMediaUrl("/og-image.jpg", origin),
    "https://winimibakery.com/og-image.jpg",
  );
  assert.equal(
    resolvePublicMediaUrl("http://cdn.example.com/image.jpg", origin),
    "https://winimibakery.com/",
  );
  assert.equal(
    resolvePublicMediaUrl("https://user:pass@cdn.example.com/image.jpg", origin),
    "https://winimibakery.com/",
  );
});

test("JSON-LD serialization prevents script breakout and HTML interpretation", () => {
  const serialized = serializeJsonLd({
    headline: "</script><script>alert(1)</script>",
    separator: "a&b\u2028c\u2029d",
  });
  assert.equal(serialized.includes("</script>"), false);
  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes("&"), false);
  assert.match(serialized, /\\u003c\/script\\u003e/);
  assert.match(serialized, /\\u0026/);
  assert.match(serialized, /\\u2028/);
  assert.match(serialized, /\\u2029/);
});

test("eNAMAD extraction accepts only exact official HTTPS host URLs", () => {
  const valid = extractOfficialEnamadBadge(
    '<a href="https://trustseal.enamad.ir/?id=123"><img src="https://trustseal.enamad.ir/logo.aspx?id=123" /></a>',
  );
  assert.equal(valid?.verification, "https://trustseal.enamad.ir/?id=123");
  assert.equal(valid?.image, "https://trustseal.enamad.ir/logo.aspx?id=123");

  for (const code of [
    '<a href="https://trustseal.enamad.ir.evil.example/?id=1"><img src="https://trustseal.enamad.ir/logo.aspx?id=1" /></a>',
    '<a href="http://trustseal.enamad.ir/?id=1"><img src="https://trustseal.enamad.ir/logo.aspx?id=1" /></a>',
    '<script>alert(1)</script>',
  ]) {
    assert.equal(extractOfficialEnamadBadge(code), null);
  }
});

test("inquiry fields normalize Iranian phone numbers, email and bounded metadata", () => {
  assert.equal(normalizeInquiryMobile("+98 912-345-6789"), "09123456789");
  assert.equal(normalizeInquiryMobile("۰۰۹۸۹۱۲۳۴۵۶۷۸۹"), "09123456789");
  assert.equal(normalizeInquiryEmail(" Test@Example.COM "), "test@example.com");

  const metadata = sanitizeInquiryMetadata({
    source: "x".repeat(800),
    nested: { value: "ok", deeper: { ignored: "value" } },
    infinite: Number.POSITIVE_INFINITY,
  });
  assert.equal((metadata?.source as string).length, 500);
  assert.equal(metadata?.infinite, null);
  assert.deepEqual(metadata?.nested, { value: "ok", deeper: null });
});
