import { lazy, Suspense, type ComponentType, type ReactElement } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginRoute } from "@/components/auth/LoginRoute";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CheckoutGuard } from "@/components/cart/CheckoutGuard";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { RouteLoadingFallback } from "@/components/RouteLoadingFallback";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { areDevelopmentMocksEnabled } from "@/lib/api";
import HomePage from "./pages/HomePage";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CityPage = lazy(() => import("./pages/CityPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CorporatePage = lazy(() => import("./pages/CorporatePage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const GiftPage = lazy(() => import("./pages/GiftPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const PaymentCallbackPage = lazy(() => import("./pages/PaymentCallbackPage"));
const PaymentMockPage = lazy(() => import("./pages/PaymentMockPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const QualityPage = lazy(() => import("./pages/QualityPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

const queryClient = new QueryClient({
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

const lazyElement = (Page: ComponentType): ReactElement => (
  <Suspense fallback={<RouteLoadingFallback />}>
    <Page />
  </Suspense>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <ScrollToTop />
              <RouteErrorBoundary>
                <Routes>
                  <Route element={<SiteLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={lazyElement(ProductsPage)} />
                    <Route path="/categories" element={lazyElement(CategoriesPage)} />
                    <Route
                      path="/products/category/:slug"
                      element={lazyElement(CategoryPage)}
                    />
                    <Route path="/products/:slug" element={lazyElement(ProductDetailPage)} />
                    <Route path="/blog" element={lazyElement(BlogListPage)} />
                    <Route path="/blog/:slug" element={lazyElement(BlogDetailPage)} />
                    <Route path="/city/:slug" element={lazyElement(CityPage)} />
                    <Route path="/gift" element={lazyElement(GiftPage)} />
                    <Route path="/corporate" element={lazyElement(CorporatePage)} />
                    <Route path="/reviews" element={lazyElement(ReviewsPage)} />
                    <Route path="/quality" element={lazyElement(QualityPage)} />
                    <Route path="/about" element={lazyElement(AboutPage)} />
                    <Route path="/gallery" element={lazyElement(GalleryPage)} />
                    <Route path="/faq" element={lazyElement(FAQPage)} />
                    <Route path="/contact" element={lazyElement(ContactPage)} />
                    <Route path="/privacy" element={lazyElement(PrivacyPage)} />
                    <Route path="/terms" element={lazyElement(TermsPage)} />
                    <Route path="/shipping" element={lazyElement(ShippingPage)} />
                    <Route path="/cart" element={lazyElement(CartPage)} />
                    <Route
                      path="/checkout"
                      element={<CheckoutGuard>{lazyElement(CheckoutPage)}</CheckoutGuard>}
                    />
                    {areDevelopmentMocksEnabled && (
                      <Route path="/payment/mock" element={lazyElement(PaymentMockPage)} />
                    )}
                    <Route
                      path="/payment/callback"
                      element={lazyElement(PaymentCallbackPage)}
                    />
                    <Route
                      path="/account/login"
                      element={<LoginRoute>{lazyElement(LoginPage)}</LoginRoute>}
                    />
                    <Route
                      path="/account"
                      element={<ProtectedRoute>{lazyElement(AccountPage)}</ProtectedRoute>}
                    />
                    <Route
                      path="/account/orders/:orderId"
                      element={<ProtectedRoute>{lazyElement(OrderDetailPage)}</ProtectedRoute>}
                    />
                    <Route path="*" element={lazyElement(NotFoundPage)} />
                  </Route>
                </Routes>
              </RouteErrorBoundary>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
