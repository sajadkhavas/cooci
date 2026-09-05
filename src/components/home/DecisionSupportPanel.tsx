import {
  ArrowUpLeft,
  CircleHelp,
  Gift,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router";
import { Reveal } from "@/components/motion/Reveal";

export const homeDecisionFaqs = [
  {
    question: "از کجا محصول مناسب را پیدا کنم؟",
    answer:
      "اگر نوع محصول را می‌دانی، از دسته‌بندی‌ها شروع کن. برای هدیه یا پذیرایی هم مسیرهای پیشنهادی، گزینه‌های مرتبط را کوتاه‌تر و روشن‌تر نشان می‌دهند.",
  },
  {
    question: "قیمت و موجودی هر محصول کجا نمایش داده می‌شود؟",
    answer:
      "قیمت، وضعیت موجودی و انتخاب‌های قابل سفارش در کارت و صفحه همان محصول نمایش داده می‌شوند و اطلاعات نهایی پیش از ثبت سفارش دوباره قابل بررسی است.",
  },
  {
    question: "روش تحویل چه زمانی مشخص می‌شود؟",
    answer:
      "روش‌های قابل انتخاب با توجه به مقصد و شرایط نگهداری محصول در مسیر سفارش نمایش داده می‌شوند؛ محصولات نیازمند سرمایش نیز نشان مشخص دارند.",
  },
  {
    question: "پیش از پرداخت چه اطلاعاتی می‌بینم؟",
    answer:
      "محصولات سبد، تعداد، مقصد، روش تحویل و مبلغ نهایی پیش از ورود به درگاه نمایش داده می‌شوند تا بتوانی سفارش را یک‌بار کامل بررسی کنی.",
  },
] as const;

export const homeDecisionFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeDecisionFaqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const quickPaths = [
  {
    icon: ShoppingBag,
    eyebrow: "شروع از نوع محصول",
    title: "دسته‌بندی‌های فروشگاه",
    description: "محصولات مشابه را کنار هم ببین و سریع‌تر مقایسه کن.",
    href: "/products",
    action: "مشاهده دسته‌ها",
  },
  {
    icon: Gift,
    eyebrow: "شروع از مناسبت",
    title: "راهنمای انتخاب هدیه",
    description: "برای مناسبت، تعداد و سلیقه گیرنده مسیر مناسب‌تری پیدا کن.",
    href: "/gift",
    action: "رفتن به راهنما",
  },
  {
    icon: PackageSearch,
    eyebrow: "پیش از سفارش",
    title: "راهنماهای کوتاه وینیمی",
    description: "درباره تعداد، نگهداری و انتخاب بهتر بیشتر بدان.",
    href: "/blog",
    action: "خواندن راهنماها",
  },
] as const;

export const DecisionSupportPanel = () => (
  <section
    className="home-color-wash section-padding overflow-hidden"
    aria-labelledby="home-decision-support-title"
  >
    <div className="container-custom">
      <Reveal className="winimi-decision-panel">
        <div className="winimi-decision-panel__intro">
          <span className="editorial-label mb-5">
            <CircleHelp size={15} aria-hidden="true" />
            کمک برای یک انتخاب روشن
          </span>
          <h2
            id="home-decision-support-title"
            className="modern-section-title max-w-3xl"
          >
            از نیازت شروع کن؛ مسیر مناسب را کوتاه‌تر برو
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-muted-foreground">
            اگر هنوز بین چند انتخاب مرددی، از یکی از مسیرهای زیر شروع کن. هر مسیر
            فقط اطلاعات مرتبط با همان تصمیم را جلو دستت می‌گذارد.
          </p>

          <nav
            className="mt-8 grid gap-3 sm:grid-cols-3"
            aria-label="مسیرهای سریع انتخاب محصول"
          >
            {quickPaths.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group flex min-h-[12rem] flex-col rounded-[1.65rem] border border-border/75 bg-white/65 p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-[#d88972]/55 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b96552]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7e4dc] text-[#9b5545]">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="mt-5 text-[11px] font-black text-[#9b5545]">
                    {item.eyebrow}
                  </span>
                  <strong className="mt-2 text-lg font-black leading-7 text-foreground">
                    {item.title}
                  </strong>
                  <span className="mt-2 text-xs leading-6 text-muted-foreground">
                    {item.description}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-black text-[#6f3e33]">
                    {item.action}
                    <ArrowUpLeft
                      size={15}
                      className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="winimi-decision-panel__faq">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-[#9b5545]">
                پرسش‌های پرتکرار
              </span>
              <h3 className="mt-2 text-2xl font-black text-foreground">
                قبل از سفارش
              </h3>
            </div>
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d0e596] text-[#27390c]"
              aria-hidden="true"
            >
              <CircleHelp size={22} />
            </span>
          </div>

          <div className="divide-y divide-border/70 border-y border-border/70">
            {homeDecisionFaqs.map((item, index) => (
              <details key={item.question} className="group py-1">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-black text-foreground marker:content-none">
                  <span>{item.question}</span>
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white/70 text-[#9b5545] transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 pl-3 text-sm leading-8 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
