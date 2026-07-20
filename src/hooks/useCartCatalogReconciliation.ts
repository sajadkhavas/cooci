import { useEffect, useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import type { Product } from "@/data/products";
import type { CartItem } from "@/lib/cart";
import { areDevelopmentMocksEnabled, isBackendEnabled } from "@/lib/api";
import { fetchCatalogProduct } from "@/lib/catalog-api";
import { loadDevelopmentCatalog } from "@/lib/development-catalog";

interface CartCatalogReconciliation {
  isLoading: boolean;
  isReconciled: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useCartCatalogReconciliation = (
  items: CartItem[],
  syncWithCatalog: (products: Product[]) => void,
): CartCatalogReconciliation => {
  const [isReconciled, setIsReconciled] = useState(false);
  const slugs = useMemo(
    () => [...new Set(items.map((item) => item.slug).filter(Boolean))].sort(),
    [items],
  );
  const slugsKey = slugs.join("|");

  const backendQueries = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: ["cart", "catalog-product", slug],
      queryFn: () => fetchCatalogProduct(slug),
      enabled: isBackendEnabled && items.length > 0,
      staleTime: 30_000,
      retry: 1,
    })),
  });
  const developmentQuery = useQuery({
    queryKey: ["development-catalog"],
    queryFn: loadDevelopmentCatalog,
    enabled:
      areDevelopmentMocksEnabled && !isBackendEnabled && items.length > 0,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: 0,
  });

  const backendProducts = useMemo(
    () =>
      backendQueries
        .map((query) => query.data)
        .filter((product): product is Product => Boolean(product)),
    [backendQueries],
  );
  const developmentProducts = useMemo(
    () =>
      developmentQuery.data?.products.filter((product) =>
        slugs.includes(product.slug),
      ) ?? [],
    [developmentQuery.data, slugs],
  );
  const products = isBackendEnabled ? backendProducts : developmentProducts;
  const isLoading = isBackendEnabled
    ? backendQueries.some((query) => query.isLoading || query.isFetching)
    : areDevelopmentMocksEnabled
      ? developmentQuery.isLoading || developmentQuery.isFetching
      : false;
  const queryError = isBackendEnabled
    ? backendQueries.find((query) => query.error)?.error
    : developmentQuery.error;
  const missingDevelopmentSlugs =
    areDevelopmentMocksEnabled && !isBackendEnabled && !isLoading && !queryError
      ? slugs.filter(
          (slug) => !developmentProducts.some((product) => product.slug === slug),
        )
      : [];
  const error = queryError
    ? queryError instanceof Error
      ? queryError
      : new Error("دریافت اطلاعات سبد از کاتالوگ ناموفق بود.")
    : missingDevelopmentSlugs.length > 0
      ? new Error(
          `محصولات زیر دیگر در کاتالوگ توسعه وجود ندارند: ${missingDevelopmentSlugs.join(", ")}`,
        )
      : null;

  useEffect(() => {
    setIsReconciled(items.length === 0);
  }, [items.length, slugsKey]);

  useEffect(() => {
    if (items.length === 0) return;
    if (isLoading || error || products.length !== slugs.length) return;

    syncWithCatalog(products);
    setIsReconciled(true);
  }, [error, isLoading, items.length, products, slugs.length, syncWithCatalog]);

  const refetch = async () => {
    if (isBackendEnabled) {
      await Promise.all(backendQueries.map((query) => query.refetch()));
      return;
    }
    if (areDevelopmentMocksEnabled) await developmentQuery.refetch();
  };

  return { isLoading, isReconciled, error, refetch };
};
