import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { brandConfig } from "@/config/brand";
import { useCspNonce } from "@/lib/security/csp";
import { resolveCanonicalUrl, serializeJsonLd } from "@/lib/security/seo";

export interface Crumb {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

const SAFE_CATEGORY_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const configuredOrigin =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || brandConfig.website;
const BREADCRUMB_ORIGIN = (() => {
  try {
    return new URL(configuredOrigin).origin;
  } catch {
    return new URL(brandConfig.website).origin;
  }
})();

export const normalizeBreadcrumbHref = (href?: string) => {
  if (!href) return undefined;

  try {
    const parsed = new URL(href, BREADCRUMB_ORIGIN);
    const category = parsed.searchParams.get("category");
    if (
      parsed.origin === BREADCRUMB_ORIGIN &&
      parsed.pathname === "/products" &&
      category &&
      SAFE_CATEGORY_SLUG.test(category)
    ) {
      return `/products/category/${encodeURIComponent(category)}`;
    }
  } catch {
    return href;
  }

  return href;
};

export const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  const nonce = useCspNonce();
  const normalizedItems = items.map((item) => ({
    ...item,
    href: normalizeBreadcrumbHref(item.href),
  }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: normalizedItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name.slice(0, 255),
      item: item.href
        ? resolveCanonicalUrl(item.href, BREADCRUMB_ORIGIN)
        : undefined,
    })),
  };

  return (
    <>
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />
      <nav
        aria-label="مسیر"
        className={`flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-sm text-muted-foreground ${className}`}
      >
        {normalizedItems.map((item, index) => {
          const isLast = index === normalizedItems.length - 1;
          const key = `${item.href || "current"}-${item.name}`;
          return (
            <span key={key} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={isLast ? "font-medium text-foreground" : ""}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
              {!isLast && (
                <ChevronLeft
                  size={14}
                  className="text-border"
                  aria-hidden="true"
                />
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
};
