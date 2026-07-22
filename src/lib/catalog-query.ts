const MAX_SEARCH_LENGTH = 120;
const MAX_PAGE = 10_000;
const MAX_PER_PAGE = 100;

export interface CatalogQuery {
  category?: string;
  search?: string;
  featured?: boolean;
  requiresCooling?: boolean;
  inStock?: boolean;
  sort?: "featured" | "newest" | "name" | "price-asc" | "price-desc";
  page?: number;
  perPage?: number;
}

interface CatalogPaginationHint {
  totalPages?: unknown;
}

const clampInteger = (
  value: number | undefined,
  minimum: number,
  maximum: number,
) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return Math.min(maximum, Math.max(minimum, Math.floor(value)));
};

const laravelBoolean = (value: boolean) => (value ? "1" : "0");

export const toCatalogSearchParams = (query: CatalogQuery) => {
  const params = new URLSearchParams();
  const category = query.category?.trim().slice(0, 180);
  const search = query.search?.trim().slice(0, MAX_SEARCH_LENGTH);
  const page = clampInteger(query.page, 1, MAX_PAGE);
  const perPage = clampInteger(query.perPage, 1, MAX_PER_PAGE);

  if (category && category !== "all") params.set("category", category);
  if (search) params.set("search", search);
  if (query.featured !== undefined) {
    params.set("featured", laravelBoolean(query.featured));
  }
  if (query.requiresCooling !== undefined) {
    params.set("requiresCooling", laravelBoolean(query.requiresCooling));
  }
  if (query.inStock !== undefined) {
    params.set("inStock", laravelBoolean(query.inStock));
  }
  if (query.sort) params.set("sort", query.sort);
  if (page) params.set("page", String(page));
  if (perPage) params.set("perPage", String(perPage));
  return params;
};

export const resolveOutOfRangeCatalogQuery = (
  query: CatalogQuery,
  pagination: CatalogPaginationHint | undefined,
): CatalogQuery | undefined => {
  const requestedPage = clampInteger(query.page, 1, MAX_PAGE);
  const totalPages =
    typeof pagination?.totalPages === "number" &&
    Number.isInteger(pagination.totalPages) &&
    pagination.totalPages >= 1
      ? pagination.totalPages
      : undefined;

  if (!requestedPage || !totalPages || requestedPage <= totalPages) {
    return undefined;
  }

  return { ...query, page: totalPages };
};
