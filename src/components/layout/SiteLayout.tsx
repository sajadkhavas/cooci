import { Outlet } from "react-router-dom";
import { RouteAnnouncer } from "@/components/accessibility/RouteAnnouncer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const SiteLayout = () => (
  <div className="flex min-h-screen min-w-0 flex-col">
    <a href="#main-content" className="skip-link">
      رفتن به محتوای اصلی
    </a>
    <RouteAnnouncer />
    <Header />
    <main
      id="main-content"
      className="min-w-0 flex-1 outline-none"
      tabIndex={-1}
    >
      <Outlet />
    </main>
    <Footer />
    <FloatingWhatsApp />
  </div>
);
