import { useQuery } from "@tanstack/react-query";
import { CalendarCheck2, Loader2, MessageCircle, User } from "lucide-react";
import { Link, useLoaderData, useParams } from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StructuredText } from "@/components/content/StructuredText";
import { SEO } from "@/components/SEO";
import { brandConfig, generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE } from "@/config/brand";
import { ApiError, isBackendEnabled } from "@/lib/api";
import { loadPost } from "@/lib/content";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";
import NotFoundPage from "@/pages/NotFoundPage";

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

  if (query.error instanceof ApiError && query.error.status === 404) return <NotFoundPage />;
  if (!isBackendEnabled) return <section className="section-padding"><div className="container-custom text-center">منبع محتوای بک‌اند فعال نیست.</div></section>;
  if (query.isLoading) return <section className="section-padding"><div className="container-custom text-center" role="status"><Loader2 className="mx-auto mb-4 animate-spin text-primary" size={42} aria-hidden="true" />در حال دریافت مقاله…</div></section>;
  if (query.error || !query.data) return <section className="section-padding"><div className="container-custom rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive" role="alert">{query.error instanceof Error ? query.error.message : "مقاله دریافت نشد."}</div></section>;

  const post = query.data;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.coverUrl || undefined,
    datePublished: post.publishedAt || undefined,
    author: { "@type": "Organization", name: post.author || brandConfig.brandName },
    publisher: { "@type": "Organization", name: brandConfig.brandName, url: brandConfig.website },
    mainEntityOfPage: `${brandConfig.website}/blog/${post.slug}`,
  };

  return (
    <>
      <SEO title={post.title} description={post.excerpt || post.title} type="article" schema={schema} image={post.coverUrl || undefined} author={post.author || brandConfig.brandName} />
      <article className="section-padding">
        <div className="container-custom max-w-3xl">
          <Breadcrumbs className="mb-8" items={[{ name: "خانه", href: "/" }, { name: "راهنماها", href: "/blog" }, { name: post.title }]} />
          {post.category && <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{post.category}</span>}
          <h1 className="mb-6 text-3xl font-black leading-tight text-foreground md:text-4xl">{post.title}</h1>
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><User size={14} aria-hidden="true" />{post.author || brandConfig.brandName}</span>
            {post.publishedAt && <span className="flex items-center gap-1"><CalendarCheck2 size={14} aria-hidden="true" />{new Date(post.publishedAt).toLocaleDateString("fa-IR")}</span>}
          </div>
          {post.coverUrl && <figure className="mb-10 overflow-hidden rounded-3xl border border-border bg-muted shadow-soft"><img src={post.coverUrl} alt={post.title} className="aspect-[16/9] h-full w-full object-cover" loading="eager" /></figure>}
          <StructuredText content={post.content} />
          <div className="mt-12 rounded-3xl bg-primary/10 p-6 text-center sm:p-8">
            <h2 className="mb-3 text-xl font-bold">محصولات و اطلاعات نهایی را جداگانه بررسی کنید</h2>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/products" className="btn-primary rounded-xl px-6 py-3 font-bold">مشاهده محصولات</Link>
              <a href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white"><MessageCircle size={18} aria-hidden="true" />سؤال از پشتیبانی</a>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogDetailPage;
