import { createManagedContentLoader } from "@/lib/managed-content-loader.server";

export const loader = createManagedContentLoader("privacy");
export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default } from "@/pages/PrivacyPage";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
