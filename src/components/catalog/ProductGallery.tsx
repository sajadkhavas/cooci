import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

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
    <section className="min-w-0 space-y-4" aria-label={`گالری تصاویر ${product.name}`}>
      <div
        id={`product-image-panel-${product.id}`}
        role="tabpanel"
        aria-label={`تصویر ${activeImageIndex + 1} از ${product.images.length || 1}`}
        className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-muted shadow-2xl"
      >
        {activeImage?.url ? (
          <img
            src={activeImage.url}
            alt={activeImage.alt || product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            loading="eager"
            decoding="async"
            width={900}
            height={900}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 text-center text-muted-foreground">
            <ImageIcon size={56} aria-hidden="true" />
            <span>تصویر محصول ثبت نشده است</span>
          </div>
        )}
      </div>

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
                className={`h-20 w-20 shrink-0 snap-start overflow-hidden rounded-xl border-2 bg-secondary transition duration-200 md:h-24 md:w-24 ${
                  isActive
                    ? "border-primary shadow-md ring-2 ring-primary/20"
                    : "border-transparent opacity-70 hover:border-primary/50 hover:opacity-100"
                }`}
              >
                <img
                  src={image.url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
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
