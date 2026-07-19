import {
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import {
  brandConfig,
  generatePhoneUrl,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { getCityBySlug } from "@/data/cities";
import { useCatalogProducts } from "@/hooks/useCatalog";
import NotFoundPage from "@/pages/NotFoundPage";

const CityPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : undefined;
  const { products, isLoading, error } = useCatalogProducts();

  if (!city) return <NotFoundPage />;

  const featured = products
    .filter((product) => product.isFeatured)
    .slice(0, 6);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `ارسال محصولات ${brandConfig.brandName} به ${city.name}`,
        serviceType: "فروش و ارسال محصولات بیکری",
        provider: {
          "@type": "Bakery",
          name: brandConfig.brandName,
          url: brandConfig.website,
          telephone: brandConfig.phone,
          address: {
            "@type": "PostalAddress",
            addressLocality: brandConfig.city,
            addressRegion: brandConfig.region,
            addressCountry: "IR",
          },
        },
        areaServed: {
          "@type": "City",
          name: city.name,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: city.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <SEO
        title={city.seoTitle}
        description={city.seoDescription}
        schema={schema}
      />

      <section className="section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="container-custom">
          <Breadcrumbs
            className="mb-8"
            items={[
              { name: "خانه", href: "/" },
              { name: "محصولات", href: "/products" },
              { name: city.name },
            ]}
          />

          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <MapPin size={16} aria-hidden="true" />
              خرید و ارسال به {city.name}
            </div>
            <h1 className="heading-1 mb-6 text-foreground">{city.heading}</h1>
            <p className="body-large mb-8 max-w-3xl leading-9 text-muted-foreground">
              {city.intro}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <Clock className="mb-3 text-primary" size={22} aria-hidden="true" />
                <p className="font-bold text-foreground">{city.deliveryTime}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {city.deliveryScope}
                </p>
              </div>
              <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-soft">
                <ShoppingCart className="mb-3" size={22} aria-hidden="true" />
                <p className="mb-2 font-bold">سفارش از مسیر آنلاین سایت</p>
                <p className="mb-4 text-sm leading-7 text-primary-foreground/75">
                  محصول را انتخاب کنید و شهر و روش تحویل را در Checkout ثبت کنید.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/products"
                    className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary"
                  >
                    مشاهده محصولات
                  </Link>
                  <Link
                    to="/cart"
                    className="rounded-xl border border-white/25 px-4 py-2 text-sm font-bold text-white"
                  >
                    سبد خرید
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-custom max-w-4xl">
          <h2 className="heading-2 mb-7 text-foreground">
            خرید از {brandConfig.brandName} برای {city.name}
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {city.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex gap-3 rounded-2xl border border-border bg-card p-4 leading-8 text-foreground"
              >
                <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-primary" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h2 className="heading-2 text-foreground">
              انتخاب‌های محبوب برای {city.name}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              موجودی و امکان ارسال هر محصول را در صفحه جزئیات بررسی کنید.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="aspect-[4/3] animate-pulse bg-muted" />
                  <div className="space-y-3 p-5">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              <Truck className="mx-auto mb-4 text-primary" size={46} aria-hidden="true" />
              <p className="font-bold text-foreground">محصول منتخب فعالی وجود ندارد</p>
              <Link to="/products" className="mt-5 inline-block font-bold text-primary hover:underline">
                مشاهده همه محصولات
              </Link>
            </div>
          )}

          {error && (
            <p className="mt-5 text-center text-sm text-amber-800" role="status">
              نسخه داخلی محصولات نمایش داده شده است.
            </p>
          )}
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-custom max-w-3xl">
          <h2 className="heading-2 mb-8 text-center text-foreground">
            سؤالات متداول {city.name}
          </h2>
          <div className="space-y-3">
            {city.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-border bg-card p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-foreground">
                  {item.question}
                  <span className="text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-8 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white"
            >
              <MessageCircle size={18} aria-hidden="true" />
              سؤال از پشتیبانی
            </a>
            <a
              href={generatePhoneUrl()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary px-6 py-3 font-bold text-primary"
            >
              <Phone size={18} aria-hidden="true" />
              {brandConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default CityPage;
