import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  categories as staticCategories,
  products as staticProducts,
  type Product,
} from "@/data/products";
import {
  areDevelopmentMocksEnabled,
  isBackendEnabled,
} from "@/lib/api";
import {
  fetchCatalogCategories,
  fetchCatalogProduct,
  fetchCatalogProducts,
  type CatalogCategory,
  type CatalogQuery,
} from "@/lib/catalog-api";
import { filterCatalogProducts, paginateCatalog } from "@/lib/catalog";

const disabledError = new Error(
  "اتصال کاتالوگ به API فعال نیست و داده نمایشی توسعه نیز اجازه داده نشده است.",
);

const createMockCatalog = (query: CatalogQuery) => {
  const shipping =
    query.requiresCooling === true
      ? "chilled"
      : query.requiresCooling === false
        ? "nationwide"
        : "all";
  const filtered = filterCatalogProducts({
    products: staticProducts,
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

export const useCatalogProducts = (query: CatalogQuery = {}) => {
  const backendQuery = useQuery({
    queryKey: ["catalog", "products", query],
    queryFn: () => fetchCatalogProducts(query),
    enabled: isBackendEnabled,
    staleTime: 60_000,
  });
  const mockCatalog = useMemo(() => createMockCatalog(query), [query]);
  const catalog = isBackendEnabled
    ? backendQuery.data
    : areDevelopmentMocksEnabled
      ? mockCatalog
      : undefined;

  return {
    products: catalog?.products ?? [],
    pagination: catalog?.pagination,
    isLoading: isBackendEnabled ? backendQuery.isLoading : false,
    isFetching: isBackendEnabled ? backendQuery.isFetching : false,
    error: isBackendEnabled
      ? (backendQuery.error as Error | null)
      : areDevelopmentMocksEnabled
        ? null
        : disabledError,
    isBackendCatalogEnabled: isBackendEnabled,
    refetch: backendQuery.refetch,
  };
};

export const useCatalogCategories = () => {
  const backendQuery = useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: fetchCatalogCategories,
    enabled: isBackendEnabled,
    staleTime: 5 * 60_000,
  });
  const mockCategories = useMemo<CatalogCategory[]>(
    () =>
      staticCategories
        .filter((category) => category.slug !== "all")
        .map((category) => ({
          id: `mock-${category.slug}`,
          name: category.name,
          slug: category.slug,
        })),
    [],
  );

  return {
    categories: isBackendEnabled
      ? backendQuery.data ?? []
      : areDevelopmentMocksEnabled
        ? mockCategories
        : [],
    isLoading: isBackendEnabled ? backendQuery.isLoading : false,
    error: isBackendEnabled
      ? (backendQuery.error as Error | null)
      : areDevelopmentMocksEnabled
        ? null
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
  const mockProduct = useMemo(
    () => staticProducts.find((item) => item.slug === slug),
    [slug],
  );

  return {
    product: isBackendEnabled
      ? backendQuery.data
      : areDevelopmentMocksEnabled
        ? mockProduct
        : undefined,
    isLoading: isBackendEnabled ? backendQuery.isLoading : false,
    isFetching: isBackendEnabled ? backendQuery.isFetching : false,
    error: isBackendEnabled
      ? (backendQuery.error as Error | null)
      : areDevelopmentMocksEnabled
        ? null
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
