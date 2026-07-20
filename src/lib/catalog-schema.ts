import { z } from "zod";
import { ApiError } from "@/lib/api";
import type {
  BackendCategory,
  BackendPagination,
  BackendProduct,
} from "@/lib/backend-contract";

const safeIdentifier = z
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

const safeMediaUrl = z
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

const categorySchema = z
  .object({
    id: safeIdentifier,
    name: z.string().trim().min(1).max(160),
    slug: safeIdentifier,
    description: nullableText(5_000),
    image: safeMediaUrl.nullable(),
    productCount: z.number().int().nonnegative().optional(),
    seo: z.object({
      title: z.string().max(255),
      description: nullableText(1_000),
    }),
  })
  .passthrough();

const imageSchema = z
  .object({
    url: safeMediaUrl,
    alt: z.string().max(500),
    verified: z.boolean(),
  })
  .passthrough();

const variantSchema = z
  .object({
    id: safeIdentifier,
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
  .passthrough();

const productSchema = z
  .object({
    id: safeIdentifier,
    slug: safeIdentifier,
    name: z.string().trim().min(1).max(255),
    productCode: z.string().trim().min(1).max(160),
    shortDescription: nullableText(5_000),
    longDescription: nullableText(50_000),
    category: nullableText(160),
    categorySlug: safeIdentifier.nullable(),
    categoryData: categorySchema.optional(),
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
    images: z.array(imageSchema).max(30),
    isFeatured: z.boolean(),
    contentVerified: z.boolean(),
    mediaVerified: z.boolean(),
    inventoryVerified: z.boolean(),
    variants: z.array(variantSchema).max(100),
    seo: z.object({
      title: z.string().max(255),
      description: nullableText(1_000),
    }),
    updatedAt: z.string().datetime({ offset: true }).nullable(),
  })
  .passthrough();

const paginationSchema = z
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
    if (pagination.from !== null && pagination.to !== null && pagination.from > pagination.to) {
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
  });

const invalidCatalogContract = (issues: z.ZodIssue[]) =>
  new ApiError({
    message: "ساختار اطلاعات کاتالوگ با قرارداد فرانت‌اند سازگار نیست.",
    status: 502,
    code: "invalid_catalog_contract",
    errors: {
      issues: issues.slice(0, 20).map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    },
  });

const parseWithContract = <T>(schema: z.ZodType<T>, value: unknown): T => {
  const result = schema.safeParse(value);
  if (!result.success) throw invalidCatalogContract(result.error.issues);
  return result.data;
};

export const parseBackendProduct = (value: unknown): BackendProduct =>
  parseWithContract(productSchema, value) as BackendProduct;

export const parseBackendProducts = (value: unknown): BackendProduct[] =>
  parseWithContract(z.array(productSchema).max(100), value) as BackendProduct[];

export const parseBackendCategories = (value: unknown): BackendCategory[] =>
  parseWithContract(z.array(categorySchema).max(100), value) as BackendCategory[];

export const parseBackendPagination = (value: unknown): BackendPagination =>
  parseWithContract(paginationSchema, value) as BackendPagination;
