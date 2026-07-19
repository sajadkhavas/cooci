import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product.id]);

  const activeImage = product.images[activeImageIndex] ?? product.images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-muted shadow-2xl">
        {activeImage?.url ? (
          <img
            src={activeImage.url}
            alt={activeImage.alt || product.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
            loading="eager"
            decoding="async"
            width={900}
            height={900}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <ImageIcon size={56} aria-hidden="true" />
            <span>تصویر محصول ثبت نشده است</span>
          </div>
        )}
      </div>

      {product.images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2" aria-label="تصاویر محصول">
          {product.images.map((image, index) => {
            const isActive = index === activeImageIndex;

            return (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                aria-label={`نمایش تصویر ${index + 1} از ${product.images.length}`}
                aria-pressed={isActive}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-secondary transition-all md:h-24 md:w-24 ${
                  isActive
                    ? "border-primary shadow-md ring-2 ring-primary/20"
                    : "border-transparent opacity-70 hover:border-primary/50 hover:opacity-100"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt || `${product.name} - تصویر ${index + 1}`}
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
    </div>
  );
};
