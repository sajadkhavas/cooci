import { redirect, type LoaderFunctionArgs } from "react-router";
import { loadShopPublicData } from "@/lib/public-loaders.server";

const SAFE_CATEGORY_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const loader = async (args: LoaderFunctionArgs) => {
  const slug = args.params.slug || "";
  if (!SAFE_CATEGORY_SLUG.test(slug)) {
    const url = new URL(args.request.url);
    return redirect(`/products${url.search}`, 301);
  }

  return loadShopPublicData(args);
};

export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
export { default } from "../pages/ProductsPage";
