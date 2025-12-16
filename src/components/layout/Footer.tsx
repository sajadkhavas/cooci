import { Link } from "react-router-dom";
import { Instagram, Phone, MapPin, Clock } from "lucide-react";
import { brandConfig, generateWhatsAppUrl, generatePhoneUrl } from "@/config/brand";

const footerLinks = {
  quickLinks: [
    { name: "محصولات", href: "/products" },
    { name: "راهنمای سفارش", href: "/order" },
    { name: "درباره ما", href: "/about" },
    { name: "تماس با ما", href: "/contact" },
  ],
  categories: [
    { name: "کوکی شکلاتی", href: "/products?category=chocolate" },
    { name: "کوکی کلاسیک", href: "/products?category=classic" },
    { name: "کوکی رژیمی", href: "/products?category=diet" },
    { name: "باکس هدیه", href: "/products?category=gift" },
  ],
  legal: [
    { name: "حریم خصوصی", href: "/privacy" },
    { name: "شرایط استفاده", href: "/terms" },
    { name: "شرایط ارسال", href: "/shipping" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{brandConfig.brandName}</h3>
            <p className="text-primary-foreground/80 body-base">
              {brandConfig.tagline}
              <br />
              {brandConfig.slogan}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={brandConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors"
                aria-label="اینستاگرام"
              >
                <Instagram size={20} />
              </a>
              <a
                href={generateWhatsAppUrl("سلام")}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors"
                aria-label="واتساپ"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">تماس با ما</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-1 flex-shrink-0" />
                <a href={generatePhoneUrl()} className="hover:underline">
                  {brandConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80">{brandConfig.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="mt-1 flex-shrink-0" />
                <div className="text-primary-foreground/80">
                  <div>شنبه تا پنج‌شنبه: {brandConfig.workingHours.weekdays}</div>
                  <div>جمعه: {brandConfig.workingHours.weekends}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/70 text-sm">
              © ۱۴۰۳ {brandConfig.brandName}. تمامی حقوق محفوظ است.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
