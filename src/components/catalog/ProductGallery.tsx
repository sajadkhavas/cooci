import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { OptimizedImage } from "@/components/media/OptimizedImage";
import type { Product } from "@/data/products";
import { isProductMediaVerified } from "@/lib/catalog";

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mediaVerified = isProductMediaVerified(product);

  useEffect(() => {
    setActiveImageIndex(0);
    thumbnailRefs.current = [];
  }, [product.id]);

  const activeImage = product.images[activeImageIndex] ?? product.images[0];

  const selectImage = (index: number, focus = false) => {
    setActiveImageIndex(index);
    if (focus) thumbnailRefs.current[index]?.focus();
  };

  const handleThumbnailKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const lastIndex = product.images.length - 1;
    let nextIndex: number | undefined;

    if (event.key === "ArrowLeft") nextIndex = Math.min(index + 1, lastIndex);
    if (event.key === "ArrowRight") nextIndex = Math.max(index - 1, 0);
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;

    if (nextIndex === undefined || nextIndex === index) return;
    event.preventDefault();
    selectImage(nextIndex, true);
  };

  return (
    <section
      className="min-w-0 space-y-4"
      aria-label={`گالری تصاویر ${product.name}`}
    >
      <figure className="media-frame overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div
          id={`product-image-panel-${product.id}`}
          role="tabpanel"
          aria-label={`تصویر ${activeImageIndex + 1} از ${product.images.length || 1}`}
          className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-muted"
        >
          {activeImage?.url ? (
            <OptimizedImage
              src={activeImage.url}
              alt={activeImage.alt || product.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              width={900}
              height={900}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 text-center text-muted-foreground">
              <ImageIcon size={56} aria-hidden="true" />
              <span>تصویر محصول ثبت نشده است</span>
            </div>
          )}

          {!mediaVerified && activeImage?.url && (
            <span className="absolute bottom-4 left-4 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold text-white">
              تصویر نمایشی کاتالوگ
            </span>
          )}
        </div>

        {!mediaVerified && (
          <figcaption className="border-t border-border px-4 py-3 text-center text-xs leading-6 text-muted-foreground">
            این رسانه هنوز به‌عنوان تصویر تأییدشده همان محصول علامت‌گذاری نشده و ممکن است با سفارش نهایی تفاوت داشته باشد.
          </figcaption>
        )}
      </figure>

      {product.images.length > 1 && (
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 pt-1"
          role="tablist"
          aria-label="انتخاب تصویر محصول"
        >
          {product.images.map((image, index) => {
            const isActive = index === activeImageIndex;

            return (
              <button
                ref={(element) => {
                  thumbnailRefs.current[index] = element;
                }}
                key={`${image.url}-${index}`}
                type="button"
                role="tab"
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectImage(index)}
                onKeyDown={(event) => handleThumbnailKeyDown(event, index)}
                aria-label={`نمایش تصویر ${index + 1} از ${product.images.length}`}
                aria-selected={isActive}
                aria-controls={`product-image-panel-${product.id}`}
                className={`media-frame h-20 w-20 shrink-0 snap-start overflow-hidden rounded-xl border-2 bg-secondary transition duration-200 md:h-24 md:w-24 ${
                  isActive
                    ? "border-primary shadow-md ring-2 ring-primary/20"
                    : "border-transparent opacity-70 hover:border-primary/50 hover:opacity-100"
                }`}
              >
                <OptimizedImage
                  src={image.url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  fetchPriority="low"
                  sizes="96px"
                  width={160}
                  height={160}
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
