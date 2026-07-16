import { Quote, Star } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { averageRating, reviews } from "@/data/reviews";
import { brandConfig } from "@/config/brand";

const ReviewsPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: brandConfig.brandName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating.toFixed(1),
      reviewCount: reviews.length,
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
    })),
  };

  return (
    <>
      <SEO
        title="نظرات مشتریان"
        description="نظرات واقعی مشتریان وینیمی بیکری درباره کوکی خانگی، تیرامیسو، چیزکیک و باکس‌های هدیه."
        schema={schema}
      />
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="container-custom max-w-4xl text-center">
          <Breadcrumbs className="mb-8 justify-center" items={[{ name: "خانه", href: "/" }, { name: "نظرات مشتریان" }]} />
          <h1 className="heading-1 text-foreground mb-4">آنچه مشتریان درباره ما می‌گویند</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex text-gold text-2xl">{"★".repeat(5)}</div>
            <span className="text-foreground font-bold text-xl">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">از {reviews.length} نظر</span>
          </div>
          <p className="text-muted-foreground leading-8">تجربه واقعی مشتریان {brandConfig.brandName} از کوکی، کیک و باکس‌های هدیه ما.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-3xl p-6 shadow-card">
                <Quote className="text-primary/30 mb-3" size={32} />
                <div className="flex text-gold mb-3">{"★".repeat(r.rating)}</div>
                <p className="text-foreground/80 leading-8 mb-5">{r.text}</p>
                <div className="pt-4 border-t border-border">
                  <p className="font-bold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {r.city} · {r.date}
                    {r.product && <> · <span className="text-primary">{r.product}</span></>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewsPage;
