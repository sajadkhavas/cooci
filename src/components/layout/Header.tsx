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
import { Link, useLocation } from "react-router-dom";
import {
  brandConfig,
  generatePhoneUrl,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  isNavigationTargetActive,
  type NavigationMatch,
} from "@/lib/accessibility/navigation";

interface NavLink {
  name: string;
  href: string;
  match: NavigationMatch;
}

const navLinks: NavLink[] = [
  { name: "خانه", href: "/", match: "home" },
  { name: "فروشگاه", href: "/products", match: "products" },
  {
    name: "کوکی‌ها",
    href: "/products/category/cookies",
    match: "exact",
  },
  { name: "هدیه", href: "/gift", match: "prefix" },
  { name: "راهنماها", href: "/blog", match: "prefix" },
  { name: "داستان ما", href: "/about", match: "prefix" },
];

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
  const restoreMenuFocusRef = useRef(true);
  const previousLocationRef = useRef(
    `${location.pathname}${location.search}`,
  );

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
            ? "border-border/70 bg-background/78 shadow-[0_18px_60px_-34px_hsl(var(--foreground)/0.65)] backdrop-blur-2xl"
            : "border-transparent bg-background/35 backdrop-blur-md"
        }`}
      >
        <div className="flex min-h-16 items-center justify-between gap-3 px-3 sm:px-5 lg:min-h-20 lg:px-6">
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-3 rounded-2xl"
            aria-label={`${brandConfig.brandName} - صفحه اصلی`}
          >
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-[0_16px_34px_-18px_hsl(var(--primary)/0.9)] transition duration-500 group-hover:-rotate-6 group-hover:scale-105 lg:h-12 lg:w-12">
              <span className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-accent/20" />
              <Cookie size={23} className="relative" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-lg font-black tracking-[-0.04em] text-foreground sm:text-xl">
                {brandConfig.brandName}
              </strong>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:block">
                {brandConfig.brandNameEn}
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
                  key={link.href}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2.5 text-sm font-bold transition duration-300 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-foreground/70 hover:bg-background/80 hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={generatePhoneUrl()}
              className="touch-target hidden items-center justify-center rounded-full border border-border/70 bg-card/55 px-4 text-sm font-black text-foreground shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary lg:flex"
              aria-label={`تماس با ${brandConfig.brandName}: ${brandConfig.phone}`}
            >
              <Phone size={17} className="ml-2" aria-hidden="true" />
              <span dir="ltr">{brandConfig.phone}</span>
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
              className="touch-target flex items-center justify-center rounded-full border border-border/70 bg-card/65 text-foreground shadow-soft backdrop-blur-xl transition hover:bg-card xl:hidden"
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
          تجربه مدرن، سریع و شفاف برای انتخاب شیرین‌تر
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
            className="absolute inset-y-0 right-0 flex w-[min(92vw,27rem)] max-w-full animate-slide-in-right flex-col overflow-y-auto border-l border-white/15 bg-primary text-primary-foreground shadow-2xl"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="absolute -right-24 top-16 h-60 w-60 rounded-full bg-accent/20 blur-[80px]" />
              <span className="absolute -left-28 bottom-20 h-72 w-72 rounded-full bg-gold/15 blur-[90px]" />
            </div>

            <div className="relative flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p id="mobile-navigation-title" className="text-xl font-black">
                  {brandConfig.brandName}
                </p>
                <p className="mt-1 text-xs text-primary-foreground/55">
                  منوی سریع فروشگاه
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => {
                  restoreMenuFocusRef.current = true;
                  setIsOpen(false);
                }}
                className="touch-target flex items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
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
                className="mb-6 flex min-h-20 items-center gap-4 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <User size={22} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-lg">
                    {isAuthenticated
                      ? user?.fullName || "حساب کاربری"
                      : "ورود به حساب"}
                  </strong>
                  <span className="mt-1 block truncate text-xs text-primary-foreground/55">
                    {isAuthenticated ? user?.mobile : "سفارش‌ها، پروفایل و پیگیری"}
                  </span>
                </span>
                <ArrowUpLeft size={18} aria-hidden="true" />
              </Link>

              <nav className="grid gap-2" aria-label="منوی موبایل">
                {navLinks.map((link, index) => {
                  const active = isNavigationTargetActive(location.pathname, link);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      aria-label={link.name}
                      onClick={() => {
                        restoreMenuFocusRef.current = false;
                        setIsOpen(false);
                      }}
                      aria-current={active ? "page" : undefined}
                      className={`group flex min-h-14 items-center justify-between rounded-2xl px-4 py-3 text-lg font-black transition ${
                        active
                          ? "bg-accent text-accent-foreground"
                          : "border border-white/10 bg-white/[0.055] text-white hover:bg-white/10"
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

            <div className="mobile-sticky-bar relative grid gap-3 border-t border-white/10 bg-black/10 p-5">
              <Link
                to="/products"
                onClick={() => {
                  restoreMenuFocusRef.current = false;
                  setIsOpen(false);
                }}
                className="flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3.5 font-black text-accent-foreground"
              >
                <ShoppingBag size={19} aria-hidden="true" />
                ورود به فروشگاه
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 font-bold"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  واتساپ
                </a>
                <a
                  href={generatePhoneUrl()}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 font-bold"
                >
                  <Phone size={18} aria-hidden="true" />
                  تماس
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
