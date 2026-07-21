import { z } from "zod";
import { ApiError } from "@/lib/api";
import type {
  BackendContentPage,
  BackendPostDetail,
  BackendPostSummary,
  BackendReview,
  BackendReviewSummary,
  BackendStoreSettings,
} from "@/lib/backend-contract";
import {
  cityPageSchema,
  contentContractSchemas,
  faqSchema,
  galleryItemSchema,
  inquiryResultSchema,
  paginationSchema,
  postDetailSchema,
  postSummarySchema,
  reviewSchema,
  reviewSummarySchema,
  storeSettingsSchema,
} from "@/lib/content-contract-schema";

const invalidContentContract = (issues: z.ZodIssue[]) =>
  new ApiError({
    message: "ساختار محتوای دریافتی با قرارداد فرانت‌اند سازگار نیست.",
    status: 502,
    code: "invalid_content_contract",
    errors: {
      issues: issues.slice(0, 20).map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    },
  });

const parseWithContract = <T>(schema: z.ZodTypeAny, value: unknown): T => {
  const result = schema.safeParse(value);
  if (!result.success) throw invalidContentContract(result.error.issues);
  return result.data as T;
};

export interface ParsedFaq {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export interface ParsedGalleryItem {
  id: number;
  title: string;
  caption: string | null;
  imageUrl: string;
  linkUrl: string | null;
}

export interface ParsedCityPage {
  id: string;
  city: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  seo: { title: string | null; description: string | null };
}

export interface ParsedInquiryResult {
  id: string;
  type: "contact" | "gift" | "corporate";
  status: string;
}

export const parseStoreSettings = (value: unknown): BackendStoreSettings =>
  parseWithContract<BackendStoreSettings>(storeSettingsSchema, value);

export const parseContentPage = (value: unknown): BackendContentPage["page"] =>
  parseWithContract<BackendContentPage>(
    contentContractSchemas.contentPageEnvelope,
    value,
  ).page;

export const parseFaqs = (value: unknown): ParsedFaq[] =>
  parseWithContract<ParsedFaq[]>(z.array(faqSchema).max(500), value);

export const parseGallery = (value: unknown): ParsedGalleryItem[] =>
  parseWithContract<ParsedGalleryItem[]>(z.array(galleryItemSchema).max(500), value);

export const parsePosts = (value: unknown): BackendPostSummary[] =>
  parseWithContract<BackendPostSummary[]>(z.array(postSummarySchema).max(100), value);

export const parsePost = (value: unknown): BackendPostDetail =>
  parseWithContract<{ post: BackendPostDetail }>(
    contentContractSchemas.postDetail,
    value,
  ).post;

export const parseCityPage = (value: unknown): ParsedCityPage =>
  parseWithContract<{ city: ParsedCityPage }>(
    contentContractSchemas.city,
    value,
  ).city;

export const parseReviews = (value: unknown): BackendReview[] =>
  parseWithContract<BackendReview[]>(z.array(reviewSchema).max(100), value);

export const parseReviewSummary = (value: unknown): BackendReviewSummary =>
  parseWithContract<BackendReviewSummary>(reviewSummarySchema, value);

export const parseInquiryResult = (value: unknown): ParsedInquiryResult =>
  parseWithContract<{ inquiry: ParsedInquiryResult }>(
    contentContractSchemas.inquiry,
    value,
  ).inquiry;

export const parsePagination = (value: unknown) =>
  parseWithContract<z.infer<typeof paginationSchema>>(paginationSchema, value);

export const contentRuntimeSchemas = {
  cityPageSchema,
  faqSchema,
  galleryItemSchema,
  inquiryResultSchema,
  postDetailSchema,
  postSummarySchema,
};
