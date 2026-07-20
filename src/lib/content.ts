import { apiRequest } from "@/lib/api";
import type {
  BackendContentPage,
  BackendInquiryInput,
  BackendPostDetail,
  BackendPostSummary,
  BackendReview,
  BackendReviewSummary,
  BackendStoreSettings,
} from "@/lib/backend-contract";

export interface StoreFaq {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export interface StoreGalleryItem {
  id: number;
  title: string;
  caption: string | null;
  imageUrl: string;
  linkUrl: string | null;
}

export interface StoreCityPage {
  id: string;
  city: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  seo: {
    title: string | null;
    description: string | null;
  };
}

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

export const loadStoreSettings = async (): Promise<BackendStoreSettings> =>
  (await apiRequest<BackendStoreSettings>("/api/store/settings")).data;

export const loadContentPage = async (slug: string) =>
  (
    await apiRequest<BackendContentPage>(
      `/api/store/pages/${encodeURIComponent(slug)}`,
    )
  ).data.page;

export const loadFaqs = async (category?: string): Promise<StoreFaq[]> => {
  const params = new URLSearchParams();
  if (category?.trim()) params.set("category", category.trim());
  const query = params.toString();
  return (
    await apiRequest<StoreFaq[]>(`/api/store/faqs${query ? `?${query}` : ""}`)
  ).data;
};

export const loadGallery = async (): Promise<StoreGalleryItem[]> =>
  (await apiRequest<StoreGalleryItem[]>("/api/store/gallery")).data;

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
    page: String(page),
    perPage: String(perPage),
  });
  if (category?.trim()) params.set("category", category.trim());
  if (search?.trim()) params.set("search", search.trim());
  const response = await apiRequest<BackendPostSummary[]>(
    `/api/store/posts?${params.toString()}`,
  );
  const pagination = response.meta.pagination;
  return {
    posts: response.data,
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

export const loadPost = async (slug: string): Promise<BackendPostDetail> =>
  (
    await apiRequest<{ post: BackendPostDetail }>(
      `/api/store/posts/${encodeURIComponent(slug)}`,
    )
  ).data.post;

export const loadCityPage = async (slug: string): Promise<StoreCityPage> =>
  (
    await apiRequest<{ city: StoreCityPage }>(
      `/api/store/cities/${encodeURIComponent(slug)}`,
    )
  ).data.city;

export const loadProductReviews = async (
  slug: string,
  page = 1,
  perPage = 10,
): Promise<ProductReviewsResult> => {
  const response = await apiRequest<BackendReview[]>(
    `/api/catalog/products/${encodeURIComponent(slug)}/reviews?page=${page}&perPage=${perPage}`,
  );
  const summaryCandidate = response.meta.summary;
  const summary =
    summaryCandidate && typeof summaryCandidate === "object"
      ? (summaryCandidate as BackendReviewSummary)
      : { count: 0, averageRating: 0 };
  const pagination = response.meta.pagination;
  return {
    reviews: response.data,
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

export const submitInquiry = async (input: BackendInquiryInput) =>
  (
    await apiRequest<{
      inquiry: { id: string; type: string; status: string };
    }>("/api/inquiries", {
      method: "POST",
      body: input,
    })
  ).data.inquiry;
