import { Link, useParams, Navigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryContent } from "@/data/categoriesContent";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { generateWhatsAppUrl, SUPPORT_WHATSAPP_MESSAGE, brandConfig } from "@/config/brand";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const content = slug ? getCategoryContent(slug) : undefined;
  const { products } = useCatalogProducts();

  if (!content) return <Navigate to="/products" replace />;

  const categoryProducts = products.filter((p) => p.categorySlug === content.productCategorySlug);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <SEO title={content.seoTitle} description={content.seoDescription} schema={faqSchema} />

      <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
        <div className="container-custom">
          <Breadcrumbs
            className="mb-8"
            items={[
              { name: "خانه", href: "/" },
              { name: "محصولات", href: "/products" },
              { name: content.name },
            ]}
          />
          <div className="max-w-3xl">
            <h1 className="heading-1 text-foreground mb-6">{content.heading}</h1>
            <p className="body-large text-muted-foreground leading-9">{content.intro}</p>
          </div>
        </div>
      </section>

      {categoryProducts.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-secondary/30">
        <div className="container-custom max-w-4xl space-y-8">
          {content.sections.map((s) => (
            <article key={s.title} className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-soft">
              <h2 className="heading-3 text-foreground mb-3 flex items-center gap-3">
                <span className="w-8 h-1 bg-primary rounded-full" />
                {s.title}
              </h2>
              <p className="text-muted-foreground leading-9">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h2 className="heading-2 text-foreground text-center mb-8">پرسش‌های متداول درباره {content.name}</h2>
          <div className="space-y-3">
            {content.faq.map((f) => (
              <details key={f.question} className="group bg-card border border-border rounded-2xl p-5">
                <summary className="cursor-pointer font-bold text-foreground list-none flex justify-between items-center">
                  {f.question}
                  <span className="text-primary group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground leading-8">{f.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center bg-primary/10 rounded-3xl p-8">
            <p className="text-foreground font-bold mb-4">سؤالی درباره {content.name} دارید؟</p>
            <a
              href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp text-white px-6 py-3 rounded-xl font-bold"
            >
              <MessageCircle size={18} />
              مشاوره در واتساپ {brandConfig.brandName}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryPage;
