import { useEffect, useState } from "react";
import {
  Cookie,
  Menu,
  MessageCircle,
  Phone,
  ShoppingCart,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  brandConfig,
  generatePhoneUrl,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

type NavMatch = "home" | "products" | "categories" | "prefix";

interface NavLink {
  name: string;
  href: string;
  match: NavMatch;
}

const navLinks: NavLink[] = [
  { name: "خانه", href: "/", match: "home" },
  { name: "محصولات", href: "/products", match: "products" },
  { name: "دسته‌بندی‌ها", href: "/products/category/cookies", match: "categories" },
  { name: "باکس هدیه", href: "/gift", match: "prefix" },
  { name: "بلاگ", href: "/blog", match: "prefix" },
  { name: "درباره ما", href: "/about", match: "prefix" },
  { name: "تماس", href: "/contact", match: "prefix" },
];

const isNavLinkActive = (pathname: string, link: NavLink) => {
  if (link.match === "home") return pathname === "/";
  if (link.match === "products") {
    return (
      pathname === "/products" ||
      (pathname.startsWith("/products/") &&
        !pathname.startsWith("/products/category/"))
    );
  }
  if (link.match === "categories") {
    return pathname.startsWith("/products/category/");
  }
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
};

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const accountLabel = isAuthenticated
    ? user?.fullName || user?.mobile || "حساب کاربری"
    : "ورود به حساب کاربری";

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`overflow-hidden bg-gradient-to-l from-primary via-cocoa to-primary text-center text-sm font-medium text-primary-foreground transition-all duration-300 ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 py-2 opacity-100"
        }`}
      >
        <div className="container-custom flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-gold" aria-hidden="true" />
          <span>پخت تازه، بسته‌بندی محافظ و ارسال سراسری</span>
          <Sparkles size={14} className="text-gold" aria-hidden="true" />
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-border/50 bg-background/95 shadow-lg backdrop-blur-xl"
            : "bg-background"
        }`}
      >
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between gap-2 md:h-20">
            <Link
              to="/"
              className="group flex min-w-0 items-center gap-3"
              aria-label={`${brandConfig.brandName} - صفحه اصلی`}
            >
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-cocoa to-primary shadow-lg transition group-hover:scale-105 md:h-12 md:w-12">
                  <Cookie className="h-5 w-5 text-primary-foreground md:h-6 md:w-6" aria-hidden="true" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-gold" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate bg-gradient-to-l from-primary via-cocoa to-primary bg-clip-text text-xl font-bold text-transparent md:text-2xl">
                  {brandConfig.brandName}
                </span>
                <span className="hidden text-[10px] text-muted-foreground md:block">
                  {brandConfig.tagline}
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="منوی اصلی">
              {navLinks.map((link) => {
                const active = isNavLinkActive(location.pathname, link);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-1 md:gap-2">
              <Link
                to={isAuthenticated ? "/account" : "/account/login"}
                className="relative rounded-xl p-2.5 text-foreground/80 transition hover:bg-primary/5 hover:text-primary"
                aria-label={accountLabel}
                title={accountLabel}
              >
                <User size={20} aria-hidden="true" />
                {isAuthenticated && (
                  <span className="absolute left-1 top-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" aria-hidden="true" />
                )}
              </Link>

              <Link
                to="/cart"
                className="relative rounded-xl p-2.5 text-foreground/80 transition hover:bg-primary/5 hover:text-primary"
                aria-label={`سبد خرید${
                  totalItems > 0
                    ? `، ${totalItems.toLocaleString("fa-IR")} محصول`
                    : ""
                }`}
              >
                <ShoppingCart size={20} aria-hidden="true" />
                {totalItems > 0 && (
                  <span className="absolute -left-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                    {totalItems.toLocaleString("fa-IR")}
                  </span>
                )}
              </Link>

              <a
                href={generatePhoneUrl()}
                className="hidden items-center gap-2 rounded-xl px-3 py-2.5 text-foreground/80 transition hover:bg-primary/5 hover:text-primary md:flex"
                aria-label={`تماس با ${brandConfig.brandName}`}
              >
                <Phone size={18} aria-hidden="true" />
                <span className="hidden text-sm font-medium xl:inline">
                  {brandConfig.phone}
                </span>
              </a>

              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:scale-105 md:flex"
                aria-label="پشتیبانی واتساپ"
              >
                <MessageCircle size={18} aria-hidden="true" />
                پشتیبانی
              </a>

              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="rounded-xl bg-secondary/50 p-2.5 text-foreground transition hover:bg-secondary lg:hidden"
                aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
              >
                {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div
            id="mobile-navigation"
            className={`overflow-hidden transition-all duration-500 lg:hidden ${
              isOpen
                ? "max-h-[760px] opacity-100"
                : "pointer-events-none max-h-0 opacity-0"
            }`}
          >
            <nav className="flex flex-col gap-1 border-t border-border/50 py-4" aria-label="منوی موبایل">
              {isAuthenticated && (
                <Link to="/account" className="mb-2 rounded-xl bg-primary/10 px-4 py-3 font-bold text-primary">
                  حساب من — {user?.fullName || user?.mobile}
                </Link>
              )}
              {navLinks.map((link) => {
                const active = isNavLinkActive(location.pathname, link);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-4 py-3 font-medium transition ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-secondary hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="mt-4 flex flex-col gap-3 border-t border-border/50 px-2 pt-4">
                {!isAuthenticated && (
                  <Link
                    to="/account/login"
                    className="flex items-center justify-center gap-3 rounded-xl border-2 border-primary px-4 py-3.5 font-bold text-primary"
                  >
                    <User size={20} aria-hidden="true" />
                    ورود به حساب
                  </Link>
                )}
                <a
                  href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-xl bg-whatsapp px-4 py-3.5 font-bold text-white shadow-lg"
                >
                  <MessageCircle size={20} aria-hidden="true" />
                  پشتیبانی واتساپ
                </a>
                <a
                  href={generatePhoneUrl()}
                  className="flex items-center justify-center gap-3 rounded-xl border-2 border-primary px-4 py-3.5 font-bold text-primary"
                >
                  <Phone size={20} aria-hidden="true" />
                  {brandConfig.phone}
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
