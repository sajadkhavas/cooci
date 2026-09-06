import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveBlogIndexability,
  resolveConditionalContentIndexability,
} from "@/lib/seo/content-indexability";

test("generic conditional content fails closed when empty", () => {
  assert.deepEqual(resolveConditionalContentIndexability(0), {
    indexable: false,
    robots: "noindex,follow",
    includeInSitemap: false,
  });
});

test("generic conditional content becomes indexable when populated", () => {
  assert.deepEqual(resolveConditionalContentIndexability(1), {
    indexable: true,
    robots: "index,follow",
    includeInSitemap: true,
  });
});

test("generic conditional content fails closed for unknown or invalid counts", () => {
  for (const count of [
    undefined,
    null,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ]) {
    assert.deepEqual(resolveConditionalContentIndexability(count), {
      indexable: false,
      robots: "noindex,follow",
      includeInSitemap: false,
    });
  }
});

test("blog compatibility wrapper remains fail closed when empty", () => {
  assert.deepEqual(resolveBlogIndexability(0), {
    indexable: false,
    robots: "noindex,follow",
    includeInSitemap: false,
  });
});

test("blog compatibility wrapper remains indexable when populated", () => {
  assert.deepEqual(resolveBlogIndexability(3), {
    indexable: true,
    robots: "index,follow",
    includeInSitemap: true,
  });
});
