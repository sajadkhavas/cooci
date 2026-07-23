import { redirect, type LoaderFunctionArgs } from "react-router";
import { loadLocationsPublicData } from "@/lib/public-loaders.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (url.pathname !== "/locations" || url.search) return redirect("/locations", 301);
  return loadLocationsPublicData();
};

export { passPublicSsrHeaders as headers } from "@/lib/public-ssr";
export { default } from "@/pages/LocationsPage";
export { default as ErrorBoundary } from "@/routes/PublicRouteErrorBoundary";
