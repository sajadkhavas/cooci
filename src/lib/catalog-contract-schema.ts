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
    productCount: z.number().int().nonnegative().optional(),
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
    category: nullableText(160),
    categorySlug: safeCatalogIdentifierSchema.nullable(),
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
    shippingNote: z.string().max(2_000),
    ingredients: z.array(z.string().max(500)).max(100),
    allergens: z.array(z.string().max(500)).max(100),
    shelfLife: nullableText(1_000),
    storageTips: nullableText(2_000),
    preparationTimeDays: z.number().int().nonnegative().nullable(),
    badges: z.array(z.string().max(160)).max(30),
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
    updatedAt: z.string().datetime({ offset: true }).nullable(),
  })
  .superRefine((product, context) => {
    if (
      product.salePriceToman !== null &&
      product.regularPriceToman !== null &&
      product.salePriceToman > product.regularPriceToman
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["salePriceToman"],
        message: "sale price exceeds regular price",
      });
    }
    if (product.available && product.stock <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["available"],
        message: "available product has no stock",
      });
    }
    if (product.mediaVerified && !product.images.some((image) => image.verified)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mediaVerified"],
        message: "mediaVerified product has no verified image",
      });
    }
  });

export const backendPaginationSchema = z
  .object({
    page: z.number().int().positive(),
    perPage: z.number().int().positive().max(100),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().positive(),
    from: z.number().int().positive().nullable(),
    to: z.number().int().positive().nullable(),
    hasMore: z.boolean(),
  })
  .superRefine((pagination, context) => {
    if (pagination.page > pagination.totalPages) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "page exceeds totalPages",
      });
    }
    if (
      pagination.from !== null &&
      pagination.to !== null &&
      pagination.from > pagination.to
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "from exceeds to",
      });
    }
    if (pagination.to !== null && pagination.to > pagination.total) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "to exceeds total",
      });
    }
    if (pagination.total === 0 && (pagination.from !== null || pagination.to !== null)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "empty pagination has non-null bounds",
      });
    }
  });
