import { MessageCircle, Quote, ShieldCheck, Star } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import {
  brandConfig,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { averageRating, publishedReviews } from "@/data/reviews";

const ReviewsPage = () => {
  const schema =
    publishedReviews.length > 0 && averageRating
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: brandConfig.brandName,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: publishedReviews.length,
          },
          review: publishedReviews.map((review) => ({
            "@type": "Review",
            author: { "@type": "Person", name: review.displayName },
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
            },
            reviewBody: review.text,
          })),
        }
      : undefined;

  return (
    <>
      <SEO
        title="نظرهای تأییدشده مشتریان"
        description="نظرهای منتشرشده وینیمی فقط پس از اتصال به سفارش تأییدشده یا بررسی دستی نمایش داده می‌شوند."
        schema={schema}
      />

      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="container-custom max-w-4xl text-center">
          <Breadcrumbs
            className="mb-8 justify-center"
            items={[{ name: "خانه", href: "/" }, { name: "نظرهای مشتریان" }]}
          />
          <h1 className="heading-1 mb-4 text-foreground">
            نظرهای تأییدشده مشتریان
          </h1>
          <p className="mx-auto max-w-2xl leading-8 text-muted-foreground">
            برای حفظ اعتماد، نام، امتیاز و متن ساختگی در سایت منتشر نمی‌شود. هر نظر عمومی باید به سفارش واقعی یا منبع قابل‌بررسی متصل باشد.
          </p>

          {averageRating && publishedReviews.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <div className="flex text-2xl text-gold" aria-hidden="true">
                {"★".repeat(Math.round(averageRating))}
              </div>
              <span className="text-xl font-bold text-foreground">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                از {publishedReviews.length.toLocaleString("fa-IR")} نظر تأییدشده
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {publishedReviews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publishedReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-3xl border border-border bg-card p-6 shadow-card"
                >
                  <Quote className="mb-3 text-primary/30" size={32} aria-hidden="true" />
                  <div
                    className="mb-3 flex text-gold"
                    aria-label={`${review.rating} از ۵ ستاره`}
                  >
                    {"★".repeat(review.rating)}
                  </div>
                  <p className="mb-5 leading-8 text-foreground/80">{review.text}</p>
                  <div className="border-t border-border pt-4">
                    <p className="font-bold text-foreground">{review.displayName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      خرید تأییدشده
                      {review.city ? ` · ${review.city}` : ""}
                      {review.product ? ` · ${review.product}` : ""}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-7 text-center shadow-soft sm:p-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck size={30} aria-hidden="true" />
              </div>
              <h2 className="heading-2 mb-3 text-foreground">
                هنوز نظر عمومی تأییدشده‌ای ثبت نشده است
              </h2>
              <p className="mb-7 leading-8 text-muted-foreground">
                بعد از اتصال فرانت‌اند به بک‌اند، مشتری واردشده می‌تواند برای سفارش تحویل‌شده نظر ثبت کند و نظر پس از بررسی منتشر خواهد شد.
              </p>
              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white"
              >
                <MessageCircle size={19} aria-hidden="true" />
                ارسال بازخورد به پشتیبانی
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ReviewsPage;
