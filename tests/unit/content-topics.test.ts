import assert from "node:assert/strict";
import test from "node:test";
import type {
  BackendPostDetail,
  BackendPostSummary,
} from "@/lib/backend-contract";
import { formatPersianUtcDate } from "@/lib/format-persian-date";
import {
  collectContentTopics,
  getContentTopicPath,
  normalizeContentTopic,
} from "@/lib/seo/content-topics";
import {
  createBlogCollectionSchema,
  createBlogPostingSchema,
} from "@/lib/seo/content-schema";

const post = (
  overrides: Partial<BackendPostSummary> = {},
): BackendPostSummary => ({
  id: "01JCONTENT",
  slug: "cookie-guide",
  title: "راهنمای کوکی",
  excerpt: "راهنمای منتشرشده",
  category: "راهنمای کوکی",
  tags: ["کوکی", "نگهداری"],
  coverUrl: null,
  author: "وینیمی",
  publishedAt: "2026-07-22T10:30:00+00:00",
  ...overrides,
});

test("content topic paths preserve authoritative Unicode labels", () => {
  assert.equal(normalizeContentTopic("  راهنمای کوکی  "), "راهنمای کوکی");
  assert.equal(
    getContentTopicPath("راهنمای کوکی"),
    "/blog/topic/%D8%B1%D8%A7%D9%87%D9%86%D9%85%D8%A7%DB%8C%20%DA%A9%D9%88%DA%A9%DB%8C",
  );
  assert.equal(normalizeContentTopic("unsafe/topic"), undefined);
  assert.equal(normalizeContentTopic("unsafe\\topic"), undefined);
});

test("topic summaries are derived only from published post payloads", () => {
  const topics = collectContentTopics([
    post(),
    post({ id: "02", slug: "second", publishedAt: "2026-07-23T00:00:00+00:00" }),
    post({ id: "03", slug: "cake", category: "راهنمای کیک" }),
    post({ id: "04", slug: "none", category: null }),
  ]);

  assert.equal(topics.length, 2);
  assert.equal(topics[0].name, "راهنمای کوکی");
  assert.equal(topics[0].postCount, 2);
  assert.equal(topics[0].latestPublishedAt, "2026-07-23T00:00:00+00:00");
  assert.equal(topics.some((topic) => topic.name === "موضوع نمایشی"), false);
});

test("blog collection schema exposes visible posts and real topics only", () => {
  const posts = [post()];
  const topics = collectContentTopics(posts);
  const schema = createBlogCollectionSchema({
    siteOrigin: "https://winimibakery.com",
    path: "/blog",
    title: "راهنماهای وینیمی",
    description: "مقاله‌های منتشرشده",
    posts,
    topics,
  }) as Record<string, unknown>;
  const mainEntity = schema.mainEntity as Record<string, unknown>;
  const items = mainEntity.itemListElement as Array<Record<string, unknown>>;

  assert.equal(schema["@type"], "Blog");
  assert.equal(mainEntity.numberOfItems, 1);
  assert.equal(items[0].url, "https://winimibakery.com/blog/cookie-guide");
  assert.equal(JSON.stringify(schema).includes("موضوع نمایشی"), false);
});

test("BlogPosting schema links the article to its crawlable topic hub", () => {
  const detail: BackendPostDetail = {
    ...post(),
    content: "محتوای مقاله",
    viewCount: 4,
  };
  const schema = createBlogPostingSchema({
    siteOrigin: "https://winimibakery.com",
    post: detail,
  }) as Record<string, unknown>;
  const isPartOf = schema.isPartOf as Record<string, unknown>;

  assert.equal(schema["@type"], "BlogPosting");
  assert.equal(schema.articleSection, "راهنمای کوکی");
  assert.equal(
    isPartOf.url,
    "https://winimibakery.com/blog/topic/%D8%B1%D8%A7%D9%87%D9%86%D9%85%D8%A7%DB%8C%20%DA%A9%D9%88%DA%A9%DB%8C",
  );
  assert.deepEqual(schema.keywords, ["کوکی", "نگهداری"]);
});

test("published dates are deterministic across SSR and hydration", () => {
  assert.equal(formatPersianUtcDate("2026-07-22T23:30:00-03:00"), "۲۰۲۶/۰۷/۲۳");
  assert.equal(formatPersianUtcDate("not-a-date"), undefined);
});
