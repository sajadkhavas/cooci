import assert from "node:assert/strict";
import test from "node:test";
import { resolveBlogIndexability } from "@/lib/seo/content-indexability";

test("an empty blog is crawlable but excluded from indexing and sitemap", () => {
  assert.deepEqual(resolveBlogIndexability(0), {
    indexable: false,
    robots: "noindex,follow",
    includeInSitemap: false,
  });
});

test("a blog with published content becomes indexable and sitemap eligible", () => {
  assert.deepEqual(resolveBlogIndexability(1), {
    indexable: true,
    robots: "index,follow",
    includeInSitemap: true,
  });
});

test("invalid or negative counts fail closed as an empty blog", () => {
  for (const count of [undefined, null, -1, Number.NaN]) {
    assert.deepEqual(resolveBlogIndexability(count), {
      indexable: false,
      robots: "noindex,follow",
      includeInSitemap: false,
    });
  }
});
