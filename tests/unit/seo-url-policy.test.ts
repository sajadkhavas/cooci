import assert from "node:assert/strict";
import test from "node:test";
import {
  createRobotsText,
  getLegacyRedirectTarget,
  isPrivateIndexPath,
  resolvePaginationUrlPolicy,
} from "@/lib/seo/url-policy";

test("filtered catalog URLs are noindex-follow and canonicalize to the clean collection", () => {
  const policy = resolvePaginationUrlPolicy({
    pathname: "/products/category/cookies",
    searchParams: new URLSearchParams("q=chocolate&sort=newest&page=3"),
    totalPages: 8,
  });

  assert.equal(policy.canonicalPath, "/products/category/cookies");
  assert.equal(policy.noIndex, true);
  assert.equal(policy.robots, "noindex,follow");
  assert.equal(policy.previousPath, undefined);
  assert.equal(policy.nextPath, undefined);
  assert.equal(policy.redirectPath, undefined);
});

test("clean pagination uses self-canonical URLs and previous-next links", () => {
  const policy = resolvePaginationUrlPolicy({
    pathname: "/products",
    searchParams: new URLSearchParams("page=3"),
    totalPages: 5,
  });

  assert.equal(policy.canonicalPath, "/products?page=3");
  assert.equal(policy.noIndex, false);
  assert.equal(policy.previousPath, "/products?page=2");
  assert.equal(policy.nextPath, "/products?page=4");
  assert.equal(policy.redirectPath, undefined);
});

test("page one and out-of-range pages redirect to one canonical address", () => {
  const pageOne = resolvePaginationUrlPolicy({
    pathname: "/blog",
    searchParams: new URLSearchParams("page=1"),
    totalPages: 4,
  });
  assert.equal(pageOne.redirectPath, "/blog");

  const outOfRange = resolvePaginationUrlPolicy({
    pathname: "/blog",
    searchParams: new URLSearchParams("page=99"),
    totalPages: 4,
  });
  assert.equal(outOfRange.redirectPath, "/blog?page=4");
  assert.equal(outOfRange.canonicalPath, "/blog?page=4");
});

test("robots and redirect registries protect non-public surfaces", () => {
  const robots = createRobotsText("https://winimibakery.com/path");
  assert.match(robots, /Disallow: \/account/);
  assert.match(robots, /Disallow: \/checkout/);
  assert.match(robots, /Sitemap: https:\/\/winimibakery\.com\/sitemap\.xml/);
  assert.equal(isPrivateIndexPath("/account/orders/example"), true);
  assert.equal(isPrivateIndexPath("/products/example"), false);
  assert.equal(getLegacyRedirectTarget("/categories/"), "/products");
});
