import { useQuery } from "@tanstack/react-query";
import {
  CalendarCheck2,
  Clock3,
  ListTree,
  Loader2,
  MessageCircle,
  User,
} from "lucide-react";
import { Link, useLoaderData, useParams } from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BlogPostCard } from "@/components/content/BlogPostCard";
import {
  extractStructuredHeadings,
  StructuredText,
} from "@/components/content/StructuredText";
import { SEO } from "@/components/SEO";
import {
  brandConfig,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { ApiError, isBackendEnabled } from "@/lib/api";
import { loadPost } from "@/lib/content";
import { formatPersianUtcDate } from "@/lib/format-persian-date";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";
import { createBlogPostingSchema } from "@/lib/seo/content-schema";
import { getContentTopicPath } from "@/lib/seo/content-topics";
import NotFoundPage from "@/pages/NotFoundPage";

const configuredOrigin =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || brandConfig.website;
const SITE_ORIGIN = (() => {
  try {
    return new URL(configuredOrigin).origin;
  } catch {
    return new URL(brandConfig.website).origin;
  }
})();

const estimateReadingMinutes = (content: string) => {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/[\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = plainText ? plainText.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 180));
};

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const initialPost = loaderData?.post?.slug === slug ? loaderData.post : undefined;
  const query = useQuery({
    queryKey: ["store", "post", slug],
    queryFn: () => loadPost(slug as string),
    enabled: isBackendEnabled && Boolean(slug),
    initialData: isBackendEnabled ? initialPost : undefined,
    staleTime: 60_000,
  });

  if (query.error instanceof ApiError && query.error.status === 404) {
    return <NotFoundPage />;
  }
  if (!isBackendEnabled) {
    return (
      <section className="section-padding">
        <div className="container-custom text-center">
          منبع محتوای بک‌اند فعال نیست.
        </div>
      </section>
    );
  }
  if (query.isLoading) {
    return (
      <section className="section-padding">
        <div className="container-custom text-center" role="status">
          <Loader2
            className="mx-auto mb-4 animate-spin text-primary"
            size={42}
            aria-hidden="true"
          />
          در حال دریافت مقاله…
        </div>
      </section>
    );
  }
  if (query.error || !query.data) {
    return (
      <section className="section-padding">
        <div
          className="container-custom rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive"
          role="alert"
        >
          {query.error instanceof Error ? query.error.message : "مقاله دریافت نشد."}
        </div>
      </section>
    );
  }

  const post = query.data;
  const publishedDate = formatPersianUtcDate(post.publishedAt);
  const topicPath = getContentTopicPath(post.category);
  const relatedPosts = loaderData?.relatedPosts ?? [];
  const schema = createBlogPostingSchema({ siteOrigin: SITE_ORIGIN, post });
  const headings = extractStructuredHeadings(post.content);
  const readingMinutes = estimateReadingMinutes(post.content);
  const breadcrumbs = [
    { name: "خانه", href: "/" },
    { name: "راهنماها", href: "/blog" },
    ...(topicPath && post.category
      ? [{ name: post.category, href: topicPath }]
      : []),
    { name: post.title },
  ];

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt || post.title}
        type="article"
        schema={schema}
        image={post.coverUrl || undefined}
        author={post.author || brandConfig.brandName}
        publishedTime={post.publishedAt || undefined}
      />
      <article className="section-padding">
        <div className="container-custom max-w-6xl">
          <div className="mx-auto max-w-3xl">
            <Breadcrumbs className="mb-8" items={breadcrumbs} />
            {topicPath && post.category && (
              <Link
                to={topicPath}
                className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary transition hover:bg-primary/20"
              >
                {post.category}
              </Link>
            )}
            <h1 className="mb-5 text-3xl font-black leading-[1.55] text-foreground md:text-4xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mb-6 rounded-2xl border-r-4 border-primary/35 bg-primary/5 px-5 py-4 text-base font-medium leading-8 text-foreground/75 md:text-lg md:leading-9">
                {post.excerpt}
              </p>
            )}
            <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User size={14} aria-hidden="true" />
                {post.author || brandConfig.brandName}
              </span>
              {publishedDate && (
                <time
                  className="flex items-center gap-1.5"
                  dateTime={post.publishedAt || undefined}
                >
                  <CalendarCheck2 size={14} aria-hidden="true" />
                  {publishedDate}
                </time>
              )}
              <span className="flex items-center gap-1.5">
                <Clock3 size={14} aria-hidden="true" />
                حدود {readingMinutes.toLocaleString("fa-IR")} دقیقه مطالعه
              </span>
            </div>
            {post.tags.length > 0 && (
              <ul className="mb-8 flex flex-wrap gap-2" aria-label="برچسب‌های مقاله">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {post.coverUrl && (
            <figure className="mx-auto mb-10 max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-muted shadow-soft">
              <img
                src={post.coverUrl}
                alt={post.title}
                className="aspect-[16/9] h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </figure>
          )}

          {headings.length > 1 && (
            <details className="mx-auto mb-8 max-w-3xl rounded-2xl border border-border bg-secondary/25 p-4 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-black text-foreground">
                <ListTree size={18} aria-hidden="true" />
                فهرست این راهنما
              </summary>
              <nav className="mt-4 grid gap-2 border-t border-border pt-4" aria-label="فهرست مطالب مقاله">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`rounded-xl px-3 py-2 text-sm leading-6 text-muted-foreground transition hover:bg-primary/10 hover:text-primary ${heading.level === 3 ? "pr-7" : "font-bold"}`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </details>
          )}

          <div className={headings.length > 1 ? "mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start" : "mx-auto max-w-3xl"}>
            <div className="min-w-0 max-w-3xl">
              <StructuredText content={post.content} />
              <div className="mt-12 rounded-3xl bg-primary/10 p-6 text-center sm:p-8">
                <h2 className="mb-3 text-xl font-bold">
                  محصولات و اطلاعات نهایی را جداگانه بررسی کنید
                </h2>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    to="/products"
                    className="btn-primary rounded-xl px-6 py-3 font-bold"
                  >
                    مشاهده محصولات
                  </Link>
                  <a
                    href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white"
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    سؤال از پشتیبانی
                  </a>
                </div>
              </div>
            </div>

            {headings.length > 1 && (
              <aside className="sticky top-32 hidden rounded-2xl border border-border bg-card/80 p-4 shadow-soft lg:block">
                <div className="mb-3 flex items-center gap-2 font-black text-foreground">
                  <ListTree size={18} aria-hidden="true" />
                  فهرست راهنما
                </div>
                <nav className="grid gap-1 border-t border-border pt-3" aria-label="فهرست مطالب مقاله">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={`rounded-xl px-3 py-2 text-xs leading-6 text-muted-foreground transition hover:bg-primary/10 hover:text-primary ${heading.level === 3 ? "pr-6" : "font-bold"}`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </aside>
            )}
          </div>
        </div>
      </article>
      {relatedPosts.length > 0 && (
        <section className="border-t border-border bg-secondary/20 section-padding">
          <div className="container-custom">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="heading-2 mb-2">راهنماهای مرتبط</h2>
                <p className="text-muted-foreground">
                  مقاله‌های منتشرشده در همین موضوع.
                </p>
              </div>
              {topicPath && (
                <Link to={topicPath} className="font-bold text-primary">
                  مشاهده همه موضوع
                </Link>
              )}
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogPostCard
                  key={relatedPost.id}
                  post={relatedPost}
                  headingLevel="h3"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default BlogDetailPage;
