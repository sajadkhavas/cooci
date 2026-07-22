import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import { isBackendEnabled } from "@/lib/api";
import { loadProductReviews } from "@/lib/content";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";

const EMPTY_REVIEWS = {
  reviews: [],
  summary: { count: 0, averageRating: 0 },
} as const;

export const useProductReviews = (slug?: string) => {
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const initialData =
    loaderData?.product?.slug === slug ? loaderData.productReviews : undefined;
  const query = useQuery({
    queryKey: ["catalog", "product-reviews", slug, 1, 10],
    queryFn: () => loadProductReviews(slug as string, 1, 10),
    enabled: isBackendEnabled && Boolean(slug),
    initialData: isBackendEnabled ? initialData : undefined,
    staleTime: 60_000,
    retry: 1,
  });

  return {
    data: query.data ?? EMPTY_REVIEWS,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as Error | null,
  };
};
