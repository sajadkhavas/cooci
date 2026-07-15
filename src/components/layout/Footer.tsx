import { Link } from "react-router-dom";
import { ArrowUp, Cookie, CreditCard, Heart, Instagram, Mail, MapPin, Phone, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { brandConfig, generatePhoneUrl } from "@/config/brand";

const footerLinks = {
  quickLinks: [
    { name: "محصولات", href: "/products" },
    { name: "سبد خرید", href: "/cart" },
    { name: "تکمیل سفارش", href: "/checkout" },
    { name: "درباره ما", href: "/about" },
    { name: "تماس با ما", href: "/contact" },
  ],
  categories: [
    { name: "کوکی‌ها", href: "/products?category=cookies" },
    { name: "مینی کوکی", href: "/products?category=mini-cookies" },
    { name: "کیک و دسر", href: "/products?category=cakes" },
    { name: "رژیمی و بدون قند", href: "/products?category=diet" },
    { name: "باکس هدیه", href: "/products?category=gift" },
  ],
  legal: [
    { name: "حریم خصوصی", href: "/privacy" },
    { name: "شرایط استفاده", href: "/terms" },
    { name: "شرایط ارسال", href: "/shipping" },
    { name: "سوالات متداول", href: "/faq" },
  ],
};

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-primary via-cocoa to-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-60 h-60 bg-gold/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-rose/10 rounded-full blur-[80px]" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-20 bg-background" style={{ clipPath: "ellipse(60% 100% at 50% 0%)" }} />

      {/* Checkout Info Banner */}
      <div className="relative pt-32 pb-10">
        <div className="container-custom">
          <div className="bg-gradient-to-l from-gold/20 via-primary-foreground/10 to-gold/20 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-primary-foreground/20 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full">
                  <Sparkles size={16} className="text-gold" />
                  <span className="text-sm font-semibold">ثبت سفارش آنلاین</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold">سبد خرید و پرداخت آنلاین آماده اتصال به درگاه</h3>
                <p className="text-primary-foreground/70 leading-8 text-sm">
                  {brandConfig.deliveryInfo} بعد از اتصال درگاه، سفارش‌ها از همین مسیر به پرداخت بانکی منتقل می‌شوند.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
                <Link
                  to="/cart"
                  className="px-6 py-3 bg-gold text-primary font-black rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-center flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  مشاهده سبد خرید
                </Link>
                <Link
                  to="/shipping"
                  className="px-6 py-3 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground font-bold rounded-xl text-center hover:bg-primary-foreground/20 transition-all"
                >
                  شرایط ارسال
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom section-padding relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <Cookie className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{brandConfig.brandName}</h3>
                <span className="text-xs text-primary-foreground/60">کیک و کوکی مثل خانه</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed">
              {brandConfig.tagline}
              <br />
              {brandConfig.slogan}
            </p>
            <div className="grid gap-3 text-sm text-primary-foreground/70">
              <div className="flex items-start gap-2">
                <ShieldCheck size={18} className="text-gold mt-1" />
                <span>پرداخت آنلاین بعد از اتصال درگاه فعال می‌شود.</span>
              </div>
              <div className="flex items-start gap-2">
                <Truck size={18} className="text-gold mt-1" />
                <span>محصولات خشک سراسری؛ یخچالی فقط تهران و کرج.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={brandConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                aria-label="اینستاگرام"
              >
                <Instagram size={22} className="text-white" />
              </a>
              <a
                href={`mailto:${brandConfig.email}`}
                className="group w-12 h-12 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 border border-primary-foreground/20"
                aria-label="ایمیل"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gold rounded-full" />
              دسترسی سریع
            </h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 text-primary-foreground/70 hover:text-gold transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 bg-gold/50 rounded-full group-hover:bg-gold group-hover:scale-150 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gold rounded-full" />
              دسته‌بندی‌ها
            </h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 text-primary-foreground/70 hover:text-gold transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 bg-gold/50 rounded-full group-hover:bg-gold group-hover:scale-150 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-bold text-lg mt-8 mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-gold rounded-full" />
              قوانین
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 text-primary-foreground/70 hover:text-gold transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 bg-gold/50 rounded-full group-hover:bg-gold group-hover:scale-150 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gold rounded-full" />
              تماس با ما
            </h4>
            <ul className="space-y-4">
              <li>
                <a href={generatePhoneUrl()} className="group flex items-start gap-3 hover:text-gold transition-colors">
                  <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-sm text-primary-foreground/50 block">تماس تلفنی</span>
                    <span className="font-medium">{brandConfig.phone}</span>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-sm text-primary-foreground/50 block">آدرس</span>
                  <span className="text-primary-foreground/80">{brandConfig.address}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-sm text-primary-foreground/50 block">ایمیل</span>
                  <span className="text-primary-foreground/80">{brandConfig.email}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-primary-foreground/60 text-sm flex items-center gap-2">
              © ۱۴۰۳ {brandConfig.brandName}. تمامی حقوق محفوظ است.
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:flex items-center gap-1">
                ساخته شده با <Heart size={14} className="text-red-400 fill-red-400" /> در ایران
              </span>
            </p>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-5 py-2.5 bg-primary-foreground/10 hover:bg-gold hover:text-primary rounded-xl transition-all duration-300 font-medium"
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