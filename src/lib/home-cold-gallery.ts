import type { Product } from "@/data/products";
import type { CatalogQuery } from "@/lib/catalog-api";

export const HOME_CHILLED_QUERY = {
  requiresCooling: true,
  perPage: 6,
  sort: "featured",
} satisfies CatalogQuery;

export const selectColdGalleryProducts = (
  products: Product[],
  limit = HOME_CHILLED_QUERY.perPage,
) => {
  const seen = new Set<string>();

  return products.filter((product) => {
    if (product.requiresCooling !== true || seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  }).slice(0, limit);
};
