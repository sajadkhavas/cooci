import { createManagedContentLoader } from "@/lib/managed-content-loader.server";

export const loader = createManagedContentLoader("terms");
export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default } from "@/pages/TermsPage";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
