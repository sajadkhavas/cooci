import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import { brandConfig, generatePhoneUrl } from "@/config/brand";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";
import {
  createLocationsCollectionSchema,
  getCityPagePath,
} from "@/lib/seo/local-seo";

const configuredOrigin =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || brandConfig.website;
const SITE_ORIGIN = (() => {
  try {
    return new URL(configuredOrigin).origin;
  } catch {
    return new URL(brandConfig.website).origin;
  }
})();

const LocationsPage = () => {
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const cities = loaderData?.cities ?? [];
  const title = "مناطق منتشرشده ارسال وینیمی";
  const description =
    "صفحه‌های رسمی و منتشرشده وینیمی برای بررسی شرایط سفارش و ارسال در هر شهر؛ محدوده و روش نهایی تحویل در Checkout تأیید می‌شود.";
  const schema = createLocationsCollectionSchema({
    siteOrigin: SITE_ORIGIN,
    cities,
    title,
    description,
  });

  return (
    <>
      <SEO
        title={title}
        description={description}
        url="/locations"
        schema={schema}
      />
      <section className="bg-gradient-to-b from-primary/8 to-background section-padding">
        <div className="container-custom max-w-5xl">
          <Breadcrumbs
            className="mb-8"
            items={[{ name: "خانه", href: "/" }, { name: "مناطق ارسال" }]}
          />
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <MapPin size={16} aria-hidden="true" />
              صفحات محلی مدیریت‌شده
            </span>
            <h1 className="heading-1 mb-5 text-foreground">{title}</h1>
            <p className="body-large leading-9 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <article
                key={city.id}
                className="flex min-w-0 flex-col rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-black text-primary">
                  <MapPin size={14} aria-hidden="true" />
                  {city.city}
                </span>
                <h2 className="text-xl font-black leading-8 text-foreground">
                  <Link
                    to={getCityPagePath(city.slug)}
                    className="rounded-md transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {city.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 leading-8 text-muted-foreground">
                  {city.description}
                </p>
                <Link
                  to={getCityPagePath(city.slug)}
                  className="mt-6 inline-flex min-h-11 items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground"
                >
                  مشاهده شرایط {city.city}
                  <ArrowLeft size={18} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/35 section-padding">
        <div className="container-custom max-w-5xl">
          <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-soft md:grid-cols-[1.2fr_0.8fr] md:p-9">
            <div>
              <h2 className="heading-2 mb-4">اطلاعات ثابت برند</h2>
              <p className="leading-8 text-muted-foreground">
                این اطلاعات برای شناسایی و ارتباط با {brandConfig.brandName} در همه
                صفحه‌ها یکسان است. وجود صفحه شهر به معنی وجود شعبه فیزیکی در آن شهر
                نیست.
              </p>
              <p className="mt-4 flex items-start gap-2 leading-8 text-muted-foreground">
                <MapPin className="mt-1 shrink-0 text-primary" size={18} aria-hidden="true" />
                {brandConfig.address}
              </p>
            </div>
            <div className="grid content-start gap-3">
              <a
                href={generatePhoneUrl()}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 font-bold text-primary"
                dir="ltr"
              >
                <Phone size={18} aria-hidden="true" />
                {brandConfig.phone}
              </a>
              <a
                href={`mailto:${brandConfig.email}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 font-bold text-primary"
                dir="ltr"
              >
                <Mail size={18} aria-hidden="true" />
                {brandConfig.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LocationsPage;
