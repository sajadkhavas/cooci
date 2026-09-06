import assert from "node:assert/strict";
import test from "node:test";
import type { Product } from "@/data/products";
import {
  HOME_CHILLED_QUERY,
  selectColdGalleryProducts,
} from "@/lib/home-cold-gallery";

const product = (id: string, requiresCooling: boolean): Product => ({
  id,
  slug: id,
  name: id,
  shortDescription: "",
  longDescription: "",
  category: "کیک و دسر",
  categorySlug: "cakes",
  badges: [],
  allergens: [],
  ingredients: [],
  shelfLife: "",
  storageTips: "",
  requiresCooling,
  images: [],
  isFeatured: false,
  productCode: id,
});

test("homepage cold query requests only chilled products", () => {
  assert.deepEqual(HOME_CHILLED_QUERY, {
    requiresCooling: true,
    perPage: 6,
    sort: "featured",
  });
});

test("cold gallery excludes dry products, removes duplicates, and respects its limit", () => {
  const chilled = product("chilled", true);
  const second = product("second", true);
  const dry = product("dry", false);

  assert.deepEqual(
    selectColdGalleryProducts([dry, chilled, chilled, second], 2).map(
      (item) => item.id,
    ),
    ["chilled", "second"],
  );
});

test("cold gallery requires an explicit cooling contract", () => {
  const unknown = product("unknown", false);
  delete unknown.requiresCooling;

  assert.deepEqual(selectColdGalleryProducts([unknown]), []);
});
