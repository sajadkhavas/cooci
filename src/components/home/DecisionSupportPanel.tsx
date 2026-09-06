import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpLeft,
  CircleHelp,
  Gift,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Reveal } from "@/components/motion/Reveal";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";
import { isBackendEnabled } from "@/lib/api";
import { loadFaqs, type StoreFaq } from "@/lib/content";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";

const pathIcons = [ShoppingBag, Gift, PackageSearch] as const;

export const buildHomeDecisionFaqSchema = (faqs: StoreFaq[]) =>
  faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : undefined;

export const DecisionSupportPanel = () => {
  const { content } = useStorefrontSettings();
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const query = useQuery({
    queryKey: ["store", "faqs", "home-decision"],
    queryFn: () => loadFaqs("home-decision"),
    enabled: isBackendEnabled,
    initialData: loaderData?.faqs,
    staleTime: 10 * 60_000,
  });
  const faqs = query.data ?? [];
  const decision = content.home.decision;

  return (
    <section
      className="home-color-wash section-padding overflow-hidden"
      aria-labelledby="home-decision-support-title"
    >
      <div className="container-custom">
        <Reveal className="winimi-decision-panel">
          <div className="winimi-decision-panel__intro">
            <span className="editorial-label mb-5">
              <CircleHelp size={15} aria-hidden="true" />
              {decision.eyebrow}
            </span>
            <h2 id="home-decision-support-title" className="modern-section-title max-w-3xl">
              {decision.title}
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-muted-foreground">
              {decision.description}
            </p>

            <nav className="mt-8 grid gap-3 sm:grid-cols-3" aria-label={decision.title}>
              {decision.paths.map((item, index) => {
                const Icon = pathIcons[index] ?? PackageSearch;
                return (
                  <Link
                    key={`${item.href}-${item.title}`}
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
                      {item.actionLabel}
                      <ArrowUpLeft size={15} className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
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
                  {decision.faqEyebrow}
                </span>
                <h3 className="mt-2 text-2xl font-black text-foreground">
                  {decision.faqTitle}
                </h3>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d0e596] text-[#27390c]" aria-hidden="true">
                <CircleHelp size={22} />
              </span>
            </div>

            <div className="divide-y divide-border/70 border-y border-border/70">
              {faqs.map((item) => (
                <details key={item.question} className="group py-1">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-black text-foreground marker:content-none">
                    <span>{item.question}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white/70 text-[#9b5545] transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pl-3 text-sm leading-8 text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
              {faqs.length === 0 && !query.isLoading && (
                <p className="py-5 text-sm leading-8 text-muted-foreground">
                  پرسش فعالی برای این بخش ثبت نشده است.
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
