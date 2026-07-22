import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link, useLoaderData, useSearchParams } from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { BlogPostCard } from "@/components/content/BlogPostCard";
import { ContentTopicNav } from "@/components/content/ContentTopicNav";
import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";
import { isBackendEnabled } from "@/lib/api";
import { loadPosts } from "@/lib/content";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";
import { createBlogCollectionSchema } from "@/lib/seo/content-schema";

const configuredOrigin =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || brandConfig.website;
const SITE_ORIGIN = (() => {
  try {
    return new URL(configuredOrigin).origin;
  } catch {
    return new URL(brandConfig.website).origin;
  }
})();

const parsePage = (value: string | null) => {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(10_000, parsed) : 1;
};

const BlogTopicPage = () => {
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const [searchParams, setSearchParams] = useSearchParams();
  const topic = loaderData?.contentTopic;
  const page = parsePage(searchParams.get("page"));
  const initialPosts =
    loaderData?.posts?.pagination?.page === page ||
    (!loaderData?.posts?.pagination && page === 1)
      ? loaderData.posts
      : undefined;
  const query = useQuery({
    queryKey: ["store", "posts", "topic", topic?.name, page],
    queryFn: () =>
      loadPosts({ category: topic?.name, page, perPage: 12 }),
    enabled: isBackendEnabled && Boolean(topic?.name),
    initialData: isBackendEnabled ? initialPosts : undefined,
    staleTime: 60_000,
  });
  const posts = query.data?.posts ?? [];
  const pagination = query.data?.pagination;

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete("page");
    else next.set("page", String(nextPage));
    setSearchParams(next);
  };

  if (!topic) {
    return (
      <section className="section-padding">
        <div className="container-custom text-center">
          منبع موضوعات محتوایی در دسترس نیست.
        </div>
      </section>
    );
  }

  const title = `راهنماهای ${topic.name}`;
  const description = `${topic.postCount} مقاله منتشرشده وینیمی در موضوع ${topic.name}.`;
  const schema = createBlogCollectionSchema({
    siteOrigin: SITE_ORIGIN,
    path: topic.path,
    title,
    description,
    posts,
    topics: loaderData?.contentTopics,
    activeTopic: topic,
  });

  return (
    <>
      <SEO
        title={title}
        description={description}
        url={topic.path}
        schema={schema}
      />
      <section className="bg-gradient-to-b from-secondary/40 to-background section-padding">
        <div className="container-custom max-w-5xl">
          <Breadcrumbs
            className="mb-8"
            items={[
              { name: "خانه", href: "/" },
              { name: "راهنماها", href: "/blog" },
              { name: topic.name },
            ]}
          />
          <Link
            to="/blog"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary"
          >
            <ArrowRight size={16} aria-hidden="true" />
            همه راهنماها
          </Link>
          <h1 className="heading-1 mb-4 text-foreground">{title}</h1>
          <p className="body-large max-w-2xl text-muted-foreground">
            {description}
          </p>
          <ContentTopicNav
            topics={loaderData?.contentTopics ?? []}
            activeTopic={topic.name}
            className="mt-8"
          />
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          {!isBackendEnabled ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              منبع محتوای بک‌اند فعال نیست.
            </div>
          ) : query.isLoading ? (
            <div className="py-16 text-center" role="status">
              <Loader2
                className="mx-auto mb-4 animate-spin text-primary"
                size={42}
                aria-hidden="true"
              />
              در حال دریافت راهنماهای موضوع…
            </div>
          ) : query.error ? (
            <div
              className="rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive"
              role="alert"
            >
              {query.error instanceof Error
                ? query.error.message
                : "دریافت راهنماهای موضوع ناموفق بود."}
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
              {pagination && (
                <CatalogPagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogTopicPage;
