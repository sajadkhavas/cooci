import {
  ArrowUp,
  Cookie,
  Heart,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  brandConfig,
  generatePhoneUrl,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";

const footerLinks = {
  quickLinks: [
    { name: "خانه", href: "/" },
    { name: "همه محصولات", href: "/products" },
    { name: "درباره ما", href: "/about" },
    { name: "نظرهای تأییدشده", href: "/reviews" },
    { name: "بلاگ", href: "/blog" },
    { name: "تماس با ما", href: "/contact" },
  ],
  categories: [
    { name: "کوکی‌های خانگی", href: "/products/category/cookies" },
    { name: "مینی کوکی", href: "/products/category/mini-cookies" },
    { name: "رژیمی و بدون قند", href: "/products/category/diet" },
    { name: "کیک تازه", href: "/products/category/cakes" },
    { name: "کیک و دسر", href: "/products/category/cakes" },
    { name: "باکس هدیه", href: "/products/category/gift" },
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

const currentYear = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date());

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-primary via-cocoa to-primary text-primary-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-10 top-10 h-60 w-60 rounded-full bg-gold/10 blur-[100px]" />
        <div className="absolute bottom-20 left-20 h-80 w-80 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div
        className="absolute left-0 right-0 top-0 h-20 bg-background"
        style={{ clipPath: "ellipse(60% 100% at 50% 0%)" }}
      />

      <div className="relative pb-10 pt-32">
        <div className="container-custom">
          <div className="rounded-3xl border border-primary-foreground/20 bg-gradient-to-l from-gold/20 via-primary-foreground/10 to-gold/20 p-8 shadow-2xl backdrop-blur-sm md:p-10">
            <div className="grid items-center gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-2">
                  <Sparkles size={16} className="text-gold" aria-hidden="true" />
                  <span className="text-sm font-semibold">مسیر سفارش مرحله‌به‌مرحله</span>
                </div>
                <h2 className="text-xl font-bold md:text-2xl">
                  محصول را انتخاب کنید و موارد نیازمند تأیید را پیش از پرداخت ببینید
                </h2>
                <p className="text-sm leading-8 text-primary-foreground/70">
                  {brandConfig.deliveryInfo}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-center font-black text-primary shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <ShoppingBag size={18} aria-hidden="true" />
                  مشاهده محصولات
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center justify-center gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-6 py-3 text-center font-bold text-primary-foreground transition-all hover:bg-primary-foreground/20"
                >
                  <ShoppingCart size={18} aria-hidden="true" />
                  سبد خرید
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom section-padding relative z-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="space-y-5 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-amber-600 shadow-lg">
                <Cookie className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{brandConfig.brandName}</h3>
                <span className="text-xs text-primary-foreground/60">{brandConfig.tagline}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/70">{brandConfig.slogan}</p>
            <div className="grid gap-3 text-sm text-primary-foreground/70">
              <div className="flex items-start gap-2">
                <ShieldCheck size={18} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
                <span>قیمت فعلی کاتالوگ و وضعیت تأیید اطلاعات به‌صورت جداگانه نمایش داده می‌شوند.</span>
              </div>
              <div className="flex items-start gap-2">
                <Truck size={18} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
                <span>روش تحویل به نوع محصول، مقصد و تنظیمات فعال بک‌اند وابسته است.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={brandConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-lg transition-all hover:scale-110"
                aria-label="اینستاگرام"
              >
                <Instagram size={20} className="text-white" aria-hidden="true" />
              </a>
              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-whatsapp shadow-lg transition-all hover:scale-110"
                aria-label="پشتیبانی واتساپ"
              >
                <MessageCircle size={20} className="text-white" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${brandConfig.email}`}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 shadow-lg transition-all hover:scale-110 hover:bg-primary-foreground/20"
                aria-label="ایمیل"
              >
                <Mail size={20} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold">
              <span className="h-1 w-8 rounded-full bg-gold" />
              دسترسی سریع
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 text-sm text-primary-foreground/70 transition-all hover:text-gold"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold/50 transition-all group-hover:scale-150 group-hover:bg-gold" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold">
              <span className="h-1 w-8 rounded-full bg-gold" />
              دسته‌بندی محصولات
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 text-sm text-primary-foreground/70 transition-all hover:text-gold"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold/50 transition-all group-hover:scale-150 group-hover:bg-gold" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold">
              <span className="h-1 w-8 rounded-full bg-gold" />
              مناطق ارسال
            </h3>
            <ul className="mb-6 space-y-2.5">
              {footerLinks.cities.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 text-sm text-primary-foreground/70 transition-all hover:text-gold"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold/50 transition-all group-hover:scale-150 group-hover:bg-gold" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-primary-foreground/10 pt-4">
              <a
                href={generatePhoneUrl()}
                className="flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-gold"
              >
                <Phone size={16} aria-hidden="true" />
                {brandConfig.phone}
              </a>
              <div className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                {brandConfig.address}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-6">
          <ul className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-xs text-primary-foreground/60 transition-colors hover:text-gold"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="flex items-center gap-2 text-sm text-primary-foreground/60">
              © {currentYear} {brandConfig.brandName}. تمامی حقوق محفوظ است.
              <span className="hidden items-center gap-1 sm:flex">
                | ساخته شده با <Heart size={14} className="fill-red-400 text-red-400" aria-hidden="true" /> در ایران
              </span>
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex items-center gap-2 rounded-xl bg-primary-foreground/10 px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-gold hover:text-primary"
              aria-label="بازگشت به بالای صفحه"
            >
              بازگشت به بالا
              <ArrowUp size={18} className="transition-transform group-hover:-translate-y-1" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
