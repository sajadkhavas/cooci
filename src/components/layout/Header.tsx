import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Sparkles, Cookie, MessageCircle, ShoppingCart, User } from "lucide-react";
import {
  brandConfig,
  generatePhoneUrl,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { useCart } from "@/context/CartContext";
import { getSession } from "@/lib/session";

const navLinks = [
  { name: "خانه", href: "/" },
  { name: "محصولات", href: "/products" },
  { name: "دسته‌بندی‌ها", href: "/products/category/cookies" },
  { name: "باکس هدیه", href: "/gift" },
  { name: "بلاگ", href: "/blog" },
  { name: "درباره ما", href: "/about" },
  { name: "تماس", href: "/contact" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const isLoggedIn = !!getSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`bg-gradient-to-l from-primary via-cocoa to-primary text-primary-foreground text-center text-sm font-medium transition-all duration-300 ease-out overflow-hidden ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100 py-2"
        }`}
      >
        <div className="container-custom flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-gold" />
          <span>پخت تازه، بسته‌بندی محافظ و ارسال سراسری</span>
          <Sparkles size={14} className="text-gold" />
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50"
            : "bg-background"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary via-cocoa to-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Cookie className="text-primary-foreground w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gold rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-l from-primary via-cocoa to-primary bg-clip-text text-transparent">
                  {brandConfig.brandName}
                </span>
                <span className="text-[10px] text-muted-foreground hidden md:block">
                  {brandConfig.tagline}
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.href.split("?")[0]);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1 md:gap-2">
              <Link
                to={isLoggedIn ? "/account" : "/account/login"}
                className="p-2.5 text-foreground/80 hover:text-primary rounded-xl transition-all hover:bg-primary/5"
                aria-label="حساب کاربری"
              >
                <User size={20} />
              </Link>
              <Link
                to="/cart"
                className="relative p-2.5 text-foreground/80 hover:text-primary rounded-xl transition-all hover:bg-primary/5"
                aria-label="سبد خرید"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -left-1 bg-destructive text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold">
                    {totalItems.toLocaleString("fa-IR")}
                  </span>
                )}
              </Link>
              <a
                href={generatePhoneUrl()}
                className="hidden md:flex items-center gap-2 px-3 py-2.5 text-foreground/80 hover:text-primary rounded-xl transition-all hover:bg-primary/5"
                aria-label={`تماس با ${brandConfig.brandName}`}
              >
                <Phone size={18} />
                <span className="hidden xl:inline font-medium text-sm">{brandConfig.phone}</span>
              </a>
              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 bg-whatsapp px-4 py-2.5 rounded-xl font-bold text-white text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
                aria-label="پشتیبانی واتساپ"
                title="پشتیبانی واتساپ"
              >
                <MessageCircle size={18} />
                پشتیبانی
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 text-foreground bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
              aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ${
              isOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-4 border-t border-border/50">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-xl font-medium text-foreground/80 hover:text-primary hover:bg-secondary transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 mt-4 px-2 pt-4 border-t border-border/50">
                  <a
                    href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-3 bg-whatsapp px-4 py-3.5 rounded-xl font-bold text-white shadow-lg"
                  >
                    <MessageCircle size={20} />
                    پشتیبانی واتساپ
                  </a>
                  <a
                    href={generatePhoneUrl()}
                    className="flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-primary text-primary rounded-xl font-bold"
                  >
                    <Phone size={20} />
                    {brandConfig.phone}
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
