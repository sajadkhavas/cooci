import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { dirname, join } from "node:path";

const read = (path) => readFileSync(path, "utf8");
const write = (path, content) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart().replace(/\s*$/, "\n"), "utf8");
};

const walk = (directory) =>
  existsSync(directory)
    ? readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
      })
    : [];

const replaceRouterImports = () => {
  const roots = ["src", "tests", "e2e", "scripts"];
  for (const file of roots.flatMap(walk).filter((path) => /\.(?:[cm]?[jt]sx?)$/.test(path))) {
    const source = read(file);
    const updated = source.replaceAll('from "react-router-dom"', 'from "react-router"').replaceAll("from 'react-router-dom'", "from 'react-router'");
    if (updated !== source) writeFileSync(file, updated, "utf8");
  }
};

const packageJson = JSON.parse(read("package.json"));
packageJson.scripts = {
  ...packageJson.scripts,
  predev: "node scripts/generate-sitemap.mjs",
  dev: "react-router dev --host 0.0.0.0 --port 8080",
  prebuild: "node scripts/generate-sitemap.mjs",
  build:
    "react-router build && vite build --config vite.ssr-server.config.ts && node scripts/generate-service-worker.mjs",
  postbuild: "node scripts/audit-performance.mjs",
  "build:dev":
    "react-router build --mode development && vite build --mode development --config vite.ssr-server.config.ts",
  preview: "node build/runtime/server.mjs",
  typecheck:
    "react-router typegen && tsc --noEmit -p tsconfig.app.json && tsc --noEmit -p tsconfig.node.json",
};
packageJson.dependencies = {
  ...packageJson.dependencies,
  "@react-router/express": "8.2.0",
  express: "^5.1.0",
  react: "19.2.7",
  "react-dom": "19.2.7",
  "react-router": "8.2.0",
};
delete packageJson.dependencies["react-router-dom"];
delete packageJson.dependencies["react-helmet-async"];
packageJson.devDependencies = {
  ...packageJson.devDependencies,
  "@react-router/dev": "8.2.0",
  "@types/react": "19.2.17",
  "@types/react-dom": "19.2.3",
  vite: "8.1.5",
};
delete packageJson.devDependencies["@vitejs/plugin-react-swc"];
write("package.json", JSON.stringify(packageJson, null, 2));

replaceRouterImports();

write(
  "react-router.config.ts",
  `import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: true,
} satisfies Config;
`,
);

write(
  "vite.config.ts",
  `import path from "node:path";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [reactRouter(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2022",
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    assetsInlineLimit: 2_048,
    chunkSizeWarningLimit: 600,
  },
}));
`,
);

write(
  "vite.ssr-server.config.ts",
  `import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: path.resolve(process.cwd(), "server.runtime.mjs"),
    outDir: "build/runtime",
    emptyOutDir: true,
    target: "node22",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        entryFileNames: "server.mjs",
        chunkFileNames: "chunks/[name]-[hash].mjs",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  ssr: {
    noExternal: true,
  },
});
`,
);

write(
  "server.runtime.mjs",
  `import { randomBytes } from "node:crypto";
import path from "node:path";
import process from "node:process";
import express from "express";
import { createRequestHandler } from "@react-router/express";
import * as build from "./build/server/index.js";

const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = Number.parseInt(process.env.PORT || "4173", 10);
const clientDirectory = path.resolve(process.cwd(), "build/client");
const apiOrigin = (() => {
  try {
    return new URL(
      process.env.WINIMI_API_ORIGIN || "https://api.winimibakery.com",
    ).origin;
  } catch {
    return "https://api.winimibakery.com";
  }
})();
const sensitivePrefixes = [
  "/account",
  "/cart",
  "/checkout",
  "/payment",
];

app.disable("x-powered-by");
app.set("trust proxy", 1);

const sharedHeaders = (response, nonce) => {
  const scriptSource = nonce
    ? "script-src 'self' 'nonce-" + nonce + "'"
    : "script-src 'self'";
  response.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      scriptSource,
      "connect-src 'self' " + apiOrigin,
      "manifest-src 'self'",
      "worker-src 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  );
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Cross-Origin-Resource-Policy", "same-site");
};

app.get("/__ssr_health", (_request, response) => {
  sharedHeaders(response, null);
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  response.json({ status: "ok", surface: "winimi-ssr" });
});

app.use(
  "/assets",
  express.static(path.join(clientDirectory, "assets"), {
    immutable: true,
    maxAge: "1y",
    fallthrough: false,
    setHeaders(response) {
      sharedHeaders(response, null);
      response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  }),
);

app.use(
  express.static(clientDirectory, {
    index: false,
    maxAge: 0,
    fallthrough: true,
    setHeaders(response, filePath) {
      sharedHeaders(response, null);
      if (filePath.endsWith("sw.js")) {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Service-Worker-Allowed", "/");
      } else {
        response.setHeader("Cache-Control", "no-cache, must-revalidate");
      }
    },
  }),
);

app.use((request, response, next) => {
  const nonce = randomBytes(18).toString("base64url");
  request.headers["x-winimi-csp-nonce"] = nonce;
  sharedHeaders(response, nonce);
  const sensitive = sensitivePrefixes.some(
    (prefix) =>
      request.path === prefix || request.path.startsWith(prefix + "/"),
  );
  response.setHeader(
    "Cache-Control",
    sensitive
      ? "private, no-store, max-age=0"
      : "no-cache, must-revalidate",
  );
  next();
});

app.use(
  createRequestHandler({
    build,
    mode: process.env.NODE_ENV || "production",
  }),
);

const server = app.listen(port, host, () => {
  console.log(
    "Winimi SSR listening on http://" + host + ":" + port +
      " with API origin " + apiOrigin,
  );
});

const shutdown = (signal) => {
  console.log("Received " + signal + "; closing Winimi SSR server.");
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
    process.exit();
  });
};

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
`,
);

write(
  "src/routes.ts",
  `import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("./pages/HomePage.tsx"),
  route("products", "./pages/ProductsPage.tsx"),
  route("categories", "./pages/CategoriesPage.tsx"),
  route("products/category/:slug", "./pages/CategoryPage.tsx"),
  route("products/:slug", "./pages/ProductDetailPage.tsx"),
  route("blog", "./pages/BlogListPage.tsx"),
  route("blog/:slug", "./pages/BlogDetailPage.tsx"),
  route("city/:slug", "./pages/CityPage.tsx"),
  route("gift", "./pages/GiftPage.tsx"),
  route("corporate", "./pages/CorporatePage.tsx"),
  route("reviews", "./pages/ReviewsPage.tsx"),
  route("quality", "./pages/QualityPage.tsx"),
  route("about", "./pages/AboutPage.tsx"),
  route("gallery", "./pages/GalleryPage.tsx"),
  route("faq", "./pages/FAQPage.tsx"),
  route("contact", "./pages/ContactPage.tsx"),
  route("privacy", "./pages/PrivacyPage.tsx"),
  route("terms", "./pages/TermsPage.tsx"),
  route("shipping", "./pages/ShippingPage.tsx"),
  route("cart", "./routes/cart.tsx"),
  route("checkout", "./routes/checkout.tsx"),
  route("payment/mock", "./routes/payment-mock.tsx"),
  route("payment/callback", "./routes/payment-callback.tsx"),
  route("account/login", "./routes/account-login.tsx"),
  route("account", "./routes/account.tsx"),
  route("account/orders/:orderId", "./routes/account-order.tsx"),
  route("*", "./routes/not-found.tsx"),
] satisfies RouteConfig;
`,
);

write(
  "src/lib/security/csp.tsx",
  `import { createContext, type ReactNode, useContext } from "react";

const CspNonceContext = createContext<string | undefined>(undefined);

export const CspNonceProvider = ({
  nonce,
  children,
}: {
  nonce?: string;
  children: ReactNode;
}) => (
  <CspNonceContext.Provider value={nonce}>
    {children}
  </CspNonceContext.Provider>
);

export const useCspNonce = () => useContext(CspNonceContext);
`,
);

write(
  "src/root.tsx",
  `import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  type LoaderFunctionArgs,
} from "react-router";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteLayout } from "@/components/layout/SiteLayout";
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
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
`,
);

write(
  "src/entry.client.tsx",
  `import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { registerServiceWorker } from "@/lib/registerServiceWorker";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});

if (document.readyState === "complete") {
  registerServiceWorker();
} else {
  window.addEventListener("load", registerServiceWorker, { once: true });
}
`,
);

const privateHeaders = `export const headers = () => ({
  "Cache-Control": "private, no-store, max-age=0",
});

export const meta = () => [
  { name: "robots", content: "noindex,nofollow" },
];
`;

write(
  "src/routes/cart.tsx",
  `${privateHeaders}\nexport { default } from "../pages/CartPage";\n`,
);
write(
  "src/routes/payment-callback.tsx",
  `${privateHeaders}\nexport { default } from "../pages/PaymentCallbackPage";\n`,
);
write(
  "src/routes/checkout.tsx",
  `import { CheckoutGuard } from "@/components/cart/CheckoutGuard";
import CheckoutPage from "@/pages/CheckoutPage";

${privateHeaders}
export default function CheckoutRoute() {
  return (
    <CheckoutGuard>
      <CheckoutPage />
    </CheckoutGuard>
  );
}
`,
);
write(
  "src/routes/account-login.tsx",
  `import { LoginRoute } from "@/components/auth/LoginRoute";
import LoginPage from "@/pages/LoginPage";

${privateHeaders}
export default function AccountLoginRoute() {
  return (
    <LoginRoute>
      <LoginPage />
    </LoginRoute>
  );
}
`,
);
write(
  "src/routes/account.tsx",
  `import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AccountPage from "@/pages/AccountPage";

${privateHeaders}
export default function AccountRoute() {
  return (
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  );
}
`,
);
write(
  "src/routes/account-order.tsx",
  `import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import OrderDetailPage from "@/pages/OrderDetailPage";

${privateHeaders}
export default function AccountOrderRoute() {
  return (
    <ProtectedRoute>
      <OrderDetailPage />
    </ProtectedRoute>
  );
}
`,
);
write(
  "src/routes/payment-mock.tsx",
  `import PaymentMockPage from "@/pages/PaymentMockPage";

${privateHeaders}
export function loader() {
  if (process.env.NODE_ENV === "production") {
    throw new Response("Not Found", { status: 404 });
  }
  return null;
}

export default PaymentMockPage;
`,
);
write(
  "src/routes/not-found.tsx",
  `import NotFoundPage from "@/pages/NotFoundPage";

export function loader() {
  throw new Response("Not Found", { status: 404 });
}

export function ErrorBoundary() {
  return <NotFoundPage />;
}

export default NotFoundPage;
`,
);

write(
  "src/context/CartContext.tsx",
  `import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { Product } from "@/data/products";
import {
  calculateCartSummary,
  CART_STORAGE_KEY,
  LEGACY_CART_STORAGE_KEY,
  PACKAGING_FEE,
  parseStoredCart,
  serializeCart,
  type CartItem,
  type CartItemInput,
  type CartSummary,
} from "@/lib/cart";
import { cartReducer, type CartState } from "@/lib/cart-state";

interface CartContextType extends CartSummary {
  items: CartItem[];
  addItem: (item: CartItemInput, quantity?: number) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  syncWithCatalog: (products: Product[]) => void;
}

const CartContext = createContext<CartContextType | null>(null);
const emptyCartState: CartState = { items: [] };

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, emptyCartState);
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);

  useEffect(() => {
    try {
      const currentRaw = window.localStorage.getItem(CART_STORAGE_KEY);
      const legacyRaw = window.localStorage.getItem(LEGACY_CART_STORAGE_KEY);
      dispatch({
        type: "HYDRATE",
        items: parseStoredCart(currentRaw ?? legacyRaw),
      });
    } catch {
      dispatch({ type: "HYDRATE", items: [] });
    } finally {
      setIsStorageHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isStorageHydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(state.items));
      window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    } catch {
      // Storage can be unavailable in private browsing or restricted environments.
    }
  }, [isStorageHydrated, state.items]);

  useEffect(() => {
    const hydrateFromAnotherTab = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage) return;
      if (
        event.key !== CART_STORAGE_KEY &&
        event.key !== LEGACY_CART_STORAGE_KEY
      ) {
        return;
      }
      dispatch({ type: "HYDRATE", items: parseStoredCart(event.newValue) });
    };

    window.addEventListener("storage", hydrateFromAnotherTab);
    return () => window.removeEventListener("storage", hydrateFromAnotherTab);
  }, []);

  const addItem = useCallback(
    (item: CartItemInput, quantity = 1) =>
      dispatch({ type: "ADD", item, quantity }),
    [],
  );
  const removeItem = useCallback(
    (id: string, variantId?: string) =>
      dispatch({ type: "REMOVE", id, variantId }),
    [],
  );
  const updateQuantity = useCallback(
    (id: string, quantity: number, variantId?: string) =>
      dispatch({ type: "UPDATE", id, quantity, variantId }),
    [],
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const syncWithCatalog = useCallback(
    (products: Product[]) => dispatch({ type: "SYNC_CATALOG", products }),
    [],
  );

  const summary = useMemo(
    () => calculateCartSummary(state.items),
    [state.items],
  );

  const value = useMemo<CartContextType>(
    () => ({
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      syncWithCatalog,
      ...summary,
    }),
    [
      addItem,
      clearCart,
      removeItem,
      state.items,
      summary,
      syncWithCatalog,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export type { CartItem, CartItemInput } from "@/lib/cart";
export { PACKAGING_FEE } from "@/lib/cart";
`,
);

write(
  "src/components/SEO.tsx",
  `import { useLocation } from "react-router";
import { brandConfig } from "@/config/brand";
import { useCspNonce } from "@/lib/security/csp";
import {
  resolveCanonicalUrl,
  resolvePublicMediaUrl,
  serializeJsonLd,
} from "@/lib/security/seo";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  author?: string;
  schema?: object;
  noIndex?: boolean;
}

const configuredOrigin =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || brandConfig.website;
const SITE_ORIGIN = (() => {
  try {
    return new URL(configuredOrigin).origin;
  } catch {
    return new URL(brandConfig.website).origin;
  }
})();

const ISO_DATE_PATTERN = /^\\d{4}-\\d{2}-\\d{2}(?:T.*)?$/;

const sanitizeSchema = (schema: object | undefined) => {
  if (!schema) return undefined;
  const cloned = JSON.parse(JSON.stringify(schema)) as Record<string, unknown>;
  const schemaType = cloned["@type"];

  if (schemaType === "Product" || schemaType === "Organization") {
    delete cloned.aggregateRating;
    delete cloned.review;
  }
  if (schemaType === "Product" && cloned.offers) {
    const offers = cloned.offers as Record<string, unknown>;
    delete offers.availability;
    cloned.offers = offers;
  }
  if (schemaType === "Article") {
    const published = cloned.datePublished;
    if (
      typeof published !== "string" ||
      !ISO_DATE_PATTERN.test(published) ||
      !Number.isFinite(Date.parse(published))
    ) {
      delete cloned.datePublished;
    }
  }
  return cloned;
};

export const SEO = ({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  author,
  schema,
  noIndex = false,
}: SEOProps) => {
  const location = useLocation();
  const nonce = useCspNonce();
  const siteTitle = title
    ? title + " | " + brandConfig.brandName
    : brandConfig.defaultMeta.title;
  const siteDescription = description || brandConfig.defaultMeta.description;
  const siteImage = resolvePublicMediaUrl(
    image || brandConfig.defaultMeta.image,
    SITE_ORIGIN,
  );
  const siteUrl = resolveCanonicalUrl(url || location.pathname, SITE_ORIGIN);
  const safePublishedTime =
    publishedTime &&
    ISO_DATE_PATTERN.test(publishedTime) &&
    Number.isFinite(Date.parse(publishedTime))
      ? publishedTime
      : undefined;
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandConfig.brandName,
    alternateName: brandConfig.brandNameEn,
    url: brandConfig.website,
    description: brandConfig.defaultMeta.description,
    telephone: brandConfig.phone,
    email: brandConfig.email,
    sameAs: [brandConfig.instagramUrl],
  };
  const serializedSchema = serializeJsonLd(
    sanitizeSchema(schema) || defaultSchema,
  );

  return (
    <>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={siteUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:site_name" content={brandConfig.brandName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      {type === "article" && safePublishedTime && (
        <meta property="article:published_time" content={safePublishedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedSchema }}
      />
    </>
  );
};
`,
);

rmSync("src/App.tsx", { force: true });
rmSync("src/main.tsx", { force: true });
rmSync("index.html", { force: true });

const gitignore = read(".gitignore");
const ignoreLines = [".react-router/", "build/"];
write(
  ".gitignore",
  gitignore +
    (gitignore.endsWith("\n") ? "" : "\n") +
    ignoreLines.filter((line) => !gitignore.includes(line)).join("\n") +
    "\n",
);

console.log("Phase 10.1 Framework Mode source migration written.");
