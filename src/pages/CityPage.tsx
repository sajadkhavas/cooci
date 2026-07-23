import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingCart,
} from "lucide-react";
import { Link, useLoaderData, useParams } from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StructuredText } from "@/components/content/StructuredText";
import { ProductCard } from "@/components/ProductCard";
import { SEO } from "@/components/SEO";
import {
  brandConfig,
  generatePhoneUrl,
  generateWhatsAppUrl,
  SUPPORT_WHATSAPP_MESSAGE,
} from "@/config/brand";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { ApiError, isBackendEnabled } from "@/lib/api";
import { loadCityPage } from "@/lib/content";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";
import {
  createCityLocalServiceSchema,
  getCityPagePath,
} from "@/lib/seo/local-seo";
import NotFoundPage from "@/pages/NotFoundPage";

const configuredOrigin =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || brandConfig.website;
const SITE_ORIGIN = (() => {
  try {
    return new URL(configuredOrigin).origin;
  } catch {
    return new URL(brandConfig.website).origin;
  }
})();

const CityPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const initialCity = loaderData?.city?.slug === slug ? loaderData.city : undefined;
  const cityQuery = useQuery({
    queryKey: ["store", "city", slug],
    queryFn: () => loadCityPage(slug as string),
    enabled: isBackendEnabled && Boolean(slug),
    initialData: isBackendEnabled ? initialCity : undefined,
    staleTime: 5 * 60_000,
  });
  const catalog = useCatalogProducts({ featured: true, perPage: 6 });

  if (cityQuery.error instanceof ApiError && cityQuery.error.status === 404) {
    return <NotFoundPage />;
  }
  if (cityQuery.isLoading) {
    return (
      <section className="section-padding">
        <div className="container-custom text-center" role="status">
          <Loader2 className="mx-auto mb-3 animate-spin text-primary" aria-hidden="true" />
          در حال دریافت صفحه شهر…
        </div>
      </section>
    );
  }
  if (cityQuery.error || !cityQuery.data) {
    return (
      <section className="section-padding">
        <div
          className="container-custom rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive"
          role="alert"
        >
          {cityQuery.error instanceof Error
            ? cityQuery.error.message
            : "صفحه شهر دریافت نشد."}
        </div>
      </section>
    );
  }

  const city = cityQuery.data;
  const cityPath = getCityPagePath(city.slug);
  const schema = createCityLocalServiceSchema({
    siteOrigin: SITE_ORIGIN,
    city,
  });

  return (
    <>
      <SEO
        title={city.seo.title || city.title}
        description={city.seo.description || city.description}
        url={cityPath}
        schema={schema}
      />
      <section className="bg-gradient-to-b from-primary/5 to-background section-padding">
        <div className="container-custom">
          <Breadcrumbs
            className="mb-8"
            items={[
              { name: "خانه", href: "/" },
              { name: "مناطق ارسال", href: "/locations" },
              { name: city.city },
            ]}
          />
          <div className="max-w-4xl">
            <Link
              to="/locations"
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary"
            >
              <ArrowRight size={16} aria-hidden="true" />
              همه مناطق منتشرشده
            </Link>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <MapPin size={16} aria-hidden="true" />
              خرید و ارسال به {city.city}
            </div>
            <h1 className="heading-1 mb-6">{city.title}</h1>
            <p className="body-large mb-8 max-w-3xl leading-9 text-muted-foreground">
              {city.description}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3"
              >
                <ShoppingCart size={18} aria-hidden="true" />
                مشاهده محصولات
              </Link>
              <a
                href={generateWhatsAppUrl(SUPPORT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-bold text-white"
              >
                <MessageCircle size={18} aria-hidden="true" />
                سؤال از پشتیبانی
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 section-padding">
        <div className="container-custom grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.36fr]">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-9">
            <StructuredText content={city.content} />
          </div>
          <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-black">هویت و ارتباط برند</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              این صفحه محدوده خدمت‌رسانی را معرفی می‌کند و به معنی وجود شعبه فیزیکی
              {` ${brandConfig.brandName} `}
              در {city.city} نیست.
            </p>
            <p className="mt-5 flex items-start gap-2 text-sm leading-7 text-muted-foreground">
              <MapPin className="mt-1 shrink-0 text-primary" size={17} aria-hidden="true" />
              {brandConfig.address}
            </p>
            <a
              href={generatePhoneUrl()}
              className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 font-bold text-primary"
              dir="ltr"
            >
              <Phone size={17} aria-hidden="true" />
              {brandConfig.phone}
            </a>
            <a
              href={`mailto:${brandConfig.email}`}
              className="mt-3 flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-primary"
              dir="ltr"
            >
              <Mail size={17} aria-hidden="true" />
              {brandConfig.email}
            </a>
          </aside>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-2 mb-10 text-center">محصولات منتخب</h2>
          {catalog.isLoading ? (
            <div className="py-10 text-center">در حال دریافت محصولات…</div>
          ) : catalog.products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              محصول منتخبی موجود نیست.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CityPage;
