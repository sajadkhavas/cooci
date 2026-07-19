import { Outlet } from "react-router-dom";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const SiteLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
      <Outlet />
    </main>
    <Footer />
    <FloatingWhatsApp />
  </div>
);
