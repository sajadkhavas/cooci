import assert from "node:assert/strict";
import test from "node:test";
import {
  getCookieBulkEligibleQuantity,
  isCookieBulkDiscountEligibleCategory,
  resolveCookieBulkDiscount,
} from "../../src/lib/bulk-discount.ts";

test("bulk discount stays hidden when backend settings are absent", () => {
  const config = resolveCookieBulkDiscount(undefined);

  assert.equal(config.enabled, false);
  assert.equal(config.minimumQuantity, 100);
  assert.equal(config.percent, 10);
  assert.deepEqual(config.categorySlugs, []);
});

test("bulk discount parses the public backend settings contract safely", () => {
  const config = resolveCookieBulkDiscount({
    pricing: {
      cookie_bulk_discount: {
        enabled: true,
        min_quantity: 100,
        percent: 10,
        category_slugs: [
          "kokyhay-khangy",
          "myny-koky",
          "myny-koky",
          "../unsafe",
        ],
      },
    },
  });

  assert.equal(config.enabled, true);
  assert.equal(config.minimumQuantity, 100);
  assert.equal(config.percent, 10);
  assert.deepEqual(config.categorySlugs, ["kokyhay-khangy", "myny-koky"]);
  assert.equal(
    isCookieBulkDiscountEligibleCategory("kokyhay-khangy", config),
    true,
  );
  assert.equal(isCookieBulkDiscountEligibleCategory("kyk-o-dsr", config), false);
});

test("eligible cart quantity only counts configured cookie categories", () => {
  const config = resolveCookieBulkDiscount({
    pricing: {
      cookie_bulk_discount: {
        enabled: true,
        min_quantity: 100,
        percent: 10,
        category_slugs: ["kokyhay-khangy", "myny-koky"],
      },
    },
  });

  assert.equal(
    getCookieBulkEligibleQuantity(
      [
        { quantity: 65, categorySlug: "kokyhay-khangy" },
        { quantity: 35, categorySlug: "myny-koky" },
        { quantity: 20, categorySlug: "kyk-o-dsr" },
      ],
      config,
    ),
    100,
  );
});

test("untrusted numeric settings are bounded", () => {
  const config = resolveCookieBulkDiscount({
    pricing: {
      cookie_bulk_discount: {
        enabled: true,
        min_quantity: 999_999,
        percent: 999,
        category_slugs: ["kokyhay-khangy"],
      },
    },
  });

  assert.equal(config.minimumQuantity, 1_000);
  assert.equal(config.percent, 100);
});
