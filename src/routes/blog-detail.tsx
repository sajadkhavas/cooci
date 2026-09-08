import type { LoaderFunctionArgs } from "react-router";
import { loadBlogDetailPublicData } from "@/lib/public-loaders.server";
import { resolveRedirectForNotFound } from "@/lib/seo/storefront-redirect.server";

export const loader = async (args: LoaderFunctionArgs) => {
  try {
    return await loadBlogDetailPublicData(args);
  } catch (error) {
    const managedRedirect = await resolveRedirectForNotFound(args.request, error);
    if (managedRedirect) return managedRedirect;
    throw error;
  }
};

export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default } from "@/pages/BlogDetailPage";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
