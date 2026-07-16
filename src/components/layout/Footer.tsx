import { Link } from "react-router-dom";
import { ArrowUp, Cookie, Heart, Instagram, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { brandConfig, generatePhoneUrl, generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";

const footerLinks = {
  quickLinks: [
    { name: "خانه", href: "/" },
    { name: "همه محصولات", href: "/products" },
    { name: "درباره ما", href: "/about" },
    { name: "نظرات مشتریان", href: "/reviews" },
    { name: "بلاگ", href: "/blog" },
    { name: "تماس با ما", href: "/contact" },
  ],
  categories: [
    { name: "کوکی‌های خانگی", href: "/products/category/cookies" },
    { name: "مینی کوکی", href: "/products/category/mini-cookies" },
    { name: "کوکی رژیمی و دیابتی", href: "/products/category/diet-diabetic" },
    { name: "کیک تازه", href: "/products/category/cakes" },
    { name: "چیزکیک", href: "/products/category/cheesecakes" },
    { name: "باکس هدیه", href: "/products/category/gift-boxes" },
  ],
  cities: [
    { name: "کوکی در تهران", href: "/city/tehran" },
    { name: "کوکی در کرج", href: "/city/karaj" },
    { name: "کوکی در اندیشه", href: "/city/andisheh" },
    { name: "هدیه شرکتی", href: "/corporate" },
    { name: "باکس هدیه", href: "/gift" },
  ],
  legal: [
    { name: "استاندارد کیفیت", href: "/quality" },
    { name: "شرایط ارسال", href: "/shipping" },
    { name: "حریم خصوصی", href: "/privacy" },
    { name: "شرایط استفاده", href: "/terms" },
    { name: "سوالات متداول", href: "/faq" },
  ],
};

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-gradient-to-b from-primary via-cocoa to-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-60 h-60 bg-gold/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-20 bg-background" style={{ clipPath: "ellipse(60% 100% at 50% 0%)" }} />

      <div className="relative pt-32 pb-10">
        <div className="container-custom">
          <div className="bg-gradient-to-l from-gold/20 via-primary-foreground/10 to-gold/20 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-primary-foreground/20 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full">
                  <Sparkles size={16} className="text-gold" />
                  <span className="text-sm font-semibold">سفارش سریع در واتساپ</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold">فقط کافیه در واتساپ پیام بدید تا سفارش‌تون رو ثبت کنیم</h3>
                <p className="text-primary-foreground/70 leading-8 text-sm">
                  {brandConfig.deliveryInfo}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
                <a
                  href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gold text-primary font-black rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  پیام در واتساپ
                </a>
                <a
                  href={generatePhoneUrl()}
                  className="px-6 py-3 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground font-bold rounded-xl text-center hover:bg-primary-foreground/20 transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  تماس تلفنی
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom section-padding relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="space-y-5 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <Cookie className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{brandConfig.brandName}</h3>
                <span className="text-xs text-primary-foreground/60">{brandConfig.tagline}</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed text-sm">
              {brandConfig.slogan}
            </p>
            <div className="grid gap-3 text-sm text-primary-foreground/70">
              <div className="flex items-start gap-2">
                <ShieldCheck size={18} className="text-gold mt-1 flex-shrink-0" />
                <span>پخت تازه، مواد اولیه شفاف، وسواس در بهداشت.</span>
              </div>
              <div className="flex items-start gap-2">
                <Truck size={18} className="text-gold mt-1 flex-shrink-0" />
                <span>محصولات خشک سراسری؛ یخچالی فقط تهران و کرج.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={brandConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                aria-label="اینستاگرام"
              >
                <Instagram size={20} className="text-white" />
              </a>
              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-whatsapp rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                aria-label="واتساپ"
              >
                <MessageCircle size={20} className="text-white" />
              </a>
              <a
                href={`mailto:${brandConfig.email}`}
                className="w-11 h-11 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border border-primary-foreground/20"
                aria-label="ایمیل"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-8 h-1 bg-gold rounded-full" />
              دسترسی سریع
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="group flex items-center gap-2 text-primary-foreground/70 hover:text-gold transition-all text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/50 rounded-full group-hover:bg-gold group-hover:scale-150 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-8 h-1 bg-gold rounded-full" />
              دسته‌بندی محصولات
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="group flex items-center gap-2 text-primary-foreground/70 hover:text-gold transition-all text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/50 rounded-full group-hover:bg-gold group-hover:scale-150 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span className="w-8 h-1 bg-gold rounded-full" />
              مناطق ارسال
            </h4>
            <ul className="space-y-2.5 mb-6">
              {footerLinks.cities.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="group flex items-center gap-2 text-primary-foreground/70 hover:text-gold transition-all text-sm">
                    <span className="w-1.5 h-1.5 bg-gold/50 rounded-full group-hover:bg-gold group-hover:scale-150 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-3 pt-4 border-t border-primary-foreground/10">
              <a href={generatePhoneUrl()} className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold transition-colors">
                <Phone size={16} />
                {brandConfig.phone}
              </a>
              <div className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                {brandConfig.address}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 justify-center mb-6">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-xs text-primary-foreground/60 hover:text-gold transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-primary-foreground/60 text-sm flex items-center gap-2">
              © ۱۴۰۴ {brandConfig.brandName}. تمامی حقوق محفوظ است.
              <span className="hidden sm:flex items-center gap-1">
                | ساخته شده با <Heart size={14} className="text-red-400 fill-red-400" /> در ایران
              </span>
            </p>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-5 py-2.5 bg-primary-foreground/10 hover:bg-gold hover:text-primary rounded-xl transition-all duration-300 font-medium text-sm"
              aria-label="بازگشت به بالای صفحه"
            >
              بازگشت به بالا
              <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
