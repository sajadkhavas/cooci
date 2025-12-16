import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { brandConfig, generateWhatsAppUrl, generatePhoneUrl } from "@/config/brand";

const navLinks = [
  { name: "خانه", href: "/" },
  { name: "محصولات", href: "/products" },
  { name: "درباره ما", href: "/about" },
  { name: "گالری", href: "/gallery" },
  { name: "وبلاگ", href: "/blog" },
  { name: "سوالات متداول", href: "/faq" },
  { name: "تماس با ما", href: "/contact" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-bold text-primary">
              {brandConfig.brandName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-foreground/80 hover:text-primary transition-colors link-underline"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={generatePhoneUrl()}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-secondary rounded-lg transition-colors"
            >
              <Phone size={18} />
              <span className="hidden xl:inline">{brandConfig.phone}</span>
            </a>
            <a
              href={generateWhatsAppUrl("سلام، می‌خواهم سفارش بدهم.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-5 py-2 rounded-lg font-medium"
            >
              سفارش در واتساپ
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-foreground/80 hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                <a
                  href={generatePhoneUrl()}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-primary text-primary rounded-lg"
                >
                  <Phone size={18} />
                  تماس تلفنی
                </a>
                <a
                  href={generateWhatsAppUrl("سلام، می‌خواهم سفارش بدهم.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp px-4 py-3 rounded-lg font-medium text-center"
                >
                  سفارش در واتساپ
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
