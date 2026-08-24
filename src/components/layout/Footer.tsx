import {
  ArrowUp,
  ArrowUpLeft,
  Cookie,
  Headphones,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Link } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";
import { getProgrammaticScrollBehavior } from "@/lib/accessibility/motion";

const footerGroups = [
  {
    title: "کشف وینیمی",
    links: [
      { name: "خانه", href: "/" },
      { name: "همه محصولات", href: "/products" },
      { name: "درباره ما", href: "/about" },
      { name: "راهنماها", href: "/blog" },
      { name: "تماس با ما", href: "/contact" },
    ],
  },
  {
    title: "دسته‌بندی‌ها",
    links: [
      { name: "کوکی‌های خانگی", href: "/products/category/cookies" },
      { name: "مینی کوکی", href: "/products/category/mini-cookies" },
      { name: "رژیمی و بدون قند افزوده", href: "/products/category/diet-diabetic" },
      { name: "کیک و دسر", href: "/products/category/cakes" },
      { name: "چیزکیک", href: "/products/category/cheesecakes" },
      { name: "رول و کروسان", href: "/products/category/pastry" },
      { name: "باکس هدیه", href: "/products/category/gift-boxes" },
    ],
  },
  {
    title: "خدمات و راهنما",
    links: [
      { name: "مناطق ارسال", href: "/locations" },
      { name: "سفارش سازمانی", href: "/corporate" },
      { name: "راهنمای هدیه", href: "/gift" },
      { name: "شرایط ارسال", href: "/shipping" },
      { name: "سؤالات متداول", href: "/faq" },
    ],
  },
] as const;

const legalLinks = [
  { name: "سیاست شفافیت", href: "/quality" },
  { name: "شرایط ارسال", href: "/shipping" },
  { name: "حریم خصوصی", href: "/privacy" },
  { name: "شرایط استفاده", href: "/terms" },
  { name: "سؤالات متداول", href: "/faq" },
] as const;

const currentYear = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
}).format(new Date());

const FooterLinkList = ({
  links,
}: {
  links: ReadonlyArray<{ name: string; href: string }>;
}) => (
  <ul className="space-y-3">
    {links.map((link) => (
      <li key={`${link.href}-${link.name}`}>
        <Link
          to={link.href}
          className="group inline-flex min-h-9 items-center gap-2 text-sm font-bold text-[#f7e4dc]/75 transition hover:text-white"
        >
          {link.name}
          <ArrowUpLeft
            size={13}
            className="opacity-0 transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
            aria-hidden="true"
          />
        </Link>
      </li>
    ))}
  </ul>
);

export const Footer = () => {
  const { settings } = useStorefrontSettings();
  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: getProgrammaticScrollBehavior(),
    });

  return (
    <footer className="site-footer relative z-10 overflow-hidden bg-[#563128] text-[#fffaf6]">
      <div className="border-b border-[#f7e4dc]/15 bg-[#f7e4dc] text-[#46271f]">
        <div className="container-custom grid gap-5 py-7 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#d88972] text-[#321d17]">
              <Headphones size={21} aria-hidden="true" />
            </span>
            <div>
              <strong className="block text-lg font-black">برای انتخاب بهتر، کنار شما هستیم</strong>
              <p className="mt-1 text-sm leading-7 text-[#6f3e33]">
                درباره محصول، تعداد مناسب یا شرایط سفارش سؤال داری؟ با پشتیبانی وینیمی در تماس باش.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={settings.contact.phoneUrl}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d88972]/45 bg-white/70 px-5 text-sm font-black transition hover:bg-white"
            >
              <Phone size={17} aria-hidden="true" />
              تماس با وینیمی
            </a>
            <a
              href={settings.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#6f3e33] px-5 text-sm font-black text-white transition hover:bg-[#46271f]"
            >
              <MessageCircle size={17} aria-hidden="true" />
              واتساپ
            </a>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="grid border-b border-[#f7e4dc]/15 py-12 lg:grid-cols-[1.25fr_2fr] lg:py-16">
          <div className="border-b border-[#f7e4dc]/15 pb-10 lg:border-b-0 lg:border-l lg:pb-0 lg:pl-12">
            <Link to="/" className="inline-flex items-center gap-3 rounded-2xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d0e596] text-[#27390c]">
                <Cookie size={26} aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-2xl font-black">{settings.brand.name}</strong>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#f7e4dc]/55">
                  {settings.brand.nameEn}
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-lg text-sm leading-8 text-[#f7e4dc]/70">
              وینیمی برای انتخاب آنلاین کوکی، کیک، دسر و باکس هدیه ساخته شده است؛
              محصول مناسب را پیدا کن، جزئیاتش را ببین و مسیر سفارش را ادامه بده.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <a href={settings.contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="touch-target flex items-center justify-center rounded-full border border-[#f7e4dc]/20 transition hover:border-[#d88972] hover:bg-[#d88972] hover:text-[#321d17]" aria-label="اینستاگرام وینیمی">
                <Instagram size={18} aria-hidden="true" />
              </a>
              <a href={settings.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="touch-target flex items-center justify-center rounded-full border border-[#f7e4dc]/20 transition hover:border-[#d88972] hover:bg-[#d88972] hover:text-[#321d17]" aria-label="واتساپ وینیمی">
                <MessageCircle size={18} aria-hidden="true" />
              </a>
              <a href={`mailto:${settings.contact.email}`} className="touch-target flex items-center justify-center rounded-full border border-[#f7e4dc]/20 transition hover:border-[#d88972] hover:bg-[#d88972] hover:text-[#321d17]" aria-label="ایمیل وینیمی">
                <Mail size={18} aria-hidden="true" />
              </a>
              <a href={settings.contact.phoneUrl} className="touch-target flex items-center justify-center rounded-full border border-[#f7e4dc]/20 transition hover:border-[#d88972] hover:bg-[#d88972] hover:text-[#321d17]" aria-label="تماس با وینیمی">
                <Phone size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="hidden grid-cols-3 divide-x divide-x-reverse divide-[#f7e4dc]/15 lg:grid">
            {footerGroups.map((group) => (
              <div key={group.title} className="px-8 first:pr-12 last:pl-0">
                <h3 className="mb-5 text-xs font-black tracking-[0.12em] text-[#d88972]">
                  {group.title}
                </h3>
                <FooterLinkList links={group.links} />
              </div>
            ))}
          </div>

          <Accordion type="single" collapsible className="pt-5 lg:hidden">
            {footerGroups.map((group) => (
              <AccordionItem key={group.title} value={group.title} className="border-[#f7e4dc]/15">
                <AccordionTrigger className="min-h-14 py-3 text-base font-black text-[#fffaf6] hover:no-underline">
                  {group.title}
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <FooterLinkList links={group.links} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="grid gap-3 border-b border-[#f7e4dc]/15 py-6 text-xs leading-7 text-[#f7e4dc]/65 sm:grid-cols-2 lg:grid-cols-4">
          <strong className="text-[#fffaf6]">{settings.brand.name}</strong>
          <span className="flex items-center gap-2">
            <MapPin size={15} className="shrink-0 text-[#d88972]" aria-hidden="true" />
            اندیشه، استان تهران
          </span>
          <a href={settings.contact.phoneUrl} dir="ltr" className="transition hover:text-white">
            09212508746
          </a>
          <a href={`mailto:${settings.contact.email}`} dir="ltr" className="transition hover:text-white">
            hello@winimibakery.com
          </a>
        </div>

        <div className="flex flex-col gap-6 border-b border-[#f7e4dc]/15 py-7 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-3">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-xs font-bold text-[#f7e4dc]/65 transition hover:text-white">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <button type="button" onClick={scrollToTop} className="group inline-flex min-h-11 self-start items-center gap-2 rounded-full border border-[#f7e4dc]/20 px-5 text-xs font-black transition hover:border-[#d88972] hover:bg-[#d88972] hover:text-[#321d17]" aria-label="بازگشت به بالای صفحه">
            بازگشت به بالا
            <ArrowUp size={16} className="transition-transform group-hover:-translate-y-1" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-3 py-6 text-xs text-[#f7e4dc]/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {settings.brand.name}. تمامی حقوق محفوظ است.</p>
          <p>طراحی و توسعه توسط <span className="font-black text-[#f7e4dc]">SHINETHREE</span></p>
        </div>

        <div className="whitespace-nowrap pb-2 text-center text-[14vw] font-black leading-[0.78] tracking-[-0.09em] text-[#f7e4dc]/[0.045] sm:text-[12vw]">
          WINIMI BAKERY
        </div>
      </div>
    </footer>
  );
};
