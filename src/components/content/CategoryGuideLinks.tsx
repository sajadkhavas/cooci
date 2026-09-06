import { ArrowUpLeft, BookOpen } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";
import { resolveCategoryGuideContent } from "@/lib/category-guide-content";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";

export const CategoryGuideLinks = ({ slug }: { slug?: string }) => {
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const { payload } = useStorefrontSettings();
  const copy = resolveCategoryGuideContent(payload);
  const landing = slug
    ? loaderData?.categoryLandings?.find((item) => item.slug === slug)
    : undefined;
  const guides = landing?.guides ?? [];

  if (guides.length === 0) return null;

  return (
    <aside
      className="border-t border-border bg-secondary/20 section-padding"
      aria-labelledby="category-guide-links-title"
    >
      <div className="container-custom">
        <div className="mb-8 max-w-3xl">
          <span className="editorial-label mb-4">{copy.eyebrow}</span>
          <h2 id="category-guide-links-title" className="heading-2">
            {copy.title}
          </h2>
          <p className="mt-3 leading-8 text-muted-foreground">
            {copy.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={`${guide.href}-${guide.title}`}
              to={guide.href}
              className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/30"
            >
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen size={20} aria-hidden="true" />
              </span>
              <h3 className="text-lg font-black leading-8 text-foreground">
                {guide.title}
              </h3>
              <p className="mt-2 leading-7 text-muted-foreground">
                {guide.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                {copy.readLabel}
                <ArrowUpLeft
                  size={17}
                  className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};
