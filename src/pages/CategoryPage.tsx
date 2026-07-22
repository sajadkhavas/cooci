import { AlertCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryShowcase } from "@/components/catalog/CategoryShowcase";
import { ProductGridSkeleton } from "@/components/catalog/ProductGridSkeleton";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import {
  brandConfig,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { getCategoryContent } from "@/data/categoriesContent";
import {
  useCatalogCategories,
  useCatalogProducts,
} from "@/hooks/useCatalog";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const content = slug ? getCategoryContent(slug) : undefined;
  const catalogCategorySlug = content?.productCategorySlug || slug;
  const { categories, isLoading: categoriesLoading } = useCatalogCategories();
  const category = categories.find(
    (candidate) => candidate.slug === catalogCategorySlug,
  );
  const { products, isLoading, error } = useCatalogProducts({
    category: catalogCategorySlug,
    search: content?.catalogSearch,
    perPage: 48,
    sort: "featured",
  });
  const name = content?.name || category?.name || "دسته‌بندی محصولات";
  const heading = content?.heading || category?.name || "محصولات وینیمی";
  const intro =
    content?.intro ||
    category?.description ||
    "محصولات فعال این دسته با قیمت، موجودی و گزینه‌های دریافت‌شده از کاتالوگ نمایش داده می‌شوند.";
  const seoTitle = content?.seoTitle || category?.name || "دسته‌بندی محصولات";
  const seoDescription =
    content?.seoDescription || category?.description || intro;

  if (!slug) {
    return (
      <section className="section-padding">
        <div className="container-custom text-center">
          <Link to="/categories" className="btn-primary inline-block rounded-xl px-6 py-3">
            مشاهده دسته‌بندی‌ها
          </Link>
        </div>
      </section>
    );
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name,
        headline: heading,
        description: seoDescription,
        url: `${brandConfig.website}/products/category/${encodeURIComponent(slug)}`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: `${brandConfig.website}/products/${encodeURIComponent(product.slug)}`,
          })),
        },
      },
      ...(content
        ? [
            {
              "@type": "FAQPage",
              mainEntity: content.faq.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        schema={collectionSchema}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/55 to-background pb-14 pt-10 sm:pb-20">
        <div className="soft-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="container-custom relative">
          <Breadcrumbs
            className="mb-8"
            items={[
              { name: "خانه", href: "/" },
              { name: "دسته‌بندی‌ها", href: "/categories" },
              { name },
            ]}
          />
          <div className="max-w-4xl">
            {content?.eyebrow && (
              <span className="editorial-label mb-5">{content.eyebrow}</span>
            )}
            <h1 className="heading-1 text-foreground">{heading}</h1>
            <p className="body-large mt-6 max-w-3xl leading-9 text-muted-foreground">
              {intro}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="btn-secondary inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-black"
              >
                همه محصولات
                <ArrowLeft size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-card px-6 font-black text-foreground shadow-soft"
              >
                دسته‌بندی‌های دیگر
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                Active catalogue
              </span>
              <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
                محصولات فعال {name}
              </h2>
            </div>
            {!isLoading && !error && products.length > 0 && (
              <span className="text-sm font-bold text-muted-foreground">
                {products.length.toLocaleString("fa-IR")} انتخاب در این صفحه
              </span>
            )}
          </div>

          {isLoading || categoriesLoading ? (
            <ProductGridSkeleton count={6} />
          ) : error ? (
            <div
              className="rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center"
              role="alert"
            >
              <AlertCircle
                className="mx-auto mb-4 text-destructive"
                size={48}
                aria-hidden="true"
              />
              <h2 className="heading-3 mb-3 text-foreground">
                محصولات این دسته دریافت نشد
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground">
                کاتالوگ موقتاً در دسترس نیست. کمی بعد دوباره تلاش کن یا از فهرست
                همه محصولات استفاده کن.
              </p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-soft">
              <span className="mb-4 block text-6xl" aria-hidden="true">
                🍪
              </span>
              <h2 className="heading-3 mb-3 text-foreground">
                محصول فعالی در این دسته پیدا نشد
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground">
                ممکن است موجودی یا انتشار محصولات این دسته تغییر کرده باشد. همه
                محصولات فعال را از فروشگاه ببین.
              </p>
              <Link
                to="/products"
                className="btn-primary mt-6 inline-flex rounded-xl px-6 py-3"
              >
                مشاهده فروشگاه
              </Link>
            </div>
          )}
        </div>
      </section>

      {content && (
        <>
          <section className="section-padding bg-secondary/30">
            <div className="container-custom max-w-5xl">
              <div className="grid gap-5 md:grid-cols-2">
                {content.sections.map((section) => (
                  <article
                    key={section.title}
                    className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-8"
                  >
                    <h2 className="heading-3 mb-3 flex items-center gap-3 text-foreground">
                      <span className="h-1 w-8 rounded-full bg-primary" />
                      {section.title}
                    </h2>
                    <p className="leading-9 text-muted-foreground">{section.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section-padding">
            <div className="container-custom max-w-4xl">
              <h2 className="heading-2 mb-8 text-center text-foreground">
                پرسش‌های متداول درباره {name}
              </h2>
              <div className="space-y-3">
                {content.faq.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-2xl border border-border bg-card p-5"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-foreground">
                      {faq.question}
                      <span className="text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 leading-8 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
              <div className="mt-10 rounded-3xl bg-primary/10 p-8 text-center">
                <p className="mb-4 font-bold text-foreground">
                  سؤال دیگری درباره {name} داری؟
                </p>
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

          <section className="section-padding pt-4">
            <div className="container-custom">
              <CategoryShowcase
                excludeSlug={slug}
                limit={3}
                compact
                title="بعد از این دسته، این مسیرها را هم ببین"
                description="اگر هنوز بین چند نوع محصول مردد هستی، از دسته‌های نزدیک ادامه بده."
              />
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default CategoryPage;
