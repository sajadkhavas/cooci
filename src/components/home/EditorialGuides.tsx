import { ArrowUpLeft, BookOpen, Snowflake, Users } from "lucide-react";
import { Link } from "react-router";
import { Reveal } from "@/components/motion/Reveal";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";
import lifestyleMilk from "@/assets/cookies/lifestyle-milk.jpg";
import lifestyleTwine from "@/assets/cookies/lifestyle-twine.jpg";

const guides = [
  {
    title: "چطور برای هدیه انتخاب کنیم؟",
    description: "مناسبت، تعداد گیرنده‌ها و نوع بسته‌بندی؛ سه سرنخ برای یک انتخاب شخصی‌تر.",
    image: lifestyleTwine,
    label: "راهنمای انتخاب هدیه",
    href: "/blog/choose-food-gift-box",
    icon: BookOpen,
  },
  {
    title: "شرایط نگهداری را پیش از سفارش ببین",
    description: "روش نگهداری هر محصول می‌تواند متفاوت باشد؛ اطلاعات تأییدشده همان محصول را پیش از انتخاب بررسی کن.",
    image: lifestyleMilk,
    label: "راهنمای نگهداری",
    href: "/blog/cookie-storage-guide",
    icon: Snowflake,
  },
  {
    title: "برای پذیرایی چه تعداد مناسب است؟",
    description: "تعداد مهمان‌ها، اندازه محصول و نقش کوکی در میز پذیرایی، مقدار مناسب را روشن‌تر می‌کنند.",
    image: galleryBaking,
    label: "راهنمای پذیرایی",
    href: "/blog/cookies-per-guest-guide",
    icon: Users,
  },
] as const;

export const EditorialGuides = () => (
  <section className="home-color-wash section-padding overflow-hidden" aria-labelledby="editorial-guides-title">
    <div className="container-custom">
      <Reveal className="mb-9 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="editorial-label mb-5">یادداشت‌های کوتاه و کاربردی</span>
          <h2 id="editorial-guides-title" className="modern-section-title">
            قبل از انتخاب، کمی بیشتر بدان
          </h2>
          <p className="mt-5 leading-8 text-muted-foreground">
            چند دقیقه مطالعه برای انتخاب هدیه، پذیرایی و نگهداری بهتر محصولات.
          </p>
        </div>
        <Link
          to="/blog"
          className="group inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-[#27390c]/15 bg-white/70 px-6 font-black text-[#27390c] shadow-soft transition hover:-translate-y-0.5 hover:bg-[#d0e596] lg:self-auto"
        >
          همه راهنماها
          <ArrowUpLeft size={18} aria-hidden="true" />
        </Link>
      </Reveal>

      <div className="editorial-guides">
        {guides.map((guide, index) => {
          const Icon = guide.icon;
          return (
            <Reveal key={guide.title} delay={index * 70} className={index === 0 ? "editorial-guides__feature" : ""}>
              <Link to={guide.href} className="editorial-guide group">
                <img src={guide.image} alt="" className="editorial-guide__image" loading="lazy" decoding="async" width={1000} height={760} />
                <div className="editorial-guide__shade" aria-hidden="true" />
                <div className="editorial-guide__content">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="mt-auto text-xs font-black text-[#dceba8]">{guide.label}</span>
                  <h3 className="mt-2 max-w-xl text-xl font-black leading-8 text-white sm:text-2xl">
                    {guide.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-white/75">{guide.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-white">
                    خواندن راهنما
                    <ArrowUpLeft className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" size={17} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);
