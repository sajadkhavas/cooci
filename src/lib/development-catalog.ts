import type { Product } from "@/data/products";
import type { CatalogCategory } from "@/lib/catalog-api";

export interface DevelopmentCatalogData {
  products: Product[];
  categories: CatalogCategory[];
}

const emptyCatalog: DevelopmentCatalogData = {
  products: [],
  categories: [],
};

export const loadDevelopmentCatalog = async (): Promise<DevelopmentCatalogData> => {
  if (!import.meta.env.DEV) return emptyCatalog;

  const catalog = await import("@/data/products");

  return {
    products: catalog.products,
    categories: catalog.categories
      .filter((category) => category.slug !== "all")
      .map((category) => ({
        id: `mock-${category.slug}`,
        name: category.name,
        slug: category.slug,
      })),
  };
};
