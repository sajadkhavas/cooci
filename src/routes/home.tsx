import { loadFaqs } from "@/lib/content";
import { loadHomePublicData } from "@/lib/public-loaders.server";
import { reportOptionalPublicSsrFailure } from "@/lib/public-ssr";

export const loader = async () => {
  const publicData = await loadHomePublicData();

  try {
    return {
      ...publicData,
      faqs: await loadFaqs("home-decision"),
    };
  } catch (error) {
    reportOptionalPublicSsrFailure(error, "Homepage decision FAQs");
    return publicData;
  }
};

export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default } from "@/pages/HomePage";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
