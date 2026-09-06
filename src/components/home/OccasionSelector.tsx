import { useState } from "react";
import { ArrowUpLeft, Coffee, Cookie, Gift, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Reveal } from "@/components/motion/Reveal";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";

const presentation = [
  { icon: Gift, accent: "bg-[#f5dcd2] text-[#7b4337]" },
  { icon: Coffee, accent: "bg-[#f6e9ca] text-[#70551b]" },
  { icon: Cookie, accent: "bg-[#dceba8] text-[#344b12]" },
] as const;

export const OccasionSelector = () => {
  const { content } = useStorefrontSettings();
  const occasion = content.home.occasion;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeIndex = Math.min(selectedIndex, occasion.items.length - 1);
  const selected = occasion.items[safeIndex] ?? occasion.items[0];
  if (!selected) return null;
  const selectedPresentation = presentation[safeIndex] ?? presentation[0];
  const Icon = selectedPresentation.icon;

  return (
    <section
      className="home-color-wash section-padding overflow-hidden pt-12 sm:pt-16"
      aria-labelledby="occasion-selector-title"
    >
      <div className="container-custom">
        <Reveal className="mx-auto mb-9 max-w-3xl text-center sm:mb-12">
          <span className="editorial-label mb-5">{occasion.eyebrow}</span>
          <h2 id="occasion-selector-title" className="modern-section-title">
            {occasion.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-muted-foreground">
            {occasion.description}
          </p>
        </Reveal>

        <Reveal className="occasion-table">
          <div className="occasion-table__tabs" role="group" aria-label={occasion.title}>
            {occasion.items.map((item, index) => {
              const ItemIcon = (presentation[index] ?? presentation[0]).icon;
              const accent = (presentation[index] ?? presentation[0]).accent;
              const active = index === safeIndex;
              return (
                <button
                  key={`${item.href}-${item.shortTitle}`}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedIndex(index)}
                  className={`occasion-table__tab ${active ? "occasion-table__tab--active" : ""}`}
                >
                  <span className={`occasion-table__tab-icon ${accent}`}>
                    <ItemIcon size={19} aria-hidden="true" />
                  </span>
                  <span>{item.shortTitle}</span>
                </button>
              );
            })}
          </div>

          <div className="occasion-table__panel">
            <div className="occasion-table__copy">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${selectedPresentation.accent}`}>
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
                {selected.actionLabel}
                <ArrowUpLeft size={18} className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              </Link>
            </div>

            <div className="occasion-table__visual">
              <img
                key={`${safeIndex}-${selected.imageUrl}`}
                src={selected.imageUrl}
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
