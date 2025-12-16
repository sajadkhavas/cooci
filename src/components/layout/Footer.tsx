import { Link } from "react-router-dom";
import { Instagram, Phone, MapPin, Clock, Mail, Heart, Cookie, ArrowUp, Sparkles } from "lucide-react";
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
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-primary via-cocoa to-primary text-primary-foreground overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-60 h-60 bg-gold/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-rose/10 rounded-full blur-[80px]" />
      </div>

      {/* Top Wave */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-background" style={{
        clipPath: 'ellipse(60% 100% at 50% 0%)'
      }} />

      {/* Newsletter Section */}
      <div className="relative pt-32 pb-16">
        <div className="container-custom">
          <div className="bg-gradient-to-l from-gold/20 via-primary-foreground/10 to-gold/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-primary-foreground/20 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full">
                  <Sparkles size={16} className="text-gold" />
                  <span className="text-sm font-semibold">عضویت در خبرنامه</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">از تخفیف‌ها و محصولات جدید باخبر شوید</h3>
                <p className="text-primary-foreground/70">با عضویت در خبرنامه، اولین نفری باشید که از پیشنهادات ویژه مطلع می‌شوید</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="ایمیل خود را وارد کنید..."
                  className="flex-1 px-6 py-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                />
                <button className="px-8 py-4 bg-gold hover:bg-gold/90 text-primary font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap">
                  عضویت
                </button>
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
                <span className="text-xs text-primary-foreground/60">کوکی دست‌ساز</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed">
              {brandConfig.tagline}
              <br />
              {brandConfig.slogan}
            </p>
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
                href={generateWhatsAppUrl("سلام")}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                aria-label="واتساپ"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a
                href="mailto:info@cookiebakery.ir"
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
                  <Clock size={18} />
                </div>
                <div>
                  <span className="text-sm text-primary-foreground/50 block">ساعت کاری</span>
                  <div className="text-primary-foreground/80 text-sm">
                    <div>شنبه تا پنج‌شنبه: {brandConfig.workingHours.weekdays}</div>
                    <div>جمعه: {brandConfig.workingHours.weekends}</div>
                  </div>
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
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-primary-foreground/60 hover:text-gold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 left-6 z-40 w-12 h-12 bg-gold hover:bg-gold/90 text-primary rounded-xl shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="برگشت به بالا"
      >
        <ArrowUp size={22} />
      </button>
    </footer>
  );
};