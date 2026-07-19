import { useEffect, useRef, useState } from "react";
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
  {
    name: "دسته‌بندی‌ها",
    href: "/products/category/cookies",
    match: "categories",
  },
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

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const drawer = drawerRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !drawer) return;
      const focusableItems = Array.from(
        drawer.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusableItems.length === 0) return;

      const first = focusableItems[0];
      const last = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    };
  }, [isOpen]);

  const accountLabel = isAuthenticated
    ? user?.fullName || user?.mobile || "حساب کاربری"
    : "ورود به حساب کاربری";

  return (
    <header className="sticky top-0 z-50 min-w-0">
      <div
        aria-hidden={scrolled}
        className={`overflow-hidden bg-gradient-to-l from-primary via-cocoa to-primary text-center text-xs font-medium text-primary-foreground transition-[max-height,opacity,padding] duration-300 sm:text-sm ${
          scrolled ? "max-h-0 py-0 opacity-0" : "max-h-12 py-2 opacity-100"
        }`}
      >
        <div className="container-custom flex items-center justify-center gap-2">
          <Sparkles size={14} className="shrink-0 text-gold" aria-hidden="true" />
          <span className="truncate">پخت تازه، بسته‌بندی محافظ و ارسال سراسری</span>
          <Sparkles size={14} className="shrink-0 text-gold" aria-hidden="true" />
        </div>
      </div>

      <div
        className={`transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled
            ? "border-b border-border/50 bg-background/95 shadow-lg backdrop-blur-xl"
            : "bg-background"
        }`}
      >
        <div className="container-custom">
          <div className="flex h-16 min-w-0 items-center justify-between gap-2 md:h-20">
            <Link
              to="/"
              className="group flex min-w-0 items-center gap-2 rounded-xl sm:gap-3"
              aria-label={`${brandConfig.brandName} - صفحه اصلی`}
            >
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-cocoa to-primary shadow-lg transition-transform group-hover:scale-105 md:h-12 md:w-12">
                  <Cookie
                    className="h-5 w-5 text-primary-foreground md:h-6 md:w-6"
                    aria-hidden="true"
                  />
                </div>
                <span
                  className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-gold ring-2 ring-background"
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <span className="block max-w-36 truncate bg-gradient-to-l from-primary via-cocoa to-primary bg-clip-text text-lg font-black text-transparent sm:max-w-none sm:text-xl md:text-2xl">
                  {brandConfig.brandName}
                </span>
                <span className="hidden text-[11px] text-muted-foreground md:block">
                  {brandConfig.tagline}
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-0.5 xl:flex" aria-label="منوی اصلی">
              {navLinks.map((link) => {
                const active = isNavLinkActive(location.pathname, link);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/75 hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 md:gap-2">
              <Link
                to={isAuthenticated ? "/account" : "/account/login"}
                className="touch-target relative flex items-center justify-center rounded-xl text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary"
                aria-label={accountLabel}
                title={accountLabel}
              >
                <User size={20} aria-hidden="true" />
                {isAuthenticated && (
                  <span
                    className="absolute left-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background"
                    aria-hidden="true"
                  />
                )}
              </Link>

              <Link
                to="/cart"
                className="touch-target relative flex items-center justify-center rounded-xl text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary"
                aria-label={`سبد خرید${
                  totalItems > 0
                    ? `، ${totalItems.toLocaleString("fa-IR")} محصول`
                    : "، خالی"
                }`}
              >
                <ShoppingCart size={20} aria-hidden="true" />
                {totalItems > 0 && (
                  <span className="absolute -left-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                    {totalItems.toLocaleString("fa-IR")}
                  </span>
                )}
              </Link>

              <a
                href={generatePhoneUrl()}
                className="touch-target hidden items-center justify-center gap-2 rounded-xl px-3 text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary lg:flex"
                aria-label={`تماس با ${brandConfig.brandName}: ${brandConfig.phone}`}
              >
                <Phone size={18} aria-hidden="true" />
                <span className="hidden text-sm font-medium 2xl:inline">
                  {brandConfig.phone}
                </span>
              </a>

              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden min-h-11 items-center gap-2 rounded-xl bg-whatsapp px-4 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.03] md:flex"
                aria-label="بازکردن پشتیبانی واتساپ در پنجره جدید"
              >
                <MessageCircle size={18} aria-hidden="true" />
                <span className="hidden lg:inline">پشتیبانی</span>
              </a>

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsOpen(true)}
                className="touch-target flex items-center justify-center rounded-xl bg-secondary/60 text-foreground transition-colors hover:bg-secondary xl:hidden"
                aria-label="باز کردن منوی اصلی"
                aria-expanded={isOpen}
                aria-controls="mobile-navigation-dialog"
              >
                <Menu size={24} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[70] xl:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-black/45 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
            aria-label="بستن منوی اصلی"
          />

          <div
            ref={drawerRef}
            id="mobile-navigation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-navigation-title"
            className="absolute inset-y-0 right-0 flex w-[min(90vw,24rem)] max-w-full animate-slide-in-right flex-col overflow-y-auto border-l border-border bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <p id="mobile-navigation-title" className="font-black text-foreground">
                  منوی {brandConfig.brandName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  دسترسی سریع به فروشگاه و حساب
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                className="touch-target flex items-center justify-center rounded-xl bg-secondary text-foreground"
                aria-label="بستن منوی اصلی"
              >
                <X size={23} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 p-4">
              <Link
                to={isAuthenticated ? "/account" : "/account/login"}
                className="mb-4 flex min-h-14 items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-primary"
              >
                <User size={21} aria-hidden="true" />
                <span className="min-w-0">
                  <strong className="block truncate">
                    {isAuthenticated
                      ? user?.fullName || "حساب کاربری"
                      : "ورود به حساب کاربری"}
                  </strong>
                  <span className="block truncate text-xs opacity-80">
                    {isAuthenticated ? user?.mobile : "مشاهده سفارش‌ها و پروفایل"}
                  </span>
                </span>
              </Link>

              <nav className="flex flex-col gap-1" aria-label="منوی موبایل">
                {navLinks.map((link) => {
                  const active = isNavLinkActive(location.pathname, link);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-12 items-center rounded-xl px-4 py-3 font-medium transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/85 hover:bg-secondary hover:text-primary"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mobile-sticky-bar space-y-3 border-t border-border bg-card p-4">
              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center gap-3 rounded-xl bg-whatsapp px-4 py-3 font-bold text-white shadow-lg"
              >
                <MessageCircle size={20} aria-hidden="true" />
                پشتیبانی واتساپ
              </a>
              <a
                href={generatePhoneUrl()}
                className="flex min-h-12 items-center justify-center gap-3 rounded-xl border-2 border-primary px-4 py-3 font-bold text-primary"
              >
                <Phone size={20} aria-hidden="true" />
                <span dir="ltr">{brandConfig.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
