import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useLoaderData, useSearchParams } from "react-router";
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

const BlogListPage = () => {
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const initialPosts =
    loaderData?.posts?.pagination?.page === page ||
    (!loaderData?.posts?.pagination && page === 1)
      ? loaderData.posts
      : undefined;
  const query = useQuery({
    queryKey: ["store", "posts", page],
    queryFn: () => loadPosts({ page, perPage: 12 }),
    enabled: isBackendEnabled,
    initialData: isBackendEnabled ? initialPosts : undefined,
    staleTime: 60_000,
  });
  const posts = query.data?.posts ?? [];
  const pagination = query.data?.pagination;
  const topics = loaderData?.contentTopics ?? [];

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete("page");
    else next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const title = "راهنماهای وینیمی";
  const description =
    "مقاله‌های منتشرشده وینیمی در موضوعات واقعی فروشگاه برای انتخاب، سفارش و نگهداری آگاهانه‌تر.";
  const schemaPath = page <= 1 ? "/blog" : `/blog?page=${page}`;
  const schema = createBlogCollectionSchema({
    siteOrigin: SITE_ORIGIN,
    path: schemaPath,
    title,
    description,
    posts,
    topics,
  });

  return (
    <>
      <SEO title={title} description={description} schema={schema} />
      <section className="bg-gradient-to-b from-secondary/40 to-background section-padding">
        <div className="container-custom max-w-5xl">
          <Breadcrumbs
            className="mb-8"
            items={[{ name: "خانه", href: "/" }, { name: "راهنماها" }]}
          />
          <h1 className="heading-1 mb-4 text-foreground">{title}</h1>
          <p className="body-large max-w-2xl text-muted-foreground">
            {description}
          </p>
          <ContentTopicNav topics={topics} className="mt-8" />
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
              در حال دریافت راهنماها…
            </div>
          ) : query.error ? (
            <div
              className="rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive"
              role="alert"
            >
              {query.error instanceof Error
                ? query.error.message
                : "دریافت راهنماها ناموفق بود."}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              هنوز مقاله‌ای منتشر نشده است.
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

export default BlogListPage;
