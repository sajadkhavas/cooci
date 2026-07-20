import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/data/products";
import {
  areDevelopmentMocksEnabled,
  isBackendEnabled,
} from "@/lib/api";
import {
  fetchCatalogCategories,
  fetchCatalogProduct,
  fetchCatalogProducts,
  type CatalogQuery,
} from "@/lib/catalog-api";
import { filterCatalogProducts, paginateCatalog } from "@/lib/catalog";
import { loadDevelopmentCatalog } from "@/lib/development-catalog";

const disabledError = new Error(
  "اتصال کاتالوگ به API فعال نیست و داده نمایشی توسعه نیز اجازه داده نشده است.",
);

const createMockCatalog = (products: Product[], query: CatalogQuery) => {
  const shipping =
    query.requiresCooling === true
      ? "chilled"
      : query.requiresCooling === false
        ? "nationwide"
        : "all";
  const filtered = filterCatalogProducts({
    products,
    category: query.category || "all",
    query: query.search || "",
    shipping,
    dietOnly: false,
    inStockOnly: Boolean(query.inStock),
    sort: query.sort === "name" ? "featured" : query.sort || "featured",
  }).filter((product) =>
    query.featured === undefined ? true : product.isFeatured === query.featured,
  );
  const page = paginateCatalog(filtered, query.page || 1, query.perPage || 12);

  return {
    products: page.items,
    pagination: {
      page: page.page,
      perPage: page.pageSize,
      total: page.totalItems,
      totalPages: page.totalPages,
      from: page.totalItems ? page.startIndex + 1 : null,
      to: page.totalItems ? page.endIndex : null,
      hasMore: page.page < page.totalPages,
    },
  };
};

const useDevelopmentCatalog = () =>
  useQuery({
    queryKey: ["development-catalog"],
    queryFn: loadDevelopmentCatalog,
    enabled: areDevelopmentMocksEnabled && !isBackendEnabled,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: 0,
  });

export const useCatalogProducts = (query: CatalogQuery = {}) => {
  const backendQuery = useQuery({
    queryKey: ["catalog", "products", query],
    queryFn: () => fetchCatalogProducts(query),
    enabled: isBackendEnabled,
    staleTime: 60_000,
  });
  const developmentQuery = useDevelopmentCatalog();
  const mockCatalog = useMemo(
    () =>
      developmentQuery.data
        ? createMockCatalog(developmentQuery.data.products, query)
        : undefined,
    [developmentQuery.data, query],
  );
  const catalog = isBackendEnabled
    ? backendQuery.data
    : areDevelopmentMocksEnabled
      ? mockCatalog
      : undefined;

  return {
    products: catalog?.products ?? [],
    pagination: catalog?.pagination,
    isLoading: isBackendEnabled
      ? backendQuery.isLoading
      : areDevelopmentMocksEnabled
        ? developmentQuery.isLoading
        : false,
    isFetching: isBackendEnabled
      ? backendQuery.isFetching
      : areDevelopmentMocksEnabled
        ? developmentQuery.isFetching
        : false,
    error: isBackendEnabled
      ? (backendQuery.error as Error | null)
      : areDevelopmentMocksEnabled
        ? (developmentQuery.error as Error | null)
        : disabledError,
    isBackendCatalogEnabled: isBackendEnabled,
    refetch: isBackendEnabled ? backendQuery.refetch : developmentQuery.refetch,
  };
};

export const useCatalogCategories = () => {
  const backendQuery = useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: fetchCatalogCategories,
    enabled: isBackendEnabled,
    staleTime: 5 * 60_000,
  });
  const developmentQuery = useDevelopmentCatalog();

  return {
    categories: isBackendEnabled
      ? backendQuery.data ?? []
      : areDevelopmentMocksEnabled
        ? developmentQuery.data?.categories ?? []
        : [],
    isLoading: isBackendEnabled
      ? backendQuery.isLoading
      : areDevelopmentMocksEnabled
        ? developmentQuery.isLoading
        : false,
    error: isBackendEnabled
      ? (backendQuery.error as Error | null)
      : areDevelopmentMocksEnabled
        ? (developmentQuery.error as Error | null)
        : disabledError,
  };
};

export const useCatalogProduct = (slug?: string) => {
  const backendQuery = useQuery({
    queryKey: ["catalog", "product", slug],
    queryFn: () => fetchCatalogProduct(slug as string),
    enabled: isBackendEnabled && Boolean(slug),
    staleTime: 60_000,
  });
  const developmentQuery = useDevelopmentCatalog();
  const mockProduct = useMemo(
    () => developmentQuery.data?.products.find((item) => item.slug === slug),
    [developmentQuery.data, slug],
  );

  return {
    product: isBackendEnabled
      ? backendQuery.data
      : areDevelopmentMocksEnabled
        ? mockProduct
        : undefined,
    isLoading: isBackendEnabled
      ? backendQuery.isLoading
      : areDevelopmentMocksEnabled
        ? developmentQuery.isLoading
        : false,
    isFetching: isBackendEnabled
      ? backendQuery.isFetching
      : areDevelopmentMocksEnabled
        ? developmentQuery.isFetching
        : false,
    error: isBackendEnabled
      ? (backendQuery.error as Error | null)
      : areDevelopmentMocksEnabled
        ? (developmentQuery.error as Error | null)
        : disabledError,
    isBackendCatalogEnabled: isBackendEnabled,
  };
};

export const getRelatedFromCatalog = (
  product: Product,
  products: Product[],
  limit = 4,
) => {
  const related = products
    .filter(
      (item) =>
        item.id !== product.id && item.categorySlug === product.categorySlug,
    )
    .slice(0, limit);
  if (related.length >= limit) return related;
  const fill = products
    .filter(
      (item) =>
        item.id !== product.id &&
        !related.some((candidate) => candidate.id === item.id),
    )
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    .slice(0, limit - related.length);
  return [...related, ...fill];
};
