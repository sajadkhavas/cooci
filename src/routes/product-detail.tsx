import { ProductReviewsSection } from "@/components/catalog/ProductReviewsSection";
import ProductDetailPage from "@/pages/ProductDetailPage";

const ProductDetailRoute = () => (
  <>
    <ProductDetailPage />
    <ProductReviewsSection />
  </>
);

export { loadProductPublicData as loader } from "@/lib/public-loaders.server";
export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
export default ProductDetailRoute;
