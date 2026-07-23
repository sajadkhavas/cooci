import { createManagedContentLoader } from "@/lib/managed-content-loader.server";

export const loader = createManagedContentLoader("about");
export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default } from "@/pages/AboutPage";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
