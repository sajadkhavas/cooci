import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";
import { brandConfig } from "@/config/brand";

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
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href ? `${brandConfig.website}${item.href}` : undefined,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <nav aria-label="مسیر" className={`flex items-center gap-1.5 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap ${className}`}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link to={item.href} className="hover:text-primary transition-colors">{item.name}</Link>
              ) : (
                <span className={isLast ? "text-foreground font-medium" : ""}>{item.name}</span>
              )}
              {!isLast && <ChevronLeft size={14} className="text-border" />}
            </span>
          );
        })}
      </nav>
    </>
  );
};
