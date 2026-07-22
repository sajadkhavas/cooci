import type { Product } from "@/data/products";
import { ApiError } from "@/lib/api";
import type {
  BackendPostDetail,
} from "@/lib/backend-contract";
import type {
  CatalogCategory,
  CatalogPage,
  CatalogQuery,
} from "@/lib/catalog-api";
import type {
  StoreCityPage,
  StorePostsResult,
} from "@/lib/content";

export interface PublicSsrLoaderData {
  catalogs?: Record<string, CatalogPage>;
  categories?: CatalogCategory[];
  product?: Product;
  posts?: StorePostsResult;
  post?: BackendPostDetail;
  city?: StoreCityPage;
}

export const catalogLoaderKey = (query: CatalogQuery = {}) => {
  const normalized = Object.fromEntries(
    Object.entries(query)
      .filter(([, value]) => value !== undefined && value !== "")
      .sort(([first], [second]) => first.localeCompare(second)),
  );
  return JSON.stringify(normalized);
};

export const toPublicSsrResponse = (
  error: unknown,
  resourceLabel: string,
): Response => {
  if (error instanceof ApiError && error.status === 404) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  const headers = new Headers({
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
  });
  if (error instanceof ApiError && error.retryAfterSeconds !== undefined) {
    headers.set("Retry-After", String(error.retryAfterSeconds));
  }

  return new Response(`${resourceLabel} is temporarily unavailable.`, {
    status: 503,
    headers,
  });
};
