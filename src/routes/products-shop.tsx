import { redirect, type LoaderFunctionArgs } from "react-router";
import { categoryContents } from "@/data/categoriesContent";
import ProductsPage from "../pages/ProductsPage";

const SAFE_CATEGORY_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const resolveEditorialSlug = (catalogSlug: string) =>
  categoryContents.find(
    (category) =>
      category.slug === catalogSlug ||
      category.productCategorySlug === catalogSlug,
  )?.slug || catalogSlug;

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const legacyCategory = url.searchParams.get("category");
  const legacyDiet = url.searchParams.get("diet") === "true";
  if (!legacyCategory && !legacyDiet) return null;

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

  return redirect(
    `/products/category/${encodeURIComponent(targetSlug)}${query ? `?${query}` : ""}`,
    301,
  );
};

export default ProductsPage;
