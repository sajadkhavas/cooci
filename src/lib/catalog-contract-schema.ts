import { z } from "zod";

export const safeCatalogIdentifierSchema = z.string().trim().min(1).max(180).refine(((value) => !value.startsWith("//") && ![...value].some((character) => { const code = character.charCodeAt(0); return character === "/" || character === "\\" || character === "?" || character === "#" || code <= 31 || code === 127; }), "unsafe identifier");

export const safeCatalogMediaUrlSchema = z.string().trim().min(1).max(2_048).refine((value) => {
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

const nullableText = (maximum: number) => z.string().max(maximum).nullable();

export const backendCategorySchema = z.object({
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
}).passthrough();

export const backendProductImageSchema = z.object({
  url: safeCatalogMediaUrlSchema,
  alt: z.string().max(500),
  verified: z.boolean(),
}).passthrough();

export const backendProductVariantSchema = z.object({
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
}).superRefine((variant, context) => {
  if (variant.salePriceToman !== null && variant.salePriceToman > variant.regularPriceToman) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["salePriceToman"], message: "sale price exceeds regular price" });
  }
  if (variant.available && variant.stock <= 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["available"], message: "available variant has no stock" });
  }
});

export const backendProductSchema = z.object({
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
  seo: z.object({ title: z.string().max(255), description: nullableText(1_000) }),
  updatedAt: z.string().datetime({ offset: true }).nullable(),
}).superRefine((product, context) => {
  if (product.salePriceToman !== null && product.regularPriceToman !== null && product.salePriceToman > product.regularPriceToman) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["salePriceToman"], message: "sale price exceeds regular price" });
  }
  if (product.available && product.stock <= 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["available"], message: "available product has no stock" });
  }
}).transform((product) => ({ ...product, mediaVerified: product.mediaVerified && product.images.some((image) => image.verified) }));

export const backendPaginationSchema = z.object({
  page: z.number().int().positive(),
  perPage: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().positive(),
  from: z.number().int().positive().nullable(),
  to: z.number().int().positive().nullable(),
  hasMore: z.boolean(),
}).superRefine((pagination, context) => {
  if (pagination.page > pagination.totalPages) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "page exceeds totalPages" });
  }
  if (pagination.from !== null€˜˜Á…¥¹…Ñ¥½¸¹Ñ¼€„ôô¹Õ±°€˜˜Á…¥¹…Ñ¥½¸¹™É½´€øÁ…¥¹…Ñ¥½¸¹Ñ¼¤ì(€€€½¹Ñ•áĞ¹…‘‘%ÍÍÕ”¡ì½‘”èè¹i½‘%ÍÍÕ•½‘”¹ÕÍÑ½´°µ•ÍÍ…”è€‰™É½´•á••‘ÌÑ¼ˆô¤ì(€ô(€¥˜€¡Á…¥¹…Ñ¥½¸¹Ñ¼€„ôô¹Õ±°€˜˜Á…¥¹…Ñ¥½¸¹Ñ¼€øÁ…¥¹…Ñ¥½¸¹Ñ½Ñ…°¤ì(€€€½¹Ñ•áĞ¹…‘‘%ÍÍÕ”¡ì½‘”èè¹i½‘%ÍÍÕ•½‘”¹ÕÍÑ½´°µ•ÍÍ…”è€‰Ñ¼•á••‘ÌÑ½Ñ…°ˆô¤ì(€ô(€¥˜€¡Á…¥¹…Ñ¥½¸¹Ñ½Ñ…°€ôôô€À€˜˜€¡Á…¥¹…Ñ¥½¸¹™É½´€„ôô¹Õ±°ñğÁ…¥¹…Ñ¥½¸¹Ñ¼€„ôô¹Õ±°¤¤ì(€€€½¹Ñ•áĞ¹…‘‘%ÍÍÕ”¡ì½‘”èè¹i½‘%ÍÍÕ•½‘”¹ÕÍÑ½´°µ•ÍÍ…”è€‰•µÁÑäÁ…¥¹…Ñ¥½¸¡…Ì¹½¸µ¹Õ±°‰½Õ¹‘Ìˆô¤ì(€ô)ô¤ì(