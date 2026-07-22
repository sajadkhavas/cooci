import { useQuery } from "@tanstack/react-query";
import { CalendarCheck2, ImageIcon, Loader2 } from "lucide-react";
import { Link, useLoaderData, useSearchParams } from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { SEO } from "@/components/SEO";
import { isBackendEnabled } from "@/lib/api";
import { loadPosts } from "@/lib/content";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";

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

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete("page");
    else next.set("page", String(nextPage));
    setSearchParams(next);
  };

  return (
    <>
      <SEO title="راهنماهای وینیمی" description="راهنماها و مقاله‌های منتشرشده وینیمی از منبع محتوای فروشگاه." />
      <section className="bg-gradient-to-b from-secondary/40 to-background section-padding">
        <div className="container-custom max-w-5xl">
          <Breadcrumbs className="mb-8" items={[{ name: "خانه", href: "/" }, { name: "راهنماها" }]} />
          <h1 className="heading-1 mb-4 text-foreground">راهنماهای وینیمی</h1>
          <p className="body-large max-w-2xl text-muted-foreground">مطالب منتشرشده و بازبینی‌شده فروشگاه برای انتخاب و نگهداری آگاهانه‌تر.</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          {!isBackendEnabled ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">منبع محتوای بک‌اند فعال نیست.</div>
          ) : query.isLoading ? (
            <div className="py-16 text-center" role="status"><Loader2 className="mx-auto mb-4 animate-spin text-primary" size={42} aria-hidden="true" />در حال دریافت راهنماها…</div>
          ) : query.error ? (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive" role="alert">{query.error instanceof Error ? query.error.message : "دریافت راهنماها ناموفق بود."}</div>
          ) : posts.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">هنوز مقاله‌ای منتشر نشده است.</div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-hover">
                    <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                      {post.coverUrl ? <img src={post.coverUrl} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /> : <div className="flex h-full w-full items-center justify-center text-muted-foreground"><ImageIcon size={42} aria-hidden="true" /></div>}
                    </div>
                    <div className="flex flex-1 flex-col space-y-3 p-6">
                      {post.category && <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{post.category}</span>}
                      <h2 className="line-clamp-2 text-lg font-bold text-foreground group-hover:text-primary">{post.title}</h2>
                      {post.excerpt && <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>}
                      <div className="mt-auto flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                        <CalendarCheck2 size={14} aria-hidden="true" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("fa-IR") : "تاریخ انتشار ثبت نشده"}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {pagination && <CatalogPagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogListPage;
