import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useLoaderData } from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StructuredText } from "@/components/content/StructuredText";
import { SEO } from "@/components/SEO";
import { ApiError, isBackendEnabled } from "@/lib/api";
import { loadContentPage } from "@/lib/content";
import { formatPersianUtcDate } from "@/lib/format-persian-date";
import type { PublicSsrLoaderData } from "@/lib/public-ssr";
import NotFoundPage from "@/pages/NotFoundPage";

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
          <Loader2
            className="mx-auto mb-4 animate-spin text-primary"
            size={42}
            aria-hidden="true"
          />
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
  return (
    <>
      <SEO
        title={page.seo.title || page.title || fallbackTitle}
        description={page.seo.description || page.excerpt || fallbackDescription}
        url={canonicalPath}
        schema={schema}
      />
      <section className="bg-gradient-to-b from-secondary/40 to-background section-padding">
        <div className="container-custom max-w-4xl">
          <Breadcrumbs
            className="mb-8"
            items={[{ name: "خانه", href: "/" }, { name: page.title }]}
          />
          <h1 className="heading-1 mb-5 text-foreground">{page.title}</h1>
          {page.excerpt && (
            <p className="body-large max-w-3xl leading-9 text-muted-foreground">
              {page.excerpt}
            </p>
          )}
        </div>
      </section>
      <section className="section-padding">
        <article className="container-custom max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8 md:p-10">
          <StructuredText content={page.content} />
          {publishedDate && (
            <p className="mt-10 border-t border-border pt-5 text-xs text-muted-foreground">
              تاریخ انتشار: {publishedDate}
            </p>
          )}
        </article>
      </section>
    </>
  );
};
