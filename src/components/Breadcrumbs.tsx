import { Helmet } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { brandConfig } from "@/config/brand";
import { resolveCanonicalUrl, serializeJsonLd } from "@/lib/security/seo";

export interface Crumb {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

export const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name.slice(0, 255),
      item: item.href
        ? resolveCanonicalUrl(item.href, brandConfig.website)
        : undefined,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{serializeJsonLd(schema)}</script>
      </Helmet>
      <nav
        aria-label="مسیر"
        className={`flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-sm text-muted-foreground ${className}`}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
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
