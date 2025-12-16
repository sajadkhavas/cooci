import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { Product } from "@/data/products";
import { brandConfig, generateWhatsAppUrl, generateProductOrderMessage, generatePhoneUrl } from "@/config/brand";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const whatsappMessage = generateProductOrderMessage(product.name, product.productCode);

  return (
    <article className="group bg-card rounded-lg overflow-hidden shadow-card card-hover">
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden">
        {product.images[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <span className="text-6xl opacity-30">🍪</span>
          </div>
        )}
        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-wrap gap-2">
            {product.badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="badge-accent text-xs"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Code */}
        <span className="text-xs text-muted-foreground">
          کد: {product.productCode}
        </span>

        {/* Title */}
        <Link to={`/products/${product.slug}`}>
          <h3 className="heading-3 text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="body-small text-muted-foreground line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Price */}
        {product.price && (
          <p className="text-lg font-semibold text-primary">
            {product.price.toLocaleString("fa-IR")} تومان
          </p>
        )}

        {/* CTAs */}
        <div className="flex gap-2 pt-2">
          <a
            href={generateWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-whatsapp py-2 rounded-lg text-center text-sm font-medium"
          >
            سفارش واتساپ
          </a>
          <a
            href={generatePhoneUrl()}
            className="p-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="تماس تلفنی"
          >
            <Phone size={18} />
          </a>
        </div>
      </div>
    </article>
  );
};
