import type { BackendPostSummary } from "@/lib/backend-contract";
import { loadFaqs, loadPost, loadStoreSettings } from "@/lib/content";
import { loadHomePublicData } from "@/lib/public-loaders.server";
import { reportOptionalPublicSsrFailure } from "@/lib/public-ssr";
import { resolveStorefrontContent } from "@/lib/storefront-content";

const loadEditorialPosts = async (): Promise<BackendPostSummary[]> => {
  try {
    const settings = await loadStoreSettings();
    const slugs = resolveStorefrontContent(settings).home.editorial.slugs;
    const results = await Promise.allSettled(slugs.map((slug) => loadPost(slug)));

    return results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );
  } catch (error) {
    reportOptionalPublicSsrFailure(error, "Homepage editorial guides");
    return [];
  }
};

export const loader = async () => {
  const publicData = await loadHomePublicData();
  const [faqs, relatedPosts] = await Promise.all([
    loadFaqs("home-decision").catch((error) => {
      reportOptionalPublicSsrFailure(error, "Homepage decision FAQs");
      return undefined;
    }),
    loadEditorialPosts(),
  ]);

  return {
    ...publicData,
    ...(faqs ? { faqs } : {}),
    relatedPosts,
  };
};

export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default } from "@/pages/HomePage";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
