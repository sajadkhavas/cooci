import { AlertCircle, MessageCircle } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGridSkeleton } from "@/components/catalog/ProductGridSkeleton";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import {
  brandConfig,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { getCategoryContent } from "@/data/categoriesContent";
import { useCatalogProducts } from "@/hooks/useCatalog";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const content = slug ? getCategoryContent(slug) : undefined;
  const { products, isLoading, error } = useCatalogProducts();

  if (!content) return <Navigate to="/products" replace />;

  const categoryProducts = products.filter(
    (product) => product.categorySlug === content.productCategorySlug,
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
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
            <h1 className="heading-1 mb-6 text-foreground">{content.heading}</h1>
            <p className="body-large leading-9 text-muted-foreground">{content.intro}</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : error && products.length === 0 ? (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center" role="alert">
              <AlertCircle className="mx-auto mb-4 text-destructive" size={48} aria-hidden="true" />
              <h2 className="heading-3 mb-3 text-foreground">محصولات این دسته دریافت نشد</h2>
              <p className="text-muted-foreground">صفحه را دوباره بارگذاری کنید یا همه محصولات را مشاهده کنید.</p>
            </div>
          ) : categoryProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-soft">
              <span className="mb-4 block text-6xl" aria-hidden="true">🍪</span>
              <h2 className="heading-3 mb-3 text-foreground">محصول فعالی در این دسته نیست</h2>
              <p className="text-muted-foreground">محصولات جدید این دسته به‌زودی اضافه می‌شوند.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-custom max-w-4xl space-y-8">
          {content.sections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
              <h2 className="heading-3 mb-3 flex items-center gap-3 text-foreground">
                <span className="h-1 w-8 rounded-full bg-primary" />
                {section.title}
              </h2>
              <p className="leading-9 text-muted-foreground">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h2 className="heading-2 mb-8 text-center text-foreground">
            پرسش‌های متداول درباره {content.name}
          </h2>
          <div className="space-y-3">
            {content.faq.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-border bg-card p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-foreground">
                  {faq.question}
                  <span className="text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-8 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 rounded-3xl bg-primary/10 p-8 text-center">
            <p className="mb-4 font-bold text-foreground">سؤالی درباره {content.name} دارید؟</p>
            <a
              href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white"
            >
              <MessageCircle size={18} aria-hidden="true" />
              پشتیبانی واتساپ {brandConfig.brandName}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryPage;
