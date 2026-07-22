import assert from "node:assert/strict";
import test from "node:test";
import type { Product } from "@/data/products";
import type { ProductReviewsResult } from "@/lib/content";
import { createProductMerchantSchema } from "@/lib/seo/product-merchant-schema";

type RuntimeProduct = Product & {
  available: boolean;
  contentVerified: boolean;
  mediaVerified: boolean;
  inventoryVerified: boolean;
};

const product = {
  id: "merchant-product",
  slug: "merchant-cookie",
  name: "کوکی تست مرچنت",
  shortDescription: "توضیح معتبر محصول",
  longDescription: "توضیح کامل معتبر محصول",
  category: "کوکی‌ها",
  categorySlug: "cookies",
  price: 180000,
  priceToman: 180000,
  badges: [],
  allergens: [],
  ingredients: ["آرد"],
  shelfLife: "۷ روز",
  storageTips: "محیط خشک",
  stock: 8,
  requiresCooling: false,
  shippingScope: "nationwide",
  shippingNote: "ارسال سراسری",
  images: [
    {
      url: "https://cdn.example.com/merchant-cookie.webp",
      alt: "کوکی تست مرچنت",
    },
  ],
  isFeatured: true,
  productCode: "MERCHANT-P",
  variants: [
    {
      id: "merchant-variant",
      name: "بسته ۶ عددی",
      price: 180000,
      weight: "۳۰۰ گرم",
      productCode: "MERCHANT-V1",
      stock: 8,
      available: true,
      isDefault: true,
      regularPriceToman: 180000,
    },
  ],
  seo: {
    title: "کوکی تست مرچنت",
    description: "توضیح معتبر محصول",
  },
  available: true,
  contentVerified: true,
  mediaVerified: true,
  inventoryVerified: true,
} satisfies RuntimeProduct;

const reviews: ProductReviewsResult = {
  reviews: [
    {
      id: "review-1",
      rating: 5,
      title: "تازه و خوش‌طعم",
      body: "سفارش به‌موقع رسید و محصول تازه بود.",
      verifiedPurchase: true,
      customerName: "سارا",
      publishedAt: "2026-07-22T10:00:00+00:00",
    },
  ],
  summary: { count: 1, averageRating: 5 },
};

test("verified Laravel price and inventory create an IRR merchant Offer", () => {
  const schema = createProductMerchantSchema({
    product,
    reviews,
    siteOrigin: "https://winimibakery.com",
    brandName: "وینیمی بیکری",
  });
  const offer = schema.offers as Record<string, unknown>;

  assert.equal(schema["@type"], "Product");
  assert.equal(schema.sku, "MERCHANT-V1");
  assert.equal(offer.price, 1_800_000);
  assert.equal(offer.priceCurrency, "IRR");
  assert.equal(offer.availability, "https://schema.org/InStock");
  assert.equal(offer.url, "https://winimibakery.com/products/merchant-cookie");
  assert.equal("shippingDetails" in offer, false);
  assert.equal("hasMerchantReturnPolicy" in offer, false);
});

test("unverified inventory omits the complete Offer instead of guessing availability", () => {
  const schema = createProductMerchantSchema({
    product: { ...product, inventoryVerified: false },
    siteOrigin: "https://winimibakery.com",
    brandName: "وینیمی بیکری",
  });

  assert.equal("offers" in schema, false);
});

test("only visible approved review data becomes rating markup", () => {
  const schema = createProductMerchantSchema({
    product,
    reviews,
    siteOrigin: "https://winimibakery.com",
    brandName: "وینیمی بیکری",
  });
  const aggregateRating = schema.aggregateRating as Record<string, unknown>;
  const visibleReviews = schema.review as Array<Record<string, unknown>>;

  assert.equal(aggregateRating.ratingValue, 5);
  assert.equal(aggregateRating.reviewCount, 1);
  assert.equal(visibleReviews.length, 1);
  assert.equal(visibleReviews[0].reviewBody, reviews.reviews[0].body);
});

test("invalid or empty rating summaries never create aggregateRating", () => {
  const schema = createProductMerchantSchema({
    product,
    reviews: {
      reviews: [],
      summary: { count: 0, averageRating: 0 },
    },
    siteOrigin: "https://winimibakery.com",
    brandName: "وینیمی بیکری",
  });

  assert.equal("aggregateRating" in schema, false);
  assert.equal("review" in schema, false);
});

test("unverified media is omitted from merchant markup", () => {
  const schema = createProductMerchantSchema({
    product: { ...product, mediaVerified: false },
    siteOrigin: "https://winimibakery.com",
    brandName: "وینیمی بیکری",
  });

  assert.equal("image" in schema, false);
});
