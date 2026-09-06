import { ArrowUpLeft, BookOpen, Snowflake, Users } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Reveal } from "@/components/motion/Reveal";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";

const guideIcons = [BookOpen, Snowflake, Users] as const;

export const EditorialGuides = () => {
  const { content } = useStorefrontSettings();
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const editorial = content.home.editorial;
  const guides = loaderData?.relatedPosts ?? [];

  if (guides.length === 0) return null;

  return (
    <section className="home-color-wash section-padding overflow-hidden" aria-labelledby="editorial-guides-title">
      <div className="container-custom">
        <Reveal className="mb-9 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="editorial-label mb-5">{editorial.eyebrow}</span>
            <h2 id="editorial-guides-title" className="modern-section-title">
              {editorial.title}
            </h2>
            <p className="mt-5 leading-8 text-muted-foreground">
              {editorial.description}
            </p>
          </div>
          <Link
            to={editorial.cta.href}
            className="group inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-[#27390c]/15 bg-white/70 px-6 font-black text-[#27390c] shadow-soft transition hover:-translate-y-0.5 hover:bg-[#d0e596] lg:self-auto"
          >
            {editorial.cta.label}
            <ArrowUpLeft size={18} aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="editorial-guides">
          {guides.map((guide, index) => {
            const Icon = guideIcons[index] ?? BookOpen;
            return (
              <Reveal
                key={guide.slug}
                delay={index * 70}
                className={index === 0 ? "editorial-guides__feature" : ""}
              >
                <Link to={`/blog/${guide.slug}`} className="editorial-guide group">
                  {guide.coverUrl ? (
                    <img
                      src={guide.coverUrl}
                      alt=""
                      className="editorial-guide__image"
                      loading="lazy"
                      decoding="async"
                      width={1000}
                      height={760}
                    />
                  ) : (
                    <div className="editorial-guide__image bg-[#d0e596]/25" aria-hidden="true" />
                  )}
                  <div className="editorial-guide__shade" aria-hidden="true" />
                  <div className="editorial-guide__content">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    {guide.category && (
                      <span className="mt-auto text-xs font-black text-[#dceba8]">
                        {guide.category}
                      </span>
                    )}
                    <h3 className="mt-2 max-w-xl text-xl font-black leading-8 text-white sm:text-2xl">
                      {guide.title}
                    </h3>
                    {guide.excerpt && (
                      <p className="mt-2 max-w-xl text-sm leading-7 text-white/75">
                        {guide.excerpt}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-white">
                      {editorial.readLabel}
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
};
