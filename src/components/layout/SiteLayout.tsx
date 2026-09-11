import { Outlet } from "react-router";
import { RouteAnnouncer } from "@/components/accessibility/RouteAnnouncer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { NetworkStatus } from "@/components/network/NetworkStatus";
import { PwaUpdatePrompt } from "@/components/pwa/PwaUpdatePrompt";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";
import { GuestPushPrompt } from "@/components/pwa/GuestPushPrompt";
import { TrustStrip } from "@/components/trust/TrustStrip";

export const SiteLayout = () => (
  <div className="site-shell flex min-h-screen min-w-0 flex-col">
    <a href="#main-content" className="skip-link">
      رفتن به محتوای اصلی
    </a>
    <RouteAnnouncer />
    <ScrollProgress />
    <NetworkStatus />
    <div className="ambient-layer" aria-hidden="true">
      <span className="ambient-orb ambient-orb-one" />
      <span className="ambient-orb ambient-orb-two" />
      <span className="ambient-orb ambient-orb-three" />
    </div>
    <Header />
    <main id="main-content" className="relative z-10 min-w-0 flex-1" tabIndex={-1}>
      <Outlet />
    </main>
    <TrustStrip />
    <Footer />
    <MobileBottomNavigation />
    <BackToTopButton />
    <FloatingWhatsApp />
    <PwaUpdatePrompt />
    <PwaInstallPrompt />
    <GuestPushPrompt />
  </div>
);
