import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveOutOfRangeCatalogQuery,
  toCatalogSearchParams,
} from "@/lib/catalog-query";

test("catalog boolean filters use Laravel-compatible one and zero values", () => {
  const params = toCatalogSearchParams({
    featured: true,
    requiresCooling: false,
    inStock: true,
  });

  assert.equal(params.get("featured"), "1");
  assert.equal(params.get("requiresCooling"), "0");
  assert.equal(params.get("inStock"), "1");
  assert.equal(params.toString(), "featured=1&requiresCooling=0&inStock=1");
});

test("catalog query values remain bounded and omit the all category", () => {
  const params = toCatalogSearchParams({
    category: "all",
    search: `  ${"x".repeat(140)}  `,
    page: 50_000,
    perPage: 500,
    sort: "newest",
  });

  assert.equal(params.has("category"), false);
  assert.equal(params.get("search")?.length, 120);
  assert.equal(params.get("page"), "10000");
  assert.equal(params.get("perPage"), "100");
  assert.equal(params.get("sort"), "newest");
});

test("out-of-range catalog pages retry at the last valid page", () => {
  assert.deepEqual(
    resolveOutOfRangeCatalogQuery(
      { page: 10_000, search: "کوکی", sort: "featured" },
      { page: 10_000, totalPages: 3 },
    ),
    { page: 3, search: "کوکی", sort: "featured" },
  );

  assert.equal(
    resolveOutOfRangeCatalogQuery({ page: 2 }, { totalPages: 3 }),
    undefined,
  );
  assert.equal(
    resolveOutOfRangeCatalogQuery({ page: 10 }, { totalPages: "3" }),
    undefined,
  );
});
