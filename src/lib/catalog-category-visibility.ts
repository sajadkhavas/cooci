import type { CategoryContent } from "@/data/categoriesContent";
import type { CatalogCategory } from "@/lib/catalog-api";

export interface VisibleCatalogCategory {
  routeSlug: string;
  backendCategorySlug: string;
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
  editorial?: CategoryContent;
  isFilteredView: boolean;
}

export const buildVisibleCatalogCategories = (
  editorialCategories: CategoryContent[],
  backendCategories: CatalogCategory[],
): VisibleCatalogCategory[] => {
  const visible: VisibleCatalogCategory[] = [];
  const seenRouteSlugs = new Set<string>();

  for (const backendCategory of backendCategories) {
    const matchingEditorial = editorialCategories.filter(
      (category) => category.productCategorySlug === backendCategory.slug,
    );

    const candidates = matchingEditorial.length
      ? matchingEditorial
      : [undefined];

    for (const editorial of candidates) {
      const routeSlug = editorial?.slug ?? backendCategory.slug;
      if (seenRouteSlugs.has(routeSlug)) continue;

      const isFilteredView = Boolean(editorial?.catalogSearch);

      visible.push({
        routeSlug,
        backendCategorySlug: backendCategory.slug,
        name: isFilteredView
          ? editorial?.name ?? backendCategory.name
          : backendCategory.name,
        description: isFilteredView
          ? editorial?.cardDescription
          : backendCategory.description || editorial?.cardDescription,
        image: backendCategory.image,
        productCount: isFilteredView
          ? undefined
          : backendCategory.productCount,
        editorial,
        isFilteredView,
      });

      seenRouteSlugs.add(routeSlug);
    }
  }

  return visible;
};
