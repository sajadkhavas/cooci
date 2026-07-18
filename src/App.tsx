import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryPage from "./pages/CategoryPage";
import CityPage from "./pages/CityPage";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import GiftPage from "./pages/GiftPage";
import CorporatePage from "./pages/CorporatePage";
import ReviewsPage from "./pages/ReviewsPage";
import QualityPage from "./pages/QualityPage";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentCallbackPage from "./pages/PaymentCallbackPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ShippingPage from "./pages/ShippingPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartProvider>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
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
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment/callback" element={<PaymentCallbackPage />} />
                  <Route path="/account/login" element={<LoginPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/account/orders/:orderId" element={<OrderDetailPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <FloatingWhatsApp />
            </div>
          </CartProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
