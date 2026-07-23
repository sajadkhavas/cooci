import {
  ArrowUp,
  ArrowUpLeft,
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
import { Link } from "react-router";
import {
  brandConfig,
  generatePhoneUrl,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { getProgrammaticScrollBehavior } from "@/lib/accessibility/motion";

const footerLinks = {
  quickLinks: [
    { name: "خانه", href: "/" },
    { name: "همه محصولات", href: "/products" },
    { name: "فروشگاه و دسته‌بندی‌ها", href: "/products" },
    { name: "درباره ما", href: "/about" },
    { name: "نظرهای تأییدشده", href: "/reviews" },
    { name: "راهنماها", href: "/blog" },
    { name: "تماس با ما", href: "/contact" },
  ],
  categories: [
    { name: "همه محصولات", href: "/products" },
    { name: "کوکی‌های خانگی", href: "/products/category/cookies" },
    { name: "مینی کوکی", href: "/products/category/mini-cookies" },
    { name: "رژیمی و بدون قند افزوده", href: "/products/category/diet-diabetic" },
    { name: "کیک و دسر", href: "/products/category/cakes" },
    { name: "چیزکیک", href: "/products/category/cheesecakes" },
    { name: "رول و کروسان", href: "/products/category/pastry" },
    { name: "باکس هدیه", href: "/products/category/gift-boxes" },
  ],
  services: [
    { name: "مناطق منتشرشده ارسال", href: "/locations" },
    { name: "سفارش سازمانی", href: "/corporate" },
    { name: "راهنمای هدیه", href: "/gift" },
  ],
  legal: [
    { name: "سیاست شفافیت", href: "/quality" },
    { name: "شرایط ارسال", href: "/shipping" },
    { name: "حریم خصوصی", href: "/privacy" },
    { name: "شرایط استفاده", href: "/terms" },
    { name: "سوالات متداول", href: "/faq" },
  ],
};

const currentYear = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
}).format(new Date());

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) => (
  <div>
    <h3 className="mb-5 text-xs font-black uppercase tracking-[0.14em] text-primary-foreground/45">
      {title}
    </h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={`${link.href}-${link.name}`}>
          <Link
            to={link.href}
            className="group inline-flex items-center gap-2 text-sm font-bold text-primary-foreground/72 transition duration-300 hover:translate-x-[-3px] hover:text-accent"
          >
            {link.name}
            <ArrowUpLeft
              size={13}
              className="opacity-0 transition group-hover:opacity-100"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer = () => {
  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: getProgrammaticScrollBehavior(),
    });

  return (
    <footer className="relative z-10 mt-12 overflow-hidden rounded-t-[3rem] bg-primary text-primary-foreground sm:mt-20 sm:rounded-t-[4.5rem]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute -right-32 top-8 h-96 w-96 rounded-full bg-accent/12 blur-[110px]" />
        <span className="absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-[130px]" />
        <div className="soft-grid absolute inset-0 opacity-10" />
      </div>

      <div className="container-custom relative pt-12 sm:pt-16">
        <div className="overflow-hidden rounded-[2.2rem] border border-white/12 bg-white/[0.065] p-6 shadow-2xl backdrop-blur-2xl sm:p-9 lg:p-12">
          <div className="grid items-end gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black text-accent">
                <Sparkles size={15} aria-hidden="true" />
                انتخاب بر اساس دسته و مناسبت
              </span>
              <h2 className="max-w-4xl text-3xl font-black leading-[1.12] sm:text-5xl lg:text-6xl">
                مسیر مناسب را پیدا کن،
                <span className="block text-accent">بعد جزئیات محصول را ببین.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-primary-foreground/62 sm:text-base">
                {brandConfig.deliveryInfo} اطلاعات نهایی هر محصول از کاتالوگ فعال
                دریافت می‌شود.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Link
                to="/products"
                className="group flex min-h-14 items-center justify-between rounded-2xl bg-accent px-5 py-4 font-black text-accent-foreground shadow-xl transition duration-300 hover:-translate-y-1"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag size={20} aria-hidden="true" />
                  فروشگاه و دسته‌بندی‌ها
                </span>
                <ArrowUpLeft
                  size={19}
                  className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                to="/cart"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-5 py-4 font-black text-white transition hover:bg-white/12"
              >
                <ShoppingCart size={19} aria-hidden="true" />
                مشاهده سبد خرید
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-12 py-16 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr] lg:gap-10 lg:py-20">
          <div className="max-w-xl">
            <Link to="/" className="inline-flex items-center gap-3 rounded-2xl">
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-xl">
                <Cookie size={25} aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-2xl font-black">
                  {brandConfig.brandName}
                </strong>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground/42">
                  {brandConfig.brandNameEn}
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-lg text-sm leading-8 text-primary-foreground/58">
              {brandConfig.slogan}. روش تحویل به نوع محصول، مقصد و تنظیمات فعال
              بک‌اند وابسته است.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-primary-foreground/62 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <span className="flex items-start gap-2">
                <ShieldCheck size={17} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                اطلاعات حساس فقط پس از تأیید
              </span>
              <span className="flex items-start gap-2">
                <Truck size={17} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                روش تحویل متناسب با محصول
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <a
                href={brandConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target flex items-center justify-center rounded-full border border-white/12 bg-white/8 transition hover:-translate-y-1 hover:bg-white/13"
                aria-label="اینستاگرام وینیمی"
              >
                <Instagram size={18} aria-hidden="true" />
              </a>
              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target flex items-center justify-center rounded-full border border-white/12 bg-white/8 transition hover:-translate-y-1 hover:bg-whatsapp"
                aria-label="پشتیبانی واتساپ"
              >
                <MessageCircle size={18} aria-hidden="true" />
              </a>
              <a
                href={`mailto:${brandConfig.email}`}
                className="touch-target flex items-center justify-center rounded-full border border-white/12 bg-white/8 transition hover:-translate-y-1 hover:bg-white/13"
                aria-label="ارسال ایمیل"
              >
                <Mail size={18} aria-hidden="true" />
              </a>
              <a
                href={generatePhoneUrl()}
                className="touch-target flex items-center justify-center rounded-full border border-white/12 bg-white/8 transition hover:-translate-y-1 hover:bg-white/13"
                aria-label="تماس تلفنی"
              >
                <Phone size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <FooterColumn title="کشف وینیمی" links={footerLinks.quickLinks} />
          <FooterColumn title="دسته‌بندی‌ها" links={footerLinks.categories} />
          <FooterColumn title="خدمات و مناطق" links={footerLinks.services} />
        </div>

        <div className="border-t border-white/10 py-7">
          <div className="mb-6 grid gap-3 rounded-2xl border border-white/8 bg-white/[0.045] p-4 text-xs leading-7 text-primary-foreground/55 sm:grid-cols-2 lg:grid-cols-4">
            <strong className="text-primary-foreground/75">{brandConfig.brandName}</strong>
            <span className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-accent" aria-hidden="true" />
              {brandConfig.address}
            </span>
            <a href={generatePhoneUrl()} dir="ltr" className="hover:text-accent">
              {brandConfig.phone}
            </a>
            <a href={`mailto:${brandConfig.email}`} dir="ltr" className="hover:text-accent">
              {brandConfig.email}
            </a>
          </div>

          <ul className="mb-6 flex flex-wrap gap-x-5 gap-y-3">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-xs font-bold text-primary-foreground/46 transition hover:text-accent"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="flex flex-wrap items-center gap-2 text-xs text-primary-foreground/45">
              © {currentYear} {brandConfig.brandName}. تمامی حقوق محفوظ است.
              <span className="inline-flex items-center gap-1">
                ساخته‌شده با
                <Heart size={13} className="fill-rose-300 text-rose-300" aria-hidden="true" />
                برای تجربه بهتر خرید آنلاین
              </span>
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/8 px-5 text-xs font-black transition hover:bg-accent hover:text-accent-foreground"
              aria-label="بازگشت به بالای صفحه"
            >
              بازگشت به بالا
              <ArrowUp
                size={16}
                className="transition-transform group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div className="whitespace-nowrap text-center text-[14vw] font-black leading-none tracking-[-0.09em] text-white/[0.035] sm:text-[12vw]">
          WINIMI BAKERY
        </div>
      </div>
    </footer>
  );
};
