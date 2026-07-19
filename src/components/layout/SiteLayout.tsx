import { Outlet } from "react-router-dom";
import { RouteAnnouncer } from "@/components/accessibility/RouteAnnouncer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NetworkStatus } from "@/components/network/NetworkStatus";
import { PwaUpdatePrompt } from "@/components/pwa/PwaUpdatePrompt";

export const SiteLayout = () => (
  <div className="flex min-h-screen min-w-0 flex-col">
    <a href="#main-content" className="skip-link">
      رفتن به محتوای اصلی
    </a>
    <RouteAnnouncer />
    <NetworkStatus />
    <Header />
    <main id="main-content" className="min-w-0 flex-1" tabIndex={-1}>
      <Outlet />
    </main>
    <Footer />
    <FloatingWhatsApp />
    <PwaUpdatePrompt />
  </div>
);
