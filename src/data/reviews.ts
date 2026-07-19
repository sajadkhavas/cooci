export interface Review {
  id: string;
  displayName: string;
  city?: string;
  rating: number;
  text: string;
  product?: string;
  submittedAt: string;
  source: "verified-order" | "manual-verification";
  isPublished: boolean;
}

/**
 * Public reviews must come from a verified order or a manually verified source.
 * Static sample testimonials are intentionally not shipped in production.
 */
export const reviews: Review[] = [];

export const publishedReviews = reviews.filter(
  (review) => review.isPublished && review.rating >= 1 && review.rating <= 5,
);

export const averageRating = publishedReviews.length
  ? publishedReviews.reduce((sum, review) => sum + review.rating, 0) /
    publishedReviews.length
  : null;
