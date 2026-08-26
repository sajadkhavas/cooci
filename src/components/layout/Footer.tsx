import { ArrowUpLeft, Cookie, Headphones, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";

const footerGroups = [
  { title: "کشف وینیمی", links: [
    { name: "خانه", href: "/" }, { name: "همه محصولات", href: "/products" },
    { name: "درباره ما", href: "/about" }, { name: "راهنماها", href: "/blog" },
    { name: "تماس با ما", href: "/contact" },
  ] },
  { title: "دسته‌بندی‌ها", links: [
    { name: "کوکی‌های خانگی", href: "/products/category/cookies" },
    { name: "مینی کوکی", href: "/products/category/mini-cookies" },
    { name: "رژیمی و بدون قند افزوده", href: "/products/category/diet-diabetic" },
    { name: "کیک و دسر", href: "/products/category/cakes" },
    { name: "چیزکیک", href: "/products/category/cheesecakes" },
    { name: "رول و کروسان", href: "/products/category/pastry" },
    { name: "باکس هدیه", href: "/products/category/gift-boxes" },
  ] },
  { title: "خدمات و راهنما", links: [
    { name: "مناطق ارسال", href: "/locations" }, { name: "سفارش سازمانی", href: "/corporate" },
    { name: "راهنمای هدیه", href: "/gift" }, { name: "شرایط ارسال", href: "/shipping" },
    { name: "سؤالات متداول", href: "/faq" },
  ] },
] as const;

const legalLinks = [
  { name: "سیاست شفافیت", href: "/quality" }, { name: "شرایط ارسال", href: "/shipping" },
  { name: "حریم خصوصی", href: "/privacy" }, { name: "شرایط استفاده", href: "/terms" },
] as const;

const currentYear = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date());

const FooterLinkList = ({ links }: { links: ReadonlyArray<{ name: string; href: string }> }) => (
  <ul className="space-y-2.5">
    {links.map((link) => (
      <li key={`${link.href}-${link.name}`}>
        <Link to={link.href} className="group inline-flex min-h-9 items-center gap-2 text-sm font-bold text-[#27390c]/65 transition hover:text-[#27390c]">
          {link.name}
          <ArrowUpLeft size={13} className="opacity-0 transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
        </Link>
      </li>
    ))}
  </ul>
);

export const Footer = () => {
  const { settings } = useStorefrontSettings();
  const socialLinks = [
    { href: settings.contact.instagramUrl, label: "اینستاگرام وینیمی", Icon: Instagram },
    { href: settings.contact.whatsappUrl, label: "واتساپ وینیمی", Icon: MessageCircle },
    { href: `mailto:${settings.contact.email}`, label: "ایمیل وینیمی", Icon: Mail },
    { href: settings.contact.phoneUrl, label: "تماس با وینیمی", Icon: Phone },
  ];

  return (
    <footer className="site-footer relative z-10 overflow-hidden border-t border-[#27390c]/12 bg-[#d0e596] text-[#27390c]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute -right-32 top-12 h-80 w-80 rounded-full bg-white/35 blur-[90px]" />
        <span className="absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-[#f3c9b9]/35 blur-[90px]" />
        <span className="soft-grid absolute inset-0 opacity-[0.12]" />
      </div>

      <div className="container-custom relative py-5 sm:py-7">
        <div className="grid gap-5 rounded-[2rem] border border-[#27390c]/12 bg-white/45 p-5 shadow-soft backdrop-blur-xl sm:p-7 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3c9b9] text-[#6f3e33] shadow-soft">
              <Headphones size={22} aria-hidden="true" />
            </span>
            <div>
              <strong className="block text-lg font-black sm:text-xl">برای انتخاب بهتر، کنار شما هستیم</strong>
              <p className="mt-1 max-w-2xl text-sm leading-7 text-[#27390c]/65">درباره محصول، تعداد مناسب یا شرایط سفارش سؤال داری؟ مستقیم با وینیمی صحبت کن.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={settings.contact.phoneUrl} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#27390c]/15 bg-white/55 px-5 text-sm font-black transition hover:bg-white">
              <Phone size={17} aria-hidden="true" /> تماس
            </a>
            <a href={settings.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#27390c] px-5 text-sm font-black text-[#f8f4e8] transition hover:-translate-y-0.5 hover:bg-[#405d16]">
              <MessageCircle size={17} aria-hidden="true" /> واتساپ
            </a>
          </div>
        </div>

        <div className="grid border-b border-[#27390c]/12 py-10 lg:grid-cols-[1.05fr_1.95fr] lg:py-14">
          <div className="border-b border-[#27390c]/12 pb-9 lg:border-b-0 lg:border-l lg:pb-0 lg:pl-10">
            <Link to="/" className="inline-flex items-center gap-3 rounded-2xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#27390c] text-[#d0e596] shadow-soft"><Cookie size={26} aria-hidden="true" /></span>
              <span><strong className="block text-2xl font-black">{settings.brand.name}</strong><span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#27390c]/45">{settings.brand.nameEn}</span></span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-8 text-[#27390c]/65">کوکی، کیک، دسر و باکس هدیه؛ با جزئیاتی که پیش از سفارش می‌بینی.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map(({ href, label, Icon }) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="touch-target flex items-center justify-center rounded-full border border-[#27390c]/15 bg-white/35 transition hover:-translate-y-0.5 hover:bg-white/70" aria-label={label}>
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="hidden grid-cols-3 divide-x divide-x-reverse divide-[#27390c]/12 lg:grid">
            {footerGroups.map((group) => (
              <div key={group.title} className="px-7 first:pr-10 last:pl-0">
                <h3 className="mb-5 text-xs font-black tracking-[0.08em] text-[#6f3e33]">{group.title}</h3>
                <FooterLinkList links={group.links} />
              </div>
            ))}
          </div>

          <Accordion type="single" collapsible className="pt-4 lg:hidden">
            {footerGroups.map((group) => (
              <AccordionItem key={group.title} value={group.title} className="border-[#27390c]/12">
                <AccordionTrigger className="min-h-14 py-3 text-base font-black text-[#27390c] hover:no-underline">{group.title}</AccordionTrigger>
                <AccordionContent className="pb-5"><FooterLinkList links={group.links} /></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="grid gap-3 border-b border-[#27390c]/12 py-5 text-xs leading-7 text-[#27390c]/60 sm:grid-cols-2 lg:grid-cols-4">
          <strong className="text-[#27390c]">{settings.brand.name}</strong>
          <span className="flex items-center gap-2"><MapPin size={15} className="shrink-0 text-[#6f3e33]" aria-hidden="true" />اندیشه، استان تهران</span>
          <a href={settings.contact.phoneUrl} dir="ltr" className="transition hover:text-[#27390c]">{settings.contact.phone}</a>
          <a href={`mailto:${settings.contact.email}`} dir="ltr" className="transition hover:text-[#27390c]">{settings.contact.email}</a>
        </div>

        <div className="flex flex-col gap-4 py-5 text-xs text-[#27390c]/55 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-3">
            {legalLinks.map((link) => <li key={link.href}><Link to={link.href} className="font-bold transition hover:text-[#27390c]">{link.name}</Link></li>)}
          </ul>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <p>© {currentYear} {settings.brand.name}. تمامی حقوق محفوظ است.</p>
            <p>طراحی و توسعه توسط <span className="font-black text-[#27390c]">SHINETHREE</span></p>
          </div>
        </div>
        <div className="select-none overflow-hidden text-center text-[clamp(2.6rem,9vw,8rem)] font-black leading-[0.72] tracking-[-0.075em] text-[#27390c]/[0.055]" aria-hidden="true">
          WINIMI BAKERY
        </div>
      </div>
    </footer>
  );
};
