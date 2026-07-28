import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  FileText,
  Headphones,
  ShoppingBag,
} from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  extractStructuredHeadings,
  StructuredText,
} from "@/components/content/StructuredText";
import { SEO } from "@/components/SEO";
import { brandConfig } from "@/config/brand";
import { ApiError, isBackendEnabled } from "@/lib/api";
import { loadContentPage } from "@/lib/content";
import { formatPersianUtcDate } from "@/lib/format-persian-date";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";
import NotFoundPage from "@/pages/NotFoundPage";

const pageLabels: Record<string, string> = {
  about: "آشنایی با وینیمی",
  quality: "راهنمای کیفیت و نگهداری",
  privacy: "سیاست حفاظت از اطلاعات",
  terms: "چارچوب استفاده و سفارش",
  shipping: "راهنمای ارسال و تحویل",
};

export const ManagedContentPage = ({
  slug,
  fallbackTitle,
  fallbackDescription,
  canonicalPath,
  schema,
}: {
  slug: string;
  fallbackTitle: string;
  fallbackDescription: string;
  canonicalPath?: string;
  schema?: object | object[];
}) => {
  const loaderData = useLoaderData() as PublicSsrLoaderData | undefined;
  const initialContentPage =
    loaderData?.contentPage?.slug === slug ? loaderData.contentPage : undefined;
  const query = useQuery({
    queryKey: ["store", "page", slug],
    queryFn: () => loadContentPage(slug),
    enabled: isBackendEnabled,
    initialData: isBackendEnabled ? initialContentPage : undefined,
    staleTime: 5 * 60_000,
  });

  if (query.error instanceof ApiError && query.error.status === 404) {
    return <NotFoundPage />;
  }
  if (!isBackendEnabled) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-3xl rounded-3xl border border-border bg-card p-10 text-center">
          منبع محتوای مدیریت‌شده بک‌اند فعال نیست.
        </div>
      </section>
    );
  }
  if (query.isLoading) {
    return (
      <section className="section-padding">
        <div
          className="container-custom max-w-3xl py-16 text-center"
          role="status"
        >
          <span className="mx-auto mb-4 block h-11 w-11 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          در حال دریافت محتوا…
        </div>
      </section>
    );
  }
  if (query.error || !query.data) {
    return (
      <section className="section-padding">
        <div
          className="container-custom max-w-3xl rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center text-destructive"
          role="alert"
        >
          {query.error instanceof Error
            ? query.error.message
            : "محتوای صفحه دریافت نشد."}
        </div>
      </section>
    );
  }

  const page = query.data;
  const publishedDate = formatPersianUtcDate(page.publishedAt);
  const headings = extractStructuredHeadings(page.content);
  const pagePath = canonicalPath || `/${slug}`;
  const pageDescription =
    page.seo.description || page.excerpt || fallbackDescription;
  const pageUrl = new URL(pagePath, brandConfig.website).toString();
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title || fallbackTitle,
    description: pageDescription,
    url: pageUrl,
    inLanguage: "fa-IR",
    datePublished: page.publishedAt || undefined,
    isPartOf: {
      "@type": "WebSite",
      name: brandConfig.brandName,
      url: brandConfig.website,
    },
  };
  const resolvedSchema = schema
    ? [webPageSchema, ...(Array.isArray(schema) ? schema : [schema])]
    : webPageSchema;

  return (
    <>
      <SEO
        title={page.seo.title || page.title || fallbackTitle}
        description={pageDescription}
        url={pagePath}
        schema={resolvedSchema}
      />

      <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-secondary/70 via-background to-background section-padding">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <span className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <span className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container-custom relative max-w-6xl">
          <Breadcrumbs
            className="mb-8"
            items={[{ name: "خانه", href: "/" }, { name: page.title }]}
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
            <div className="max-w-4xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-black text-primary">
                <FileText size={16} aria-hidden="true" />
                {pageLabels[slug] || "اطلاعات رسمی وینیمی"}
              </span>
              <h1 className="heading-1 max-w-4xl text-balance text-foreground">
                {page.title}
              </h1>
              {page.excerpt && (
                <p className="body-large mt-6 max-w-3xl leading-9 text-muted-foreground">
                  {page.excerpt}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-soft backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                خلاصه صفحه
              </p>
              <dl className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">بخش‌های اصلی</dt>
                  <dd className="font-black text-foreground">
                    {headings.length.toLocaleString("fa-IR")}
                  </dd>
                </div>
                {publishedDate && (
                  <div className="flex items-start justify-between gap-4 border-t border-border pt-4">
                    <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays size={16} aria-hidden="true" />
                      تاریخ انتشار
                    </dt>
                    <dd className="text-left text-sm font-bold text-foreground">
                      {publishedDate}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom grid max-w-6xl items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <article className="min-w-0 overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft">
            <header className="border-b border-border bg-secondary/25 px-6 py-5 sm:px-8 md:px-10">
              <p className="text-sm font-black text-foreground">
                متن کامل و اطلاعات منتشرشده
              </p>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">
                برای دسترسی سریع‌تر، از فهرست بخش‌های صفحه استفاده کنید.
              </p>
            </header>

            <div className="px-6 py-8 sm:px-8 md:px-10 md:py-10">
              <StructuredText content={page.content} />
            </div>

            {publishedDate && (
              <footer className="border-t border-border bg-secondary/20 px-6 py-5 text-xs text-muted-foreground sm:px-8 md:px-10">
                این نسخه در تاریخ {publishedDate} منتشر شده است.
              </footer>
            )}
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28">
            {headings.length > 0 && (
              <nav
                aria-label="فهرست بخش‌های صفحه"
                className="rounded-3xl border border-border bg-card p-5 shadow-soft"
              >
                <h2 className="flex items-center gap-2 text-base font-black text-foreground">
                  <FileText size={18} className="text-primary" aria-hidden="true" />
                  در این صفحه
                </h2>
                <ol className="mt-5 space-y-1.5 border-r border-border pr-4">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className={`block rounded-lg px-3 py-2 text-sm leading-7 transition hover:bg-secondary hover:text-primary ${
                          heading.level === 3
                            ? "mr-3 text-muted-foreground"
                            : "font-bold text-foreground/80"
                        }`}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
              <h2 className="text-base font-black text-foreground">
                مسیرهای مرتبط
              </h2>
              <div className="mt-4 grid gap-3">
                <Link
                  to="/products"
                  className="flex min-h-11 items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-black text-primary-foreground"
                >
                  <ShoppingBag size={17} aria-hidden="true" />
                  مشاهده محصولات
                </Link>
                <Link
                  to="/contact"
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-black text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  <Headphones size={17} aria-hidden="true" />
                  تماس با پشتیبانی
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-custom max-w-6xl">
          <div className="overflow-hidden rounded-[2rem] bg-primary px-6 py-8 text-primary-foreground shadow-soft sm:px-9 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h2 className="text-2xl font-black leading-10">
                درباره محصولات یا شرایط سفارش سؤال دارید؟
              </h2>
              <p className="mt-2 max-w-2xl leading-8 text-primary-foreground/75">
                اطلاعات نهایی هر محصول و وضعیت سفارش را پیش از ثبت درخواست بررسی
                کنید.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0 md:shrink-0">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary-foreground px-6 py-3 font-black text-primary"
              >
                ارتباط با وینیمی
              </Link>
              <Link
                to="/products"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/25 px-6 py-3 font-black text-primary-foreground transition hover:bg-primary-foreground/10"
              >
                ورود به فروشگاه
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
