import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CheckoutGuard } from "@/components/cart/CheckoutGuard";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import AboutPage from "./pages/AboutPage";
import AccountPage from "./pages/AccountPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogListPage from "./pages/BlogListPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import CityPage from "./pages/CityPage";
import ContactPage from "./pages/ContactPage";
import CorporatePage from "./pages/CorporatePage";
import FAQPage from "./pages/FAQPage";
import GalleryPage from "./pages/GalleryPage";
import GiftPage from "./pages/GiftPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import PaymentCallbackPage from "./pages/PaymentCallbackPage";
import PaymentMockPage from "./pages/PaymentMockPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import QualityPage from "./pages/QualityPage";
import ReviewsPage from "./pages/ReviewsPage";
import ShippingPage from "./pages/ShippingPage";
import TermsPage from "./pages/TermsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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
              <Routes>
                <Route element={<SiteLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/category/:slug" element={<CategoryPage />} />
                  <Route path="/products/:slug" element={<ProductDetailPage />} />
                  <Route path="/blog" element={<BlogListPage />} />
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />
                  <Route path="/city/:slug" element={<CityPage />} />
                  <Route path="/gift" element={<GiftPage />} />
                  <Route path="/corporate" element={<CorporatePage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/quality" element={<QualityPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/shipping" element={<ShippingPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route
                    path="/checkout"
                    element={(
                      <CheckoutGuard>
                        <CheckoutPage />
                      </CheckoutGuard>
                    )}
                  />
                  <Route path="/payment/mock" element={<PaymentMockPage />} />
                  <Route path="/payment/callback" element={<PaymentCallbackPage />} />
                  <Route path="/account/login" element={<LoginPage />} />
                  <Route
                    path="/account"
                    element={(
                      <ProtectedRoute>
                        <AccountPage />
                      </ProtectedRoute>
                    )}
                  />
                  <Route
                    path="/account/orders/:orderId"
                    element={(
                      <ProtectedRoute>
                        <OrderDetailPage />
                      </ProtectedRoute>
                    )}
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
