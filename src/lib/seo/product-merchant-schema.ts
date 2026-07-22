import type { Product } from "@/data/products";
import type { BackendReview } from "@/lib/backend-contract";
import {
  getProductRegularPrice,
  getProductSalePrice,
  getProductStock,
  getPublicProductDescription,
  getVariantDisplayPrice,
  isProductContentVerified,
  isProductInventoryVerified,
} from "@/lib/catalog";
import type { ProductReviewsResult } from "@/lib/content";
import { getPreferredProductVariant } from "@/lib/product-selection";
import { resolvePublicMediaUrl } from "@/lib/security/seo";

export type ProductMerchantSchema = Record<string, unknown>;

type MerchantProduct = Product & {
  mediaVerified?: boolean;
  inventoryVerified?: boolean;
  contentVerified?: boolean;
};

type MerchantVariant = NonNullable<Product["variants"]>[number] & {
  stock?: number;
  available?: boolean;
};

const isPositiveFinite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const isValidIsoDate = (value: string | null | undefined) =>
  Boolean(value && Number.isFinite(Date.parse(value)));

const normalizeOrigin = (value: string) => {
  try {
    return new URL(value).origin;
  } catch {
    return "https://winimibakery.com";
  }
};

const resolveVerifiedImages = (
  product: MerchantProduct,
  siteOrigin: string,
) => {
  if (!product.mediaVerified) return [];

  const origin = normalizeOrigin(siteOrigin);
  return product.images
    .map((image) => resolvePublicMediaUrl(image.url, origin))
    .filter((url, index, all) => url !== `${origin}/` && all.indexOf(url) === index)
    .slice(0, 10);
};

const createReviewSchema = (review: BackendReview) => {
  const author = review.customerName.trim();
  const body = review.body?.trim();
  const title = review.title?.trim();
  if (!author || (!body && !title)) return undefined;

  return {
    "@type": "Review",
    author: {
      "@type": "Person",
      name: author.slice(0, 160),
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    ...(title ? { name: title.slice(0, 255) } : {}),
    ...(body ? { reviewBody: body.slice(0, 10_000) } : {}),
    ...(isValidIsoDate(review.publishedAt)
      ? { datePublished: review.publishedAt }
      : {}),
  };
};

const createRatingSchema = (reviews?: ProductReviewsResult) => {
  if (!reviews) return {};
  const count = reviews.summary.count;
  const average = reviews.summary.averageRating;
  if (!Number.isInteger(count) || count <= 0 || average < 1 || average > 5) {
    return {};
  }

  const visibleReviews = reviews.reviews
    .map(createReviewSchema)
    .filter((review): review is NonNullable<typeof review> => Boolean(review));

  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(average.toFixed(2)),
      reviewCount: count,
      bestRating: 5,
      worstRating: 1,
    },
    ...(visibleReviews.length ? { review: visibleReviews } : {}),
  };
};

export const createProductMerchantSchema = ({
  product,
  reviews,
  siteOrigin,
  brandName,
}: {
  product: Product;
  reviews?: ProductReviewsResult;
  siteOrigin: string;
  brandName: string;
}): ProductMerchantSchema => {
  const merchantProduct = product as MerchantProduct;
  const origin = normalizeOrigin(siteOrigin);
  const productUrl = `${origin}/products/${encodeURIComponent(product.slug)}`;
  const preferredVariant = getPreferredProductVariant(product) as
    | MerchantVariant
    | undefined;
  const activePrice = preferredVariant
    ? getVariantDisplayPrice(preferredVariant)
    : getProductSalePrice(product) ?? getProductRegularPrice(product);
  const activeStock = getProductStock(product, preferredVariant?.id);
  const inventoryVerified = isProductInventoryVerified(product);
  const contentVerified = isProductContentVerified(product);
  const images = resolveVerifiedImages(merchantProduct, origin);
  const sku = preferredVariant?.productCode || product.productCode;
  const offer =
    inventoryVerified && isPositiveFinite(activePrice)
      ? {
          "@type": "Offer",
          url: productUrl,
          price: activePrice * 10,
          priceCurrency: "IRR",
          availability:
            activeStock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: brandName,
          },
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    url: productUrl,
    name: product.name,
    description: getPublicProductDescription(product),
    sku,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    ...(contentVerified && product.category
      ? { category: product.category }
      : {}),
    ...(preferredVariant?.name ? { model: preferredVariant.name } : {}),
    ...(preferredVariant?.weight
      ? { size: preferredVariant.weight }
      : {}),
    ...(images.length ? { image: images } : {}),
    ...(offer ? { offers: offer } : {}),
    ...createRatingSchema(reviews),
  };
};
