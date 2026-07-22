import { Star } from "lucide-react";
import { useParams } from "react-router";
import { useProductReviews } from "@/hooks/useProductReviews";

const formatReviewDate = (value: string | null) => {
  if (!value || !Number.isFinite(Date.parse(value))) return undefined;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
};

const RatingStars = ({ value }: { value: number }) => (
  <span
    className="inline-flex items-center gap-1"
    aria-label={`${value.toLocaleString("fa-IR")} از ۵ ستاره`}
  >
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={17}
        aria-hidden="true"
        className={index < value ? "fill-amber-400 text-amber-500" : "text-muted"}
      />
    ))}
  </span>
);

export const ProductReviewsSection = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useProductReviews(slug);

  return (
    <section
      className="border-t border-border bg-secondary/20 py-16 md:py-20"
      aria-labelledby="product-reviews-title"
    >
      <div className="container-custom">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold text-primary">تجربه خرید واقعی</p>
              <h2 id="product-reviews-title" className="text-2xl font-black text-foreground md:text-3xl">
                نظر خریداران
              </h2>
            </div>

            {data.summary.count > 0 && (
              <div className="rounded-2xl border border-border bg-card px-5 py-4 text-right shadow-sm">
                <div className="flex items-center gap-3">
                  <strong className="text-2xl font-black text-foreground">
                    {data.summary.averageRating.toLocaleString("fa-IR", {
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                  <RatingStars value={Math.round(data.summary.averageRating)} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  بر اساس {data.summary.count.toLocaleString("fa-IR")} نظر تأییدشده
                </p>
              </div>
            )}
          </div>

          {isLoading && data.reviews.length === 0 ? (
            <div className="grid gap-4 md:grid-cols-2" aria-label="در حال دریافت نظرها">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="h-44 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : error && data.reviews.length === 0 ? (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm leading-7 text-amber-950" role="status">
              دریافت نظرهای تأییدشده موقتاً ممکن نیست. اطلاعات امتیاز تا اتصال دوباره به سرور در Structured Data نیز منتشر نمی‌شود.
            </div>
          ) : data.reviews.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              هنوز نظر تأییدشده‌ای برای این محصول ثبت نشده است.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {data.reviews.map((review) => {
                const publishedAt = formatReviewDate(review.publishedAt);
                return (
                  <article key={review.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-foreground">{review.customerName}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <RatingStars value={review.rating} />
                          {review.verifiedPurchase && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                              خرید تأییدشده
                            </span>
                          )}
                        </div>
                      </div>
                      {publishedAt && (
                        <time className="text-xs text-muted-foreground" dateTime={review.publishedAt || undefined}>
                          {publishedAt}
                        </time>
                      )}
                    </div>
                    {review.title && <h4 className="mb-2 font-bold text-foreground">{review.title}</h4>}
                    {review.body && <p className="leading-8 text-muted-foreground">{review.body}</p>}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
