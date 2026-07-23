import { createManagedContentLoader } from "@/lib/managed-content-loader.server";

export const loader = createManagedContentLoader("quality");
export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default } from "@/pages/QualityPage";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
