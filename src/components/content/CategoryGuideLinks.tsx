import { ArrowUpLeft, BookOpen } from "lucide-react";
import { Link } from "react-router";

const CATEGORY_GUIDES = {
  cookies: [
    {
      href: "/blog/cookie-storage-guide",
      title: "راهنمای نگهداری و ماندگاری کوکی",
      description: "قبل و بعد از سفارش، اطلاعات نگهداری تأییدشده همان محصول را درست بخوانید.",
    },
    {
      href: "/blog/cookies-per-guest-guide",
      title: "برای پذیرایی چند کوکی در نظر بگیریم؟",
      description: "تعداد مهمان، اندازه محصول و نقش کوکی در میز را برای انتخاب بهتر کنار هم بگذارید.",
    },
  ],
  "mini-cookies": [
    {
      href: "/blog/cookies-per-guest-guide",
      title: "راهنمای تعداد کوکی برای پذیرایی",
      description: "برای سفارش چندنفره به‌جای عدد ثابت، تعداد مهمان و اندازه محصول فعال را مبنا قرار دهید.",
    },
  ],
  cakes: [
    {
      href: "/blog/cheesecake-cold-storage",
      title: "راهنمای نگهداری چیزکیک و محصولات یخچالی",
      description: "برای انتخاب‌های نیازمند سرمایش، دستور نگهداری تأییدشده محصول را پیش از سفارش بررسی کنید.",
    },
  ],
} as const;

type CategoryGuideSlug = keyof typeof CATEGORY_GUIDES;

const isCategoryGuideSlug = (slug: string): slug is CategoryGuideSlug =>
  Object.prototype.hasOwnProperty.call(CATEGORY_GUIDES, slug);

export const CategoryGuideLinks = ({ slug }: { slug?: string }) => {
  if (!slug || !isCategoryGuideSlug(slug)) return null;

  const guides = CATEGORY_GUIDES[slug];

  return (
    <aside className="border-t border-border bg-secondary/20 section-padding" aria-labelledby="category-guide-links-title">
      <div className="container-custom">
        <div className="mb-8 max-w-3xl">
          <span className="editorial-label mb-4">راهنمای مرتبط</span>
          <h2 id="category-guide-links-title" className="heading-2">
            قبل از انتخاب، این راهنماها را ببین
          </h2>
          <p className="mt-3 leading-8 text-muted-foreground">
            لینک‌ها بر اساس موضوع همین دسته انتخاب شده‌اند و جایگزین اطلاعات قیمت، موجودی، ترکیبات یا شرایط نگهداری تأییدشده هر محصول نیستند.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              to={guide.href}
              className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/30"
            >
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen size={20} aria-hidden="true" />
              </span>
              <h3 className="text-lg font-black leading-8 text-foreground">{guide.title}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{guide.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                خواندن راهنما
                <ArrowUpLeft size={17} className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};
