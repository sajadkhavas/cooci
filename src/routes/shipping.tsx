import { createManagedContentLoader } from "@/lib/managed-content-loader.server";

export const loader = createManagedContentLoader("shipping");
export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default } from "@/pages/ShippingPage";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
