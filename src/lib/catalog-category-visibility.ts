import type { CategoryContent } from "@/data/categoriesContent";
import type { CatalogCategory } from "@/lib/catalog-api";
import { isRetiredGiftCategory } from "@/lib/public-storefront-retirement";

export interface VisibleCatalogCategory {
  routeSlug: string;
  backendCategorySlug: string;
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
  editorial?: CategoryContent;
  isFilteredView: boolean;
  showOnHome: boolean;
  showInFooter: boolean;
  sortOrder: number;
  homeSortOrder: number;
  footerSortOrder: number;
}

export const buildVisibleCatalogCategories = (
  editorialCategories: CategoryContent[],
  backendCategories: CatalogCategory[],
): VisibleCatalogCategory[] => {
  const visible: VisibleCatalogCategory[] = [];
  const seenRouteSlugs = new Set<string>();

  for (const backendCategory of backendCategories) {
    if (isRetiredGiftCategory(backendCategory.slug)) continue;
    const matchingEditorial = editorialCategories.filter(
      (category) => category.productCategorySlug === backendCategory.slug,
    );

    const candidates = matchingEditorial.length
      ? matchingEditorial
      : [undefined];

    for (const editorial of candidates) {
      if (
        isRetiredGiftCategory(editorial?.slug) ||
        isRetiredGiftCategory(editorial?.productCategorySlug)
      ) {
        continue;
      }
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
        showOnHome: backendCategory.showOnHome,
        showInFooter: backendCategory.showInFooter,
        sortOrder: backendCategory.sortOrder,
        homeSortOrder: backendCategory.homeSortOrder,
        footerSortOrder: backendCategory.footerSortOrder,
      });

      seenRouteSlugs.add(routeSlug);
    }
  }

  return visible;
};
