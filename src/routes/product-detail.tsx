import type { LoaderFunctionArgs } from "react-router";
import { ProductReviewsSection } from "@/components/catalog/ProductReviewsSection";
import { loadProductPublicData } from "@/lib/public-loaders.server";
import { resolveRedirectForNotFound } from "@/lib/seo/storefront-redirect.server";
import ProductDetailPage from "@/pages/ProductDetailPage";

export const loader = async (args: LoaderFunctionArgs) => {
  try {
    return await loadProductPublicData(args);
  } catch (error) {
    const managedRedirect = await resolveRedirectForNotFound(args.request, error);
    if (managedRedirect) return managedRedirect;
    throw error;
  }
};

const ProductDetailRoute = () => (
  <>
    <ProductDetailPage />
    <ProductReviewsSection />
  </>
);

export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
export default ProductDetailRoute;
