import { apiRequest } from "@/lib/api";
import { fetchCatalogProducts } from "@/lib/catalog-api";
import type {
  BackendInquiryInput,
  BackendPostDetail,
  BackendPostSummary,
  BackendReview,
  BackendReviewSummary,
  BackendStoreSettings,
} from "@/lib/backend-contract";
import {
  parseCityPage,
  parseContentPage,
  parseFaqs,
  parseGallery,
  parseInquiryResult,
  parsePagination,
  parsePost,
  parsePosts,
  parseReviews,
  parseReviewSummary,
  parseStoreSettings,
  type ParsedCityPage,
  type ParsedFaq,
  type ParsedGalleryItem,
  type ParsedInquiryResult,
} from "@/lib/content-schema";

export type StoreFaq = ParsedFaq;
export type StoreGalleryItem = ParsedGalleryItem;
export type StoreCityPage = ParsedCityPage;

export interface StorePostsResult {
  posts: BackendPostSummary[];
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    hasMore: boolean;
  };
}

export interface ProductReviewsResult {
  reviews: BackendReview[];
  summary: BackendReviewSummary;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    hasMore: boolean;
  };
}

export interface StoreReviewWallItem extends BackendReview {
  productName: string;
  productSlug: string;
}

export interface StoreReviewWallResult {
  reviews: StoreReviewWallItem[];
  publishedReviewCount: number;
  productCount: number;
}

export const loadStoreSettings = async (): Promise<BackendStoreSettings> => {
  const response = await apiRequest<unknown>("/api/store/settings");
  return parseStoreSettings(response.data);
};

export const loadContentPage = async (slug: string) => {
  const response = await apiRequest<unknown>(
    `/api/store/pages/${encodeURIComponent(slug)}`,
  );
  return parseContentPage(response.data);
};

export const loadFaqs = async (category?: string): Promise<StoreFaq[]> => {
  const params = new URLSearchParams();
  if (category?.trim()) params.set("category", category.trim().slice(0, 100));
  const query = params.toString();
  const response = await apiRequest<unknown>(
    `/api/store/faqs${query ? `?${query}` : ""}`,
  );
  return parseFaqs(response.data);
};

export const loadGallery = async (): Promise<StoreGalleryItem[]> => {
  const response = await apiRequest<unknown>("/api/store/gallery");
  return parseGallery(response.data);
};

export const loadPosts = async ({
  page = 1,
  perPage = 12,
  category,
  search,
}: {
  page?: number;
  perPage?: number;
  category?: string;
  search?: string;
} = {}): Promise<StorePostsResult> => {
  const params = new URLSearchParams({
    page: String(Math.max(1, Math.trunc(page))),
    perPage: String(Math.min(48, Math.max(1, Math.trunc(perPage)))),
  });
  if (category?.trim()) params.set("category", category.trim().slice(0, 120));
  if (search?.trim()) params.set("search", search.trim().slice(0, 100));
  const response = await apiRequest<unknown>(
    `/api/store/posts?${params.toString()}`,
  );
  const posts = parsePosts(response.data);
  const pagination = response.meta.pagination
    ? parsePagination(response.meta.pagination)
    : undefined;
  return {
    posts,
    pagination: pagination
      ? {
          page: pagination.page,
          totalPages: pagination.totalPages,
          total: pagination.total,
          hasMore: pagination.hasMore,
        }
      : undefined,
  };
};

export const loadPost = async (slug: string): Promise<BackendPostDetail> => {
  const response = await apiRequest<unknown>(
    `/api/store/posts/${encodeURIComponent(slug)}`,
  );
  return parsePost(response.data);
};

export const loadCityPage = async (slug: string): Promise<StoreCityPage> => {
  const response = await apiRequest<unknown>(
    `/api/store/cities/${encodeURIComponent(slug)}`,
  );
  return parseCityPage(response.data);
};

export const loadProductReviews = async (
  slug: string,
  page = 1,
  perPage = 10,
): Promise<ProductReviewsResult> => {
  const safePage = Math.max(1, Math.trunc(page));
  const safePerPage = Math.min(30, Math.max(1, Math.trunc(perPage)));
  const response = await apiRequest<unknown>(
    `/api/catalog/products/${encodeURIComponent(slug)}/reviews?page=${safePage}&perPage=${safePerPage}`,
  );
  const reviews = parseReviews(response.data);
  const summaryCandidate = response.meta.summary;
  const summary = summaryCandidate
    ? parseReviewSummary(summaryCandidate)
    : { count: 0, averageRating: 0 };
  const pagination = response.meta.pagination
    ? parsePagination(response.meta.pagination)
    : undefined;
  return {
    reviews,
    summary,
    pagination: pagination
      ? {
          page: pagination.page,
          totalPages: pagination.totalPages,
          total: pagination.total,
          hasMore: pagination.hasMore,
        }
      : undefined,
  };
};

const REVIEW_WALL_PAGE_SIZE = 48;
const REVIEW_WALL_MAX_PRODUCTS = 96;
const REVIEW_WALL_BATCH_SIZE = 8;
const REVIEW_WALL_CACHE_TTL_MS = 60_000;

let reviewWallCache:
  | {
      expiresAt: number;
      promise: Promise<StoreReviewWallResult>;
    }
  | undefined;

const loadReviewWallFresh = async (): Promise<StoreReviewWallResult> => {
  const products = [];
  let page = 1;
  let totalPages = 1;
  let totalProducts = 0;

  do {
    const catalog = await fetchCatalogProducts({
      page,
      perPage: REVIEW_WALL_PAGE_SIZE,
      sort: "featured",
    });

    totalPages = Math.max(1, catalog.pagination.totalPages);

    totalProducts = Math.max(totalProducts, catalog.pagination.total);

    if (
      totalProducts > REVIEW_WALL_MAX_PRODUCTS ||
      totalPages > Math.ceil(REVIEW_WALL_MAX_PRODUCTS / REVIEW_WALL_PAGE_SIZE)
    ) {
      throw new Error(
        "Review wall catalog exceeds the safe aggregation limit; a dedicated backend review-wall endpoint is required.",
      );
    }

    products.push(...catalog.products);
    page += 1;
  } while (page <= totalPages);

  const results: Array<{
    product: (typeof products)[number];
    result: ProductReviewsResult;
  }> = [];

  for (
    let offset = 0;
    offset < products.length;
    offset += REVIEW_WALL_BATCH_SIZE
  ) {
    const batch = products.slice(offset, offset + REVIEW_WALL_BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map(async (product) => ({
        product,
        result: await loadProductReviews(product.slug, 1, 20),
      })),
    );

    results.push(...batchResults);
  }

  const reviews = results.flatMap(({ product, result }) =>
    result.reviews.map((review) => ({
      ...review,
      productName: product.name,
      productSlug: product.slug,
    })),
  );

  const publishedReviewCount = results.reduce(
    (total, { result }) =>
      total +
      (result.pagination?.total ??
        result.summary.count ??
        result.reviews.length),
    0,
  );

  return {
    reviews,
    publishedReviewCount,
    productCount: products.length,
  };
};

export const loadReviewWall = async (): Promise<StoreReviewWallResult> => {
  const now = Date.now();

  if (reviewWallCache && reviewWallCache.expiresAt > now) {
    return reviewWallCache.promise;
  }

  const promise: Promise<StoreReviewWallResult> = loadReviewWallFresh().catch(
    (error) => {
      if (reviewWallCache?.promise === promise) {
        reviewWallCache = undefined;
      }

      throw error;
    },
  );

  reviewWallCache = {
    expiresAt: now + REVIEW_WALL_CACHE_TTL_MS,
    promise,
  };

  return promise;
};

export const submitInquiry = async (
  input: BackendInquiryInput,
): Promise<ParsedInquiryResult> => {
  const response = await apiRequest<unknown>("/api/inquiries", {
    method: "POST",
    body: input,
  });
  return parseInquiryResult(response.data);
};
