import { useState } from "react";
import { ArrowUpLeft, Coffee, Cookie, Gift, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Reveal } from "@/components/motion/Reveal";
import galleryGiftBoxes from "@/assets/cookies/gallery-gift-boxes.jpg";
import galleryBaking from "@/assets/cookies/gallery-baking-process.jpg";
import lifestyleMilk from "@/assets/cookies/lifestyle-milk.jpg";

const occasions = [
  {
    id: "gift",
    shortTitle: "هدیه",
    eyebrow: "برای یک انتخاب شخصی‌تر",
    title: "هدیه‌ای که از روی فکر انتخاب شده",
    description:
      "مناسبت، تعداد و سلیقه گیرنده را در نظر بگیر و از مسیر راهنمای هدیه به انتخاب روشن‌تری برس.",
    action: "رفتن به راهنمای هدیه",
    href: "/gift",
    image: galleryGiftBoxes,
    icon: Gift,
    accent: "bg-[#f5dcd2] text-[#7b4337]",
  },
  {
    id: "hosting",
    shortTitle: "پذیرایی",
    eyebrow: "برای جمع‌های کوچک و بزرگ",
    title: "پذیرایی خوش‌ریتم، بدون انتخاب اضافه",
    description:
      "تعداد مهمان‌ها و حال‌وهوای دورهمی را مشخص کن و گزینه‌های جمع‌وجور و قابل مقایسه را ببین.",
    action: "دیدن گزینه‌های پذیرایی",
    href: "/products/category/mini-cookies",
    image: galleryBaking,
    icon: Coffee,
    accent: "bg-[#f6e9ca] text-[#70551b]",
  },
  {
    id: "daily",
    shortTitle: "روزمره",
    eyebrow: "برای چای، قهوه و حال خوب",
    title: "یک شیرینی کوچک برای همین امروز",
    description:
      "میان کوکی‌های فعال، طعم و بافتی را پیدا کن که به حال‌وهوای امروزت نزدیک‌تر است.",
    action: "دیدن کوکی‌ها",
    href: "/products/category/cookies",
    image: lifestyleMilk,
    icon: Cookie,
    accent: "bg-[#dceba8] text-[#344b12]",
  },
] as const;

export const OccasionSelector = () => {
  const [selectedId, setSelectedId] = useState<(typeof occasions)[number]["id"]>(
    occasions[0].id,
  );
  const selected = occasions.find((item) => item.id === selectedId) ?? occasions[0];
  const Icon = selected.icon;

  return (
    <section
      className="home-color-wash section-padding overflow-hidden pt-12 sm:pt-16"
      aria-labelledby="occasion-selector-title"
    >
      <div className="container-custom">
        <Reveal className="mx-auto mb-9 max-w-3xl text-center sm:mb-12">
          <span className="editorial-label mb-5">انتخاب براساس موقعیت</span>
          <h2 id="occasion-selector-title" className="modern-section-title">
            برای چه لحظه‌ای انتخاب می‌کنی؟
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-muted-foreground">
            به‌جای مرور همه‌چیز، از موقعیتت شروع کن؛ وینیمی مسیرهای مرتبط‌تر را
            جلو دستت می‌گذارد.
          </p>
        </Reveal>

        <Reveal className="occasion-table">
          <div className="occasion-table__tabs" role="group" aria-label="انتخاب موقعیت سفارش">
            {occasions.map((item) => {
              const ItemIcon = item.icon;
              const active = item.id === selected.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(item.id)}
                  className={`occasion-table__tab ${active ? "occasion-table__tab--active" : ""}`}
                >
                  <span className={`occasion-table__tab-icon ${item.accent}`}>
                    <ItemIcon size={19} aria-hidden="true" />
                  </span>
                  <span>{item.shortTitle}</span>
                </button>
              );
            })}
          </div>

          <div
            className="occasion-table__panel"
          >
            <div className="occasion-table__copy">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${selected.accent}`}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-black text-[#8f5142]">
                <Sparkles size={14} aria-hidden="true" />
                {selected.eyebrow}
              </span>
              <h3 className="mt-3 text-3xl font-black leading-tight text-foreground sm:text-4xl">
                {selected.title}
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
                {selected.description}
              </p>
              <Link
                to={selected.href}
                className="group mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#27390c] px-6 font-black text-[#f8f4e8] transition hover:-translate-y-0.5 hover:bg-[#405d16]"
              >
                {selected.action}
                <ArrowUpLeft
                  size={18}
                  className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="occasion-table__visual">
              <img
                key={selected.id}
                src={selected.image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                width={900}
                height={675}
              />
              <span className="occasion-table__seal" aria-hidden="true">
                انتخاب برای
                <strong>{selected.shortTitle}</strong>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
