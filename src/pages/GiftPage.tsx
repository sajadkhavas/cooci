import { Gift, Heart, MessageCircle, Sparkles, Star } from "lucide-react";
import { Link } from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";

const occasionIcons = [Heart, Star, Gift, Sparkles] as const;

const GiftPage = () => {
  const { settings, content } = useStorefrontSettings();
  const { products } = useCatalogProducts({ category: "gift", perPage: 12 });
  const gift = content.gift;

  return (
    <>
      <SEO title={gift.metaTitle} description={gift.metaDescription} />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 section-padding">
        <div className="container-custom">
          <Breadcrumbs
            className="mb-8"
            items={[{ name: "خانه", href: "/" }, { name: gift.heroTitle }]}
          />
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-2 text-sm font-bold text-amber-800">
                <Gift size={16} aria-hidden="true" /> {gift.heroBadge}
              </div>
              <h1 className="heading-1 mb-6 text-foreground">{gift.heroTitle}</h1>
              <p className="body-large mb-8 leading-9 text-muted-foreground">
                {gift.heroDescription}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to={gift.primary.href}
                  className="btn-primary inline-flex items-center justify-center rounded-xl px-7 py-4 font-bold"
                >
                  {gift.primary.label}
                </Link>
                <a
                  href={settings.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-7 py-4 font-bold text-white"
                >
                  <MessageCircle size={19} aria-hidden="true" /> {gift.supportLabel}
                </a>
              </div>
            </div>
            <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={gift.imageUrl}
                alt={gift.imageAlt}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-2 mb-12 text-center text-foreground">
            {gift.occasionsTitle}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {gift.occasions.map((occasion, index) => {
              const Icon = occasionIcons[index] ?? Gift;
              return (
                <article
                  key={`${occasion.title}-${index}`}
                  className="rounded-3xl border border-border bg-card p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="text-primary" size={28} aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-bold text-foreground">{occasion.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {occasion.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="bg-secondary/30 section-padding">
          <div className="container-custom">
            <h2 className="heading-2 mb-10 text-center text-foreground">
              {gift.productsTitle}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <InquiryForm
            type="gift"
            title={gift.inquiry.title}
            description={gift.inquiry.description}
            defaultSubject={gift.inquiry.subject}
            messageLabel={gift.inquiry.messageLabel}
            metadata={{ source: "gift-page" }}
          />
        </div>
      </section>
    </>
  );
};

export default GiftPage;
