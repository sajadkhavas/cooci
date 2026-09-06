import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import { isBackendEnabled } from "@/lib/api";
import { fetchCatalogDirectory } from "@/lib/catalog-api";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";

export const useCatalogDirectory = () => {
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const initialData =
    loaderData?.categories || loaderData?.categoryLandings
      ? {
          categories: loaderData?.categories ?? [],
          landings: loaderData?.categoryLandings ?? [],
        }
      : undefined;
  const query = useQuery({
    queryKey: ["catalog", "directory"],
    queryFn: fetchCatalogDirectory,
    enabled: isBackendEnabled,
    initialData: isBackendEnabled ? initialData : undefined,
    staleTime: 5 * 60_000,
  });

  return {
    query,
    categories: query.data?.categories ?? [],
    landings: query.data?.landings ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
};
