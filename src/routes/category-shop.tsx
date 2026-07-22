import { redirect, type LoaderFunctionArgs } from "react-router";

const SAFE_CATEGORY_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const loader = ({ request, params }: LoaderFunctionArgs) => {
  const slug = params.slug || "";
  if (SAFE_CATEGORY_SLUG.test(slug)) return null;

  const url = new URL(request.url);
  return redirect(`/products${url.search}`, 301);
};

export { default } from "../pages/ProductsPage";
