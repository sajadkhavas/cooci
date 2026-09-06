import { useEffect, useRef, useState } from "react";
import {
  ArrowUpLeft,
  Cookie,
  Menu,
  MessageCircle,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";
import {
  isNavigationTargetActive,
  type NavigationMatch,
} from "@/lib/accessibility/navigation";

interface NavLink {
  name: string;
  href: string;
  match: NavigationMatch;
}

const navigationMatchFor = (href: string): NavigationMatch => {
  if (href === "/") return "home";
  if (href === "/products") return "products";
  return "prefix";
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
  const { settings, content } = useStorefrontSettings();
  const navLinks: NavLink[] = content.navigation.links.map((link) => ({
    name: link.label,
    href: link.href,
    match: navigationMatchFor(link.href),
  }));
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const restoreMenuFocusRef = useRef(true);
  const previousLocationRef = useRef(`${location.pathname}${location.search}`);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const locationKey = `${location.pathname}${location.search}`;
    if (previousLocationRef.current === locationKey) return;
    previousLocationRef.current = locationKey;
    if (!isOpen) return;
    restoreMenuFocusRef.current = false;
    setIsOpen(false);
  }, [isOpen, location.pathname, location.search]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.documentElement.dataset.mobileMenuOpen = "true";
    const drawer = drawerRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreMenuFocusRef.current = true;
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
      delete document.documentElement.dataset.mobileMenuOpen;
      window.removeEventListener("keydown", handleKeyDown);
      if (restoreMenuFocusRef.current) {
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };
  }, [isOpen]);

  const accountLabel = isAuthenticated
    ? user?.fullName || user?.mobile || "حساب کاربری"
    : "ورود به حساب کاربری";

  return (
    <header className="sticky top-0 z-50 min-w-0 px-2 pt-2 sm:px-4 sm:pt-3">
      <div
        className={`mx-auto max-w-[92rem] rounded-[1.6rem] border transition-all duration-500 ${
          scrolled
            ? "border-[#27390c]/15 bg-[#d0e596]/88 shadow-[0_18px_60px_-34px_hsl(var(--foreground)/0.65)] backdrop-blur-2xl"
            : "border-[#27390c]/10 bg-[#d0e596]/72 backdrop-blur-xl"
        }`}
      >
        <div className="flex min-h-16 items-center justify-between gap-3 px-3 sm:px-5 lg:min-h-20 lg:px-6">
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-3 rounded-2xl"
            aria-label={`${settings.brand.name} - صفحه اصلی`}
          >
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-[0_16px_34px_-18px_hsl(var(--primary)/0.9)] transition duration-500 group-hover:-rotate-6 group-hover:scale-105 lg:h-12 lg:w-12">
              <span className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-accent/20" />
              <Cookie size={23} className="relative" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-lg font-black tracking-[-0.04em] text-foreground sm:text-xl">
                {settings.brand.name}
              </strong>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:block">
                {settings.brand.nameEn}
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center rounded-full border border-border/70 bg-card/60 p-1.5 shadow-soft backdrop-blur-xl xl:flex"
            aria-label="منوی اصلی"
          >
            {navLinks.map((link) => {
              const active = isNavigationTargetActive(location.pathname, link);
              return (
                <Link
                  key={`${link.href}-${link.name}`}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2.5 text-sm font-bold transition duration-300 ${
                    active
                      ? "bg-interactive text-interactive-foreground shadow-lg"
                      : "text-foreground/70 hover:bg-interactive-soft hover:text-interactive-strong"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={settings.contact.phoneUrl}
              className="touch-target hidden items-center justify-center rounded-full border border-border/70 bg-card/55 px-4 text-sm font-black text-foreground shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary lg:flex"
              aria-label={`تماس با ${settings.brand.name}: ${settings.contact.phone}`}
            >
              <Phone size={17} className="ml-2" aria-hidden="true" />
              <span dir="ltr">{settings.contact.phone}</span>
            </a>

            <Link
              to={isAuthenticated ? "/account" : "/account/login"}
              className="touch-target relative flex items-center justify-center rounded-full border border-border/70 bg-card/55 text-foreground shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary"
              aria-label={accountLabel}
              title={accountLabel}
            >
              <User size={19} aria-hidden="true" />
              {isAuthenticated && (
                <span
                  className="absolute left-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-card"
                  aria-hidden="true"
                />
              )}
            </Link>

            <Link
              to="/cart"
              className="touch-target relative flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_14px_30px_-16px_hsl(var(--primary)/0.95)] transition duration-300 hover:-translate-y-0.5 hover:scale-[1.03]"
              aria-label={`سبد خرید${
                totalItems > 0
                  ? `، ${totalItems.toLocaleString("fa-IR")} محصول`
                  : "، خالی"
              }`}
            >
              <ShoppingCart size={19} aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-black text-accent-foreground ring-2 ring-background">
                  {totalItems.toLocaleString("fa-IR")}
                </span>
              )}
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => {
                restoreMenuFocusRef.current = true;
                setIsOpen(true);
              }}
              className="touch-target flex items-center justify-center rounded-full border border-interactive/30 bg-interactive-soft text-interactive-strong shadow-soft transition-colors hover:bg-interactive/20 xl:hidden"
              aria-label="باز کردن منوی اصلی"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-dialog"
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {!scrolled && (
        <div className="pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] hidden -translate-x-1/2 items-center gap-2 rounded-full border border-border/60 bg-card/65 px-4 py-2 text-[11px] font-bold text-muted-foreground shadow-soft backdrop-blur-xl lg:flex">
          <Sparkles size={14} className="text-gold" aria-hidden="true" />
          {content.navigation.contextLine}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[70] xl:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-foreground/45 backdrop-blur-md"
            onClick={() => {
              restoreMenuFocusRef.current = true;
              setIsOpen(false);
            }}
            aria-label="بستن منوی اصلی"
          />

          <div
            ref={drawerRef}
            id="mobile-navigation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-navigation-title"
            className="mobile-navigation-drawer absolute inset-y-0 right-0 flex w-[min(92vw,27rem)] max-w-full animate-slide-in-right flex-col overflow-y-auto border-l border-interactive/20 bg-interactive-soft text-foreground shadow-2xl"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="absolute -right-24 top-16 h-60 w-60 rounded-full bg-accent/20 blur-[80px]" />
              <span className="absolute -left-28 bottom-20 h-72 w-72 rounded-full bg-gold/15 blur-[90px]" />
            </div>

            <div className="relative flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p id="mobile-navigation-title" className="text-xl font-black">
                  {settings.brand.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {content.navigation.mobileSubtitle}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => {
                  restoreMenuFocusRef.current = true;
                  setIsOpen(false);
                }}
                className="touch-target flex items-center justify-center rounded-full border border-interactive/30 bg-card text-interactive-strong transition-colors hover:bg-interactive/15"
                aria-label="بستن منوی اصلی"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex-1 p-5">
              <Link
                to={isAuthenticated ? "/account" : "/account/login"}
                onClick={() => {
                  restoreMenuFocusRef.current = false;
                  setIsOpen(false);
                }}
                className="mb-6 flex min-h-20 items-center gap-4 rounded-[1.5rem] border border-interactive/25 bg-card/85 p-4 shadow-soft"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-interactive text-interactive-foreground">
                  <User size={22} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-lg">
                    {isAuthenticated
                      ? user?.fullName || "حساب کاربری"
                      : content.navigation.mobileGuestTitle}
                  </strong>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {isAuthenticated
                      ? user?.mobile
                      : content.navigation.mobileGuestSubtitle}
                  </span>
                </span>
                <ArrowUpLeft size={18} aria-hidden="true" />
              </Link>

              <nav className="grid gap-2" aria-label="منوی موبایل">
                {navLinks.map((link, index) => {
                  const active = isNavigationTargetActive(
                    location.pathname,
                    link,
                  );
                  return (
                    <Link
                      key={`${link.href}-${link.name}`}
                      to={link.href}
                      aria-label={link.name}
                      onClick={() => {
                        restoreMenuFocusRef.current = false;
                        setIsOpen(false);
                      }}
                      aria-current={active ? "page" : undefined}
                      className={`group flex min-h-14 items-center justify-between rounded-2xl px-4 py-3 text-lg font-black transition ${
                        active
                          ? "bg-interactive text-interactive-foreground shadow-soft"
                          : "border border-border bg-card/70 text-foreground hover:border-interactive/30 hover:bg-interactive/10"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xs font-black opacity-45">
                          {(index + 1).toLocaleString("fa-IR")}.
                        </span>
                        {link.name}
                      </span>
                      <ArrowUpLeft
                        size={17}
                        className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mobile-sticky-bar relative grid gap-3 border-t border-interactive/20 bg-card/92 p-5">
              <Link
                to={content.navigation.categoriesCta.href}
                onClick={() => {
                  restoreMenuFocusRef.current = false;
                  setIsOpen(false);
                }}
                className="flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-interactive px-5 py-3.5 font-black text-interactive-foreground shadow-soft transition-colors hover:bg-interactive-strong hover:text-white"
              >
                <ShoppingBag size={19} aria-hidden="true" />
                {content.navigation.categoriesCta.label}
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={settings.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 font-bold"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  {content.navigation.whatsappLabel}
                </a>
                <a
                  href={settings.contact.phoneUrl}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 font-bold"
                >
                  <Phone size={18} aria-hidden="true" />
                  {content.navigation.phoneLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
