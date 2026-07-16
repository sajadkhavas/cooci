import { useMemo } from "react";
import { products as staticProducts, type Product } from "@/data/products";

export const useCatalogProducts = () => ({
  products: staticProducts,
  isLoading: false,
  isFetching: false,
  error: null as Error | null,
  isBackendCatalogEnabled: false,
});

export const useCatalogProduct = (slug?: string) => {
  const catalog = useCatalogProducts();
  const product = useMemo(
    () => catalog.products.find((item) => item.slug === slug),
    [catalog.products, slug],
  );
  return { ...catalog, product };
};

export const getRelatedFromCatalog = (product: Product, products: Product[], limit = 4) => {
  const related = products
    .filter((item) => item.id !== product.id && item.categorySlug === product.categorySlug)
    .slice(0, limit);
  if (related.length >= limit) return related;
  const fill = products
    .filter((item) => item.id !== product.id && !related.some((r) => r.id === item.id))
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    .slice(0, limit - related.length);
  return [...related, ...fill];
};
