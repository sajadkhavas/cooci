import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  type LoaderFunctionArgs,
} from "react-router";
import heroImage from "@/assets/cookies/hero-main.jpg";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { WebVitalsReporter } from "@/components/performance/WebVitalsReporter";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { brandConfig } from "@/config/brand";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CspNonceProvider } from "@/lib/security/csp";
import "./index.css";
import "./styles/modern-pages.css";
import "./styles/brand-theme.css";
import "./styles/runtime-performance.css";
import "./styles/core-web-vitals.css";

interface RootLoaderData {
  cspNonce?: string;
}

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
        networkMode: "offlineFirst",
      },
      mutations: { networkMode: "online", retry: 0 },
    },
  });

export const loader = ({ request }: LoaderFunctionArgs): RootLoaderData => ({
  cspNonce: request.headers.get("x-winimi-csp-nonce") || undefined,
});

export const shouldRevalidate = () => false;

export const links = () => [
  {
    rel: "preload",
    as: "image",
    href: heroImage,
    type: "image/jpeg",
    fetchPriority: "high" as const,
  },
  { rel: "manifest", href: "/manifest.webmanifest" },
  { rel: "icon", href: "/icons/winimi-192.svg", type: "image/svg+xml" },
  {
    rel: "apple-touch-icon",
    href: "/icons/winimi-apple-touch.png",
    sizes: "180x180",
  },
];

export const meta = () => [
  { title: brandConfig.defaultMeta.title },
  { name: "description", content: brandConfig.defaultMeta.description },
  { name: "theme-color", content: "#D0E596" },
  { name: "color-scheme", content: "light" },
  { name: "application-name", content: brandConfig.brandName },
];

export default function Root({ loaderData }: { loaderData: RootLoaderData }) {
  const [queryClient] = useState(createQueryClient);
  const nonce = loaderData?.cspNonce;

  return (
    <html lang="fa-IR" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <noscript>
          برای استفاده از فروشگاه وینیمی، JavaScript مرورگر را فعال کنید.
        </noscript>
        <CspNonceProvider nonce={nonce}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AuthProvider>
                <CartProvider>
                  <ScrollToTop />
                  <RouteErrorBoundary>
                    <SiteLayout />
                  </RouteErrorBoundary>
                </CartProvider>
              </AuthProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </CspNonceProvider>
        <WebVitalsReporter />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
