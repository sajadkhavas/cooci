import { useQuery } from "@tanstack/react-query";
import { isBackendEnabled } from "@/lib/api";
import { loadStoreSettings } from "@/lib/content";
import { retireUnavailableGiftSurface } from "@/lib/public-storefront-retirement";
import { resolveStorefrontContent } from "@/lib/storefront-content";
import { resolveStorefrontSettings } from "@/lib/storefront-settings";

export const STORE_SETTINGS_QUERY_KEY = ["store", "settings"] as const;

export const useStorefrontSettings = () => {
  const query = useQuery({
    queryKey: STORE_SETTINGS_QUERY_KEY,
    queryFn: loadStoreSettings,
    enabled: isBackendEnabled,
    staleTime: 10 * 60_000,
  });
  const content = retireUnavailableGiftSurface(
    resolveStorefrontContent(query.data),
  );

  return {
    query,
    payload: query.data,
    settings: resolveStorefrontSettings(query.data),
    content,
  };
};
