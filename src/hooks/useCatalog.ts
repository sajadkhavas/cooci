import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient, API_BASE_URL } from "@/lib/api-client";
import { products as staticProducts, type Product } from "@/data/products";

const USE_BACKEND_CATALOG = Boolean(API_BASE_URL) && import.meta.env.VITE_USE_BACKEND === "true";

export const useCatalogProducts = () => {
  const query = useQuery<Product[]>({
    queryKey: ["catalog-products"],
    queryFn: async () => apiClient.products.list() as unknown as Product[],
    enabled: USE_BACKEND_CATALOG,
    initialData: staticProducts,
    staleTime: 1000 * 60 * 5,
  });

  return {
    products: query.data ?? staticProducts,
    isLoading: USE_BACKEND_CATALOG && query.isLoading,
    isFetching: USE_BACKEND_CATALOG && query.isFetching,
    error: query.error,
    isBackendCatalogEnabled: USE_BACKEND_CATALOG,
  };
};

export const useCatalogProduct = (slug?: string) => {
  const catalog = useCatalogProducts();
  const product = useMemo(
    () => catalog.products.find((item) => item.slug === slug),
    [catalog.products, slug],
  );

  return {
    ...catalog,
    product,
  };
};

export const getRelatedFromCatalog = (product: Product, products: Product[], limit = 4) => {
  const related = products
    .filter((item) => item.id !== product.id && item.categorySlug === product.categorySlug)
    .slice(0, limit);

  if (related.length >= limit) return related;

  const fill = products
    .filter((item) => item.id !== product.id && !related.some((relatedItem) => relatedItem.id === item.id))
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    .slice(0, limit - related.length);

  return [...related, ...fill];
};
