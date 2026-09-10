import type { LoaderFunctionArgs } from "react-router";
import { resolveStorefrontRedirect } from "@/lib/seo/storefront-redirect.server";
import NotFoundPage from "@/pages/NotFoundPage";

export async function loader({ request }: LoaderFunctionArgs) {
  const managedRedirect = await resolveStorefrontRedirect(request);
  if (managedRedirect) return managedRedirect;

  throw new Response("Not Found", {
    status: 404,
    headers: {
      "Cache-Control": "no-cache, must-revalidate",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export function ErrorBoundary() {
  return <NotFoundPage />;
}

export default NotFoundPage;
