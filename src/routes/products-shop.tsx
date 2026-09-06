import { redirect, type LoaderFunctionArgs } from "react-router";
import { categoryContents } from "@/data/categoriesContent";
import { isBackendEnabled } from "@/lib/api";
import { fetchCatalogCategories } from "@/lib/catalog-api";
import { loadShopPublicData } from "@/lib/public-loaders.server";
import { toPublicSsrResponse } from "@/lib/public-ssr";
import ProductsPage from "../pages/ProductsPage";

const SAFE_CATEGORY_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const resolveEditorialSlug = (catalogSlug: string) =>
  categoryContents.find(
    (category) =>
      category.slug === catalogSlug ||
      category.productCategorySlug === catalogSlug,
  )?.slug || catalogSlug;

const resolveCatalogSlug = (routeSlug: string) =>
  categoryContents.find((category) => category.slug === routeSlug)
    ?.productCategorySlug || routeSlug;

export const loader = async (args: LoaderFunctionArgs) => {
  const url = new URL(args.request.url);
  const legacyCategory = url.searchParams.get("category");
  const legacyDiet = url.searchParams.get("diet") === "true";
  if (!legacyCategory && !legacyDiet) return loadShopPublicData(args);

  url.searchParams.delete("category");
  url.searchParams.delete("diet");
  const query = url.searchParams.toString();
  const shopUrl = `/products${query ? `?${query}` : ""}`;

  if (
    (!legacyDiet && legacyCategory === "all") ||
    (!legacyDiet &&
      legacyCategory !== null &&
      !SAFE_CATEGORY_SLUG.test(legacyCategory))
  ) {
    return redirect(shopUrl, 301);
  }

  const targetSlug = legacyDiet
    ? "diet-diabetic"
    : resolveEditorialSlug(legacyCategory || "");

  if (isBackendEnabled) {
    try {
      const categories = await fetchCatalogCategories();
      const targetCatalogSlug = resolveCatalogSlug(targetSlug);
      const isPublished = categories.some(
        (category) => category.slug === targetCatalogSlug,
      );

      if (!isPublished) return redirect(shopUrl, 301);
    } catch (error) {
      throw toPublicSsrResponse(error, "Legacy shop category");
    }
  }

  return redirect(
    `/products/category/${encodeURIComponent(targetSlug)}${query ? `?${query}` : ""}`,
    301,
  );
};

export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
export default ProductsPage;
