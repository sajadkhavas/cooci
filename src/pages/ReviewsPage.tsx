import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Quote, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { isBackendEnabled } from "@/lib/api";
import { loadProductReviews } from "@/lib/content";

const ReviewsPage = () => {
  const catalog = useCatalogProducts({ page: 1, perPage: 12, sort: "featured" });
  const slugs = useMemo(() => catalog.products.map((product) => product.slug), [catalog.products]);
  const reviewQuery = useQuery({
    queryKey: ["store", "review-wall", slugs],
    enabled: isBackendEnabled && slugs.length > 0,
    queryFn: async () => {
      const results = await Promise.all(slugs.map((slug) => loadProductReviews(slug, 1, 20)));
      return results.flatMap((result, index) => result.reviews.map((review) => ({ ...review, productName: catalog.products[index]?.name || "محصول وینیمی", productSlug: slugs[index] })));
    },
    staleTime: 60_000,
  });
  const reviews = reviewQuery.data ?? [];
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const schema = reviews.length ? { "@context": "https://schema.org", "@type": "Organization", name: brandConfig.brandName, aggregateRating: { "@type": "AggregateRating", ratingValue: average.toFixed(2), reviewCount: reviews.length }, review: reviews.map((review) => ({ "@type": "Review", author: { "@type": "Person", name: review.customerName }, reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 }, reviewBody: review.body || review.title || "" })) } : undefined;

  return (
    <>
      <SEO title="نظرهای تأییدشده مشتریان" description="نظرهای خرید تأییدشده و منتشرشده از بک‌اند وینیمی." schema={schema} />
      <section className="bg-gradient-to-b from-primary/10 to-background section-padding"><div className="container-custom max-w-4xl text-center"><Breadcrumbs className="mb-8 justify-center" items={[{ name: "خانه", href: "/" }, { name: "نظرهای مشتریان" }]} /><h1 className="heading-1 mb-4">نظرهای تأییدشده مشتریان</h1><p className="mx-auto max-w-2xl leading-8 text-muted-foreground">فقط نظرهای تأییدشده مرتبط با سفارش تحویل‌شده نمایش داده می‌شوند.</p>{reviews.length > 0 && <div className="mt-6 flex items-center justify-center gap-2"><span className="text-2xl text-gold" aria-hidden="true">{"★".repeat(Math.round(average))}</span><strong>{average.toFixed(1)}</strong><span className="text-muted-foreground">از {reviews.length.toLocaleString("fa-IR")} نظر</span></div>}</div></section>
      <section className="section-padding"><div className="container-custom">{catalog.isLoading || reviewQuery.isLoading ? <div className="py-16 text-center" role="status"><Loader2 className="mx-auto mb-3 animate-spin text-primary" aria-hidden="true" />در حال دریافت نظرها…</div> : reviewQuery.error ? <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive" role="alert">{reviewQuery.error instanceof Error ? reviewQuery.error.message : "دریافت نظرها ناموفق بود."}</div> : reviews.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{reviews.map((review) => <article key={review.id} className="rounded-3xl border border-border bg-card p-6 shadow-card"><Quote className="mb-3 text-primary/30" size={32} aria-hidden="true" /><div className="mb-3 text-gold" aria-label={`${review.rating} از ۵ ستاره`}>{"★".repeat(review.rating)}</div>{review.title && <h2 className="mb-2 font-black">{review.title}</h2>}{review.body && <p className="mb-5 leading-8 text-foreground/80">{review.body}</p>}<div className="border-t border-border pt-4"><p className="font-bold">{review.customerName}</p><p className="mt-1 text-xs text-muted-foreground">خرید تأییدشده · <Link className="text-primary hover:underline" to={`/products/${review.productSlug}`}>{review.productName}</Link></p></div></article>)}</div> : <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-10 text-center"><ShieldCheck className="mx-auto mb-5 text-primary" size={44} aria-hidden="true" /><h2 className="heading-2 mb-3">هنوز نظر عمومی تأییدشده‌ای نیست</h2><p className="leading-8 text-muted-foreground">مشتری پس از تحویل سفارش می‌تواند از صفحه همان سفارش نظر ثبت کند؛ انتشار پس از بررسی انجام می‌شود.</p></div>}</div></section>
    </>
  );
};

export default ReviewsPage;
