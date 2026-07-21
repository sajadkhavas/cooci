import { z } from "zod";

const boundedText = (maximum: number) => z.string().max(maximum);
const requiredText = (maximum: number) => z.string().trim().min(1).max(maximum);
const nullableText = (maximum: number) => boundedText(maximum).nullable();
const nullableIsoDate = z.string().datetime({ offset: true }).nullable();

const safeIdentifier = requiredText(180).refine(
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

const safeSlug = requiredText(180).regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "unsafe slug",
);

const isSafePublicUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 2_048) return false;
  if ([...trimmed].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127 || character === "\\";
  })) return false;
  if (trimmed.startsWith("/")) return !trimmed.startsWith("//");
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
};

export const publicUrlSchema = z
  .string()
  .trim()
  .max(2_048)
  .refine(isSafePublicUrl, "unsafe public URL");

export const nullablePublicUrlSchema = publicUrlSchema.nullable();

export const contentSeoSchema = z.object({
  title: nullableText(255),
  description: nullableText(500),
});

export const storeSettingsSchema = z.object({
  settings: z.record(z.unknown()),
  trust: z.object({
    enamad: z.object({
      enabled: z.boolean(),
      badgeCode: nullableText(20_000),
    }),
  }),
});

export const contentPageSchema = z.object({
  id: safeIdentifier,
  type: requiredText(80),
  slug: safeSlug,
  title: requiredText(255),
  excerpt: nullableText(2_000),
  content: boundedText(100_000),
  seo: contentSeoSchema,
  publishedAt: nullableIsoDate,
});

export const contentPageEnvelopeSchema = z.object({
  page: contentPageSchema,
});

export const faqSchema = z.object({
  id: z.number().int().positive(),
  category: requiredText(120),
  question: requiredText(1_000),
  answer: boundedText(10_000),
});

export const galleryItemSchema = z.object({
  id: z.number().int().positive(),
  title: requiredText(255),
  caption: nullableText(2_000),
  imageUrl: publicUrlSchema,
  linkUrl: nullablePublicUrlSchema,
});

export const cityPageSchema = z.object({
  id: safeIdentifier,
  city: requiredText(160),
  slug: safeSlug,
  title: requiredText(255),
  description: boundedText(2_000),
  content: boundedText(100_000),
  seo: contentSeoSchema,
});

export const postSummarySchema = z.object({
  id: safeIdentifier,
  slug: safeSlug,
  title: requiredText(255),
  excerpt: nullableText(2_000),
  category: nullableText(160),
  tags: z.array(requiredText(120)).max(40),
  coverUrl: nullablePublicUrlSchema,
  author: nullableText(160),
  publishedAt: nullableIsoDate,
});

export const postDetailSchema = postSummarySchema.extend({
  content: boundedText(200_000),
  viewCount: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
});

export const reviewSchema = z.object({
  id: safeIdentifier,
  rating: z.number().int().min(1).max(5),
  title: nullableText(255),
  body: nullableText(10_000),
  verifiedPurchase: z.boolean(),
  customerName: requiredText(160),
  publishedAt: nullableIsoDate,
});

export const reviewSummarySchema = z.object({
  count: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  averageRating: z.number().min(0).max(5),
});

export const inquiryResultSchema = z.object({
  id: safeIdentifier,
  type: z.enum(["contact", "gift", "corporate"]),
  status: requiredText(80),
});

export const paginationSchema = z.object({
  page: z.number().int().positive(),
  perPage: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  from: z.number().int().positive().nullable(),
  to: z.number().int().positive().nullable(),
  hasMore: z.boolean(),
}).superRefine((pagination, context) => {
  if (pagination.total === 0 && (pagination.from !== null || pagination.to !== null)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "empty pagination cannot expose a range",
    });
  }
  if (pagination.from !== null && pagination.to !== null && pagination.from > pagination.to) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "pagination range is inverted",
    });
  }
  if (pagination.totalPages === 0 && pagination.total > 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "positive total requires at least one page",
    });
  }
});

export const contentContractSchemas = {
  storeSettings: storeSettingsSchema,
  contentPageEnvelope: contentPageEnvelopeSchema,
  faqs: z.array(faqSchema).max(500),
  gallery: z.array(galleryItemSchema).max(500),
  posts: z.array(postSummarySchema).max(100),
  postDetail: z.object({ post: postDetailSchema }),
  city: z.object({ city: cityPageSchema }),
  reviews: z.array(reviewSchema).max(100),
  inquiry: z.object({ inquiry: inquiryResultSchema }),
};
