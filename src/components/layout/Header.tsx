import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Sparkles, Cookie, ShoppingBag } from "lucide-react";
import { brandConfig, generatePhoneUrl } from "@/config/brand";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { name: "خانه", href: "/" },
  { name: "محصولات", href: "/products" },
  { name: "درباره ما", href: "/about" },
  { name: "گالری", href: "/gallery" },
  { name: "سوالات متداول", href: "/faq" },
  { name: "تماس با ما", href: "/contact" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar - Promotional */}
      <div 
        className={`bg-gradient-to-l from-primary via-cocoa to-primary text-primary-foreground text-center text-sm font-medium transition-all duration-300 ease-out overflow-hidden ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100 py-2"
        }`}
      >
        <div className="container-custom flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-gold" />
          <span>پخت تازه — ثبت سفارش آنلاین — آماده اتصال به درگاه پرداخت</span>
          <Sparkles size={14} className="text-gold" />
        </div>
      </div>

      {/* Main Header */}
      <div className={`transition-all duration-300 ${
        scrolled 
          ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50" 
          : "bg-background"
      }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
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
                <span className="text-[10px] text-muted-foreground hidden md:block">{brandConfig.tagline}</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={generatePhoneUrl()}
                className="group flex items-center gap-2 px-4 py-2.5 text-foreground/80 hover:text-primary rounded-xl transition-all duration-300 hover:bg-primary/5"
              >
                <div className="relative">
                  <Phone size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <span className="hidden xl:inline font-medium">{brandConfig.phone}</span>
              </a>
              <Link
                to="/cart"
                className="group relative overflow-hidden bg-primary px-6 py-2.5 rounded-xl font-bold text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="relative flex items-center gap-2">
                  <span className="relative">
                    <ShoppingBag size={20} />
                    {itemCount > 0 && (
                      <span className="absolute -top-3 -right-3 min-w-5 h-5 px-1 bg-gold text-primary rounded-full text-[10px] flex items-center justify-center font-black">
                        {itemCount.toLocaleString("fa-IR")}
                      </span>
                    )}
                  </span>
                  سبد خرید
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 text-foreground bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
              aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Nav */}
          <div className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}>
            <div className="py-4 border-t border-border/50">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                        isActive 
                          ? "text-primary bg-primary/10" 
                          : "text-foreground/80 hover:text-primary hover:bg-secondary"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <div className="flex flex-col gap-3 mt-4 px-2 pt-4 border-t border-border/50">
                  <Link
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-3 bg-primary px-4 py-3.5 rounded-xl font-bold text-primary-foreground shadow-lg"
                  >
                    <ShoppingBag size={20} />
                    سبد خرید {itemCount > 0 ? `(${itemCount.toLocaleString("fa-IR")})` : ""}
                  </Link>
                  <a
                    href={generatePhoneUrl()}
                    className="flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-all"
                  >
                    <Phone size={20} />
                    تماس تلفنی
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