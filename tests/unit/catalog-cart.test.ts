import assert from "node:assert/strict";
import test from "node:test";
import {
  backendPaginationSchema,
  backendProductSchema,
} from "../../src/lib/catalog-contract-schema.ts";
import {
  MAX_CART_ITEMS,
  parseStoredCart,
  sanitizeCartItem,
  type CartItem,
} from "../../src/lib/cart.ts";
import {
  cartReducer,
  syncCartItemWithCatalog,
} from "../../src/lib/cart-state.ts";
import {
  getProductStock,
  getVariantDisplayPrice,
  getVariantRegularPrice,
} from "../../src/lib/catalog.ts";
import { getPreferredProductVariant } from "../../src/lib/product-selection.ts";

const backendProductFixture = {
  id: "prod-cookie",
  slug: "chocolate-cookie",
  name: "Chocolate Cookie",
  productCode: "COOKIE-001",
  shortDescription: "Short description",
  longDescription: "Full description",
  category: "Cookies",
  categorySlug: "cookies",
  priceToman: 120_000,
  regularPriceToman: 150_000,
  salePriceToman: 120_000,
  weightGrams: 300,
  weight: "300 grams",
  stock: 5,
  available: true,
  requiresCooling: false,
  shippingScope: "nationwide",
  shippingNote: "Nationwide delivery",
  ingredients: [],
  allergens: [],
  shelfLife: "7 days",
  storageTips: "Keep dry",
  preparationTimeDays: 1,
  badges: [],
  images: [
    {
      url: "https://cdn.example.com/cookie.jpg",
      alt: "Chocolate Cookie",
      verified: true,
    },
  ],
  isFeatured: true,
  contentVerified: true,
  mediaVerified: true,
  inventoryVerified: true,
  variants: [
    {
      id: "variant-six",
      name: "Pack of six",
      productCode: "COOKIE-001-6",
      weightGrams: 300,
      weight: "300 grams",
      priceToman: 120_000,
      regularPriceToman: 150_000,
      salePriceToman: 120_000,
      stock: 5,
      available: true,
      lowStock: true,
      isDefault: true,
    },
  ],
  seo: {
    title: "Chocolate Cookie",
    description: "Winimi chocolate cookie",
  },
  updatedAt: "2026-07-20T10:00:00+00:00",
};

const storedCartCandidate = {
  id: "prod-cookie",
  slug: "chocolate-cookie",
  name: "Chocolate Cookie",
  productCode: "COOKIE-001",
  priceToman: 120_000,
  quantity: 2,
  requiresCooling: false,
  image: "/assets/cookie.jpg",
};

const catalogProductFixture = {
  id: "prod-cookie",
  slug: "chocolate-cookie",
  name: "Chocolate Cookie",
  shortDescription: "",
  longDescription: "",
  category: "Cookies",
  categorySlug: "cookies",
  price: 120_000,
  priceToman: 150_000,
  salePriceToman: 120_000,
  badges: [],
  allergens: [],
  ingredients: [],
  shelfLife: "",
  storageTips: "",
  stock: 5,
  requiresCooling: false,
  shippingScope: "nationwide",
  shippingNote: "",
  images: [{ url: "/assets/cookie.jpg", alt: "Cookie" }],
  isFeatured: true,
  productCode: "COOKIE-001",
  variants: [
    {
      id: "variant-default-empty",
      name: "Unavailable default",
      price: 120_000,
      productCode: "COOKIE-001-0",
      stock: 0,
      regularPriceToman: 150_000,
      salePriceToman: 120_000,
      available: false,
      isDefault: true,
    },
    {
      id: "variant-available",
      name: "Available",
      price: 110_000,
      productCode: "COOKIE-001-1",
      stock: 3,
      regularPriceToman: 140_000,
      salePriceToman: 110_000,
      available: true,
      isDefault: false,
    },
  ],
};

test("runtime catalog contract accepts a consistent product", () => {
  const result = backendProductSchema.safeParse(backendProductFixture);
  assert.equal(result.success, true);
});

test("unverifiable media is downgraded without hiding an otherwise valid product", () => {
  const withoutMedia = structuredClone(backendProductFixture);
  withoutMedia.images = [];
  withoutMedia.mediaVerified = true;

  const result = backendProductSchema.parse(withoutMedia);
  assert.equal(result.mediaVerified, false);
  assert.deepEqual(result.images, []);
});

test("runtime catalog contract rejects unsafe media and identifiers", () => {
  const unsafeMedia = structuredClone(backendProductFixture);
  unsafeMedia.images[0].url = "javascript:alert(1)";
  assert.equal(backendProductSchema.safeParse(unsafeMedia).success, false);

  const unsafeSlug = structuredClone(backendProductFixture);
  unsafeSlug.slug = "cookies/../../admin";
  assert.equal(backendProductSchema.safeParse(unsafeSlug).success, false);
});

test("runtime catalog contract rejects contradictory stock truth", () => {
  const contradictory = structuredClone(backendProductFixture);
  contradictory.stock = 0;
  contradictory.available = true;
  assert.equal(backendProductSchema.safeParse(contradictory).success, false);

  const badVariant = structuredClone(backendProductFixture);
  badVariant.variants[0].stock = 0;
  badVariant.variants[0].available = true;
  assert.equal(backendProductSchema.safeParse(badVariant).success, false);
});

test("pagination contract rejects impossible bounds", () => {
  assert.equal(
    backendPaginationSchema.safeParse({
      page: 2,
      perPage: 12,
      total: 3,
      totalPages: 1,
      from: 13,
      to: 15,
      hasMore: false,
    }).success,
    false,
  );
});

test("missing persisted stock becomes unavailable instead of fabricated", () => {
  const item = sanitizeCartItem(storedCartCandidate);
  assert.ok(item);
  assert.equal(item.stock, 0);
  assert.equal(item.availability, "unavailable");
});

test("untrusted cart persistence is bounded and deduplicated", () => {
  const candidates = Array.from({ length: MAX_CART_ITEMS + 50 }, (_, index) => ({
    ...storedCartCandidate,
    id: `product-${index}`,
    slug: `product-${index}`,
    productCode: `P-${index}`,
    stock: 5,
    availability: "available",
  }));
  const parsed = parseStoredCart(JSON.stringify({ version: 2, items: candidates }));
  assert.equal(parsed.length, MAX_CART_ITEMS);
});

test("cart reducer refuses add actions without a known positive stock", () => {
  const state = cartReducer(
    { items: [] },
    {
      type: "ADD",
      quantity: 1,
      item: storedCartCandidate,
    },
  );
  assert.deepEqual(state.items, []);
});

test("a partial catalog page cannot invalidate an absent cart product", () => {
  const stored = sanitizeCartItem({
    ...storedCartCandidate,
    stock: 2,
    availability: "available",
  }) as CartItem;
  const synchronized = syncCartItemWithCatalog(stored, []);
  assert.deepEqual(synchronized, stored);
});

test("exact Variant reconciliation refreshes price, discount and stock", () => {
  const stored = sanitizeCartItem({
    ...storedCartCandidate,
    regularPriceToman: 150_000,
    stock: 9,
    availability: "available",
    selectedVariant: {
      id: "variant-available",
      name: "Available",
      priceToman: 99_000,
      stock: 9,
    },
  }) as CartItem;
  const synchronized = syncCartItemWithCatalog(stored, [catalogProductFixture]);

  assert.equal(synchronized.priceToman, 110_000);
  assert.equal(synchronized.regularPriceToman, 140_000);
  assert.equal(synchronized.stock, 3);
  assert.equal(synchronized.selectedVariant?.stock, 3);
  assert.equal(synchronized.availability, "available");
});

test("unknown catalog stock is zero and preferred Variant must be available", () => {
  assert.equal(getProductStock({ ...catalogProductFixture, stock: undefined }), 0);
  const preferred = getPreferredProductVariant(catalogProductFixture);
  assert.equal(preferred?.id, "variant-available");
  assert.equal(getVariantDisplayPrice(preferred), 110_000);
  assert.equal(getVariantRegularPrice(preferred), 140_000);
});
