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
import { AnalyticsConsent } from "@/components/privacy/AnalyticsConsent";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { brandConfig } from "@/config/brand";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { isBackendEnabled } from "@/lib/api";
import type { BackendStoreSettings } from "@/lib/backend-contract";
import type { BackendNavigationItem } from "@/lib/backend-contract";
import { loadStoreNavigation, loadStoreSettings } from "@/lib/content";
import { CspNonceProvider } from "@/lib/security/csp";
import "./fonts.css";
import "./index.css";
import "./styles/modern-pages.css";
import "./styles/brand-theme.css";
import "./styles/runtime-performance.css";
import "./styles/core-web-vitals.css";

export interface RootLoaderData {
  cspNonce?: string;
  storeSettings?: BackendStoreSettings;
  storeNavigation?: BackendNavigationItem[];
  footerNavigation?: BackendNavigationItem[];
}

const STORE_SETTINGS_QUERY_KEY = ["store", "settings"] as const;

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

export const loader = async ({ request }: LoaderFunctionArgs): Promise<RootLoaderData> => {
  const base: RootLoaderData = {
    cspNonce: request.headers.get("x-winimi-csp-nonce") || undefined,
  };

  if (!isBackendEnabled) return base;

  try {
    const [storeNavigation, footerNavigation, storeSettings] = await Promise.all([
      loadStoreNavigation("header").catch(() => undefined),
      loadStoreNavigation("footer").catch(() => undefined),
      loadStoreSettings(),
    ]);
    return {
      ...base,
      storeSettings,
      storeNavigation,
      footerNavigation,
    };
  } catch (error) {
    console.error("Winimi root storefront authority loader failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return base;
  }
};

export const shouldRevalidate = () => false;

export const links = () => [
  {
    rel: "preload",
    as: "font",
    href: "/fonts/Vazirmatn-Variable.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous" as const,
  },
  {
    rel: "preload",
    as: "image",
    href: heroImage,
    type: "image/jpeg",
    fetchPriority: "high" as const,
  },
  { rel: "manifest", href: "/app.webmanifest" },
  { rel: "icon", href: "/icons/winimi-192.svg", type: "image/svg+xml" },
  {
    rel: "apple-touch-icon",
    href: "/icons/winimi-apple-touch.png",
    sizes: "180x180",
  },
];

export const meta = ({ data }: { data?: RootLoaderData }) => {
  const settings = data?.storeSettings?.settings ?? {};
  const configuredTheme = settings["pwa.theme_color"];
  const configuredName = settings["pwa.name"];
  const themeColor = typeof configuredTheme === "string" && /^#[0-9a-f]{6}$/i.test(configuredTheme)
    ? configuredTheme
    : "#D0E596";
  const applicationName = typeof configuredName === "string" && configuredName.trim()
    ? configuredName.trim()
    : brandConfig.brandName;

  return [
    { name: "theme-color", content: themeColor },
    { name: "color-scheme", content: "light" },
    { name: "application-name", content: applicationName },
  ];
};

export default function Root({ loaderData }: { loaderData: RootLoaderData }) {
  const [queryClient] = useState(createQueryClient);
  const nonce = loaderData?.cspNonce;

  if (loaderData?.storeSettings) {
    queryClient.setQueryData(STORE_SETTINGS_QUERY_KEY, loaderData.storeSettings);
  }

  return (
    <html lang="fa-IR" dir="rtl">
      <head>
        {/* Google tag (gtag.js) — GA4 / Consent Mode */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-96JJNX40BV"
          nonce={nonce}
        />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});
gtag('js', new Date());
gtag('config', 'G-96JJNX40BV');`,
          }}
        />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <Meta />
        {typeof loaderData?.storeSettings?.settings?.[
          "integrations.search_console_verification"
        ] === "string" &&
        loaderData.storeSettings.settings[
          "integrations.search_console_verification"
        ] ? (
          <meta
            name="google-site-verification"
            content={String(
              loaderData.storeSettings.settings[
                "integrations.search_console_verification"
              ],
            )}
          />
        ) : null}
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
                  <AnalyticsConsent />
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
