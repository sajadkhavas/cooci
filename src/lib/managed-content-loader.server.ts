import { isBackendEnabled } from "@/lib/api";
import { loadContentPage } from "@/lib/content";
import {
  toPublicSsrResponse,
  type PublicSsrLoaderData,
} from "@/lib/public-ssr";

export const createManagedContentLoader = (slug: string) =>
  async (): Promise<PublicSsrLoaderData> => {
    if (!isBackendEnabled) return {};

    try {
      const contentPage = await loadContentPage(slug);
      if (contentPage.slug !== slug) {
        throw new Error(`Managed content slug mismatch: expected ${slug}.`);
      }
      return { contentPage };
    } catch (error) {
      throw toPublicSsrResponse(error, `Managed content page: ${slug}`);
    }
  };
