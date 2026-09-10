import { z } from "zod";

export const safeCatalogIdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .max(180)
  .refine(
    (value) =>
      !value.startsWith("//") &&
      ![...value].some((character) => {
        const code = character.charCodeAt(0);
        return (
          character === "/" ||
          character === "\\" ||
          character === "?" ||
          character === "#" ||
          code <= 31 ||
          code === 127
        );
      }),
    "unsafe identifier",
  );

export const safeCatalogMediaUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(2_048)
  .refine((value) => {
    if (value.startsWith("/") && !value.startsWith("//")) {
      return !value.includes("\\");
    }

    try {
      const parsed = new URL(value);
      return (
        parsed.protocol === "https:" &&
        !parsed.username &&
        !parsed.password
      );
    } catch {
      return false;
    }
  }, "unsafe media URL");

const nullableText = (maximum: number) =>
  z.string().max(maximum).nullable();

export const backendCategorySchema = z
  .object({
    id: safeCatalogIdentifierSchema,
    name: z.string().trim().min(1).max(160),
    slug: safeCatalogIdentifierSchema,
    description: nullableText(5_000),
    image: safeCatalogMediaUrlSchema.nullable(),
    imageAlt: nullableText(255),
    productCount: z.number().int().nonnegative().optional(),
    showOnHome: z.boolean().optional(),
    showInFooter: z.boolean().optional(),
    sortOrder: z.number().int().nonnegative().optional(),
    homeSortOrder: z.number().int().nonnegative().optional(),
    footerSortOrder: z.number().int().nonnegative().optional(),
    seo: z.object({
      title: z.string().max(255),
      description: nullableText(1_000),
    }),
  })
  .passthrough();

export const backendProductImageSchema = z
  .object({
    url: safeCatalogMediaUrlSchema,
    alt: z.string().max(500),
    verified: z.boolean(),
  })
  .passthrough();

export const backendProductVariantSchema = z
  .object({
    id: safeCatalogIdentifierSchema,
    name: z.string().trim().min(1).max(160),
    productCode: z.string().trim().min(1).max(160),
    weightGrams: z.number().int().nonnegative().nullable(),
    weight: nullableText(160),
    priceToman: z.number().int().nonnegative(),
    regularPriceToman: z.number().int().nonnegative(),
    salePriceToman: z.number().int().nonnegative().nullable(),
    stock: z.number().int().nonnegative(),
    available: z.boolean(),
    lowStock: z.boolean(),
    isDefault: z.boolean(),
  })
  .superRefine((variant, context) => {
    if (
      variant.salePriceToman !== null &&
      variant.salePriceToman > variant.regularPriceToman
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["salePriceToman"],
        message: "sale price exceeds regular price",
      });
    }

    if (variant.available && variant.stock <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["available"],
        message: "available variant has no stock",
      });
    }
  });

export const backendProductSchema = z
  .object({
    id: safeCatalogIdentifierSchema,
    slug: safeCatalogIdentifierSchema,
    name: z.string().trim().min(1).max(255),
    productCode: z.string().trim().min(1).max(160),
    shortDescription: nullableText(5_000),
    longDescription: nullableText(50_000),
    tasteNotes: z.array(z.string().max(500)).max(30).default([]),
    textureNotes: z.array(z.string().max(500)).max(30).default([]),
    useCases: z.array(z.string().max(500)).max(30).default([]),
    servingSuggestions: nullableText(5_000).optional().default(null),
    specifications: z.array(z.object({
      label: z.string().trim().min(1).max(100),
      value: z.string().trim().min(1).max(220),
    })).max(50).default([]),
    productFaqs: z.array(z.object({
      question: z.string().trim().min(1).max(220),
      answer: z.string().trim().min(1).max(5_000),
    })).max(30).default([]),
    contentVersion: nullableText(40).optional().default(null),
    contentReviewedAt: nullableText(100).optional().default(null),
    category: nullableText(255),
    categorySlug: nullableText(180),
    categoryData: backendCategorySchema.optional(),
    priceToman: z.number().int().nonnegative().nullable(),
    regularPriceToman: z.number().int().nonnegative().nullable(),
    salePriceToman: z.number().int().nonnegative().nullable(),
    weightGrams: z.number().int().nonnegative().nullable(),
    weight: nullableText(160),
    stock: z.number().int().nonnegative(),
    available: z.boolean(),
    requiresCooling: z.boolean(),
    shippingScope: z.enum(["nationwide", "tehran-karaj"]),
    shippingNote: z.string().max(5_000),
    ingredients: z.array(z.string().max(500)).max(100),
    allergens: z.array(z.string().max(500)).max(100),
    shelfLife: nullableText(500),
    storageTips: nullableText(5_000),
    preparationTimeDays: z.number().int().nonnegative().nullable(),
    badges: z.array(z.string().max(100)).max(30),
    images: z.array(backendProductImageSchema).max(30),
    isFeatured: z.boolean(),
    contentVerified: z.boolean(),
    mediaVerified: z.boolean(),
    inventoryVerified: z.boolean(),
    variants: z.array(backendProductVariantSchema).max(100),
    seo: z.object({
      title: z.string().max(255),
      description: nullableText(1_000),
    }),
    updatedAt: nullableText(100),
  })
  .passthrough();

export const backendPaginationSchema = z.object({
  page: z.number().int().positive(),
  perPage: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  from: z.number().int().nonnegative().nullable(),
  to: z.number().int().nonnegative().nullable(),
  hasMore: z.boolean(),
});
