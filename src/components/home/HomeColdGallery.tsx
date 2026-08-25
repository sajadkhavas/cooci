import {
  ArrowLeft,
  ArrowRight,
  Box,
  CheckCircle2,
  Snowflake,
} from "lucide-react";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Link } from "react-router";
import { OptimizedImage } from "@/components/media/OptimizedImage";
import { formatToman } from "@/config/brand";
import type { Product } from "@/data/products";
import {
  getProductDisplayPrice,
  getProductStock,
  getPublicProductSummary,
  getStockPresentation,
  isProductInventoryVerified,
  isProductMediaVerified,
} from "@/lib/catalog";
import { selectColdGalleryProducts } from "@/lib/home-cold-gallery";

interface HomeColdGalleryProps {
  products: Product[];
}

const SWIPE_THRESHOLD = 48;

export const HomeColdGallery = ({ products }: HomeColdGalleryProps) => {
  const galleryProducts = useMemo(
    () => selectColdGalleryProducts(products),
    [products],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);
  const suppressNextClick = useRef(false);
  const activeProduct = galleryProducts[activeIndex];

  const selectIndex = useCallback(
    (index: number) => {
      if (!galleryProducts.length) return;
      setActiveIndex(
        (index + galleryProducts.length) % galleryProducts.length,
      );
    },
    [galleryProducts.length],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectIndex(activeIndex + 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectIndex(activeIndex - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectIndex(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectIndex(galleryProducts.length - 1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    pointerStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    suppressNextClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const start = pointerStart.current;
    if (!start || start.pointerId !== event.pointerId) return;

    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;
    pointerStart.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (
      Math.abs(distanceX) < SWIPE_THRESHOLD ||
      Math.abs(distanceX) <= Math.abs(distanceY) * 1.15
    ) return;

    suppressNextClick.current = true;
    selectIndex(activeIndex + (distanceX < 0 ? 1 : -1));
  };

  if (!activeProduct) return null;

  const displayPrice = getProductDisplayPrice(activeProduct);
  const stock = getProductStock(activeProduct);
  const stockPresentation = getStockPresentation(
    stock,
    isProductInventoryVerified(activeProduct),
  );
  const mediaVerified = isProductMediaVerified(activeProduct);
  const image = mediaVerified ? activeProduct.images[0] : undefined;
  const nextProducts = [1, 2]
    .map((offset) => galleryProducts[(activeIndex + offset) % galleryProducts.length])
    .filter((product, index, list): product is Product =>
      Boolean(product && list.findIndex((item) => item?.id === product.id) === index),
    );

  return (
    <section
      className="cold-gallery-shell relative overflow-hidden border-y border-[#9eb9a5]/25 py-14 sm:py-18 lg:py-24"
      aria-labelledby="home-cold-gallery-heading"
    >
      <div className="cold-gallery-frost pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#cce3d8]/35 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-20 bottom-8 h-64 w-64 rounded-full bg-[#dceab8]/30 blur-3xl" aria-hidden="true" />

      <div className="container-custom relative">
        <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#94ad87]/35 bg-white/72 px-4 py-2 text-xs font-black text-[#557044] shadow-[0_12px_35px_-25px_rgba(37,69,52,0.65)] backdrop-blur-xl">
            <Snowflake size={15} aria-hidden="true" />
            دسرهای سرد، آماده برای لحظه‌های خاص
          </span>
          <h2
            id="home-cold-gallery-heading"
            className="mt-4 text-3xl font-black leading-tight tracking-[-0.035em] text-[#254535] sm:text-5xl"
          >
            تازه از یخچال وینیمی
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5d7167] sm:text-base">
            انتخاب‌های یخچالی را با تصویر، قیمت و وضعیت سفارش ببین؛ جزئیات نهایی هر
            محصول در صفحه خودش در دسترس است.
          </p>
        </header>

        <div
          className="group/cold-gallery relative touch-pan-y select-none outline-none"
          role="region"
          aria-roledescription="carousel"
          aria-label="محصولات یخچالی وینیمی"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { pointerStart.current = null; }}
          onClickCapture={(event) => {
            if (!suppressNextClick.current) return;
            event.preventDefault();
            event.stopPropagation();
            suppressNextClick.current = false;
          }}
        >
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {`محصول ${activeIndex + 1} از ${galleryProducts.length}: ${activeProduct.name}`}
          </p>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_10.5rem] lg:gap-4">
            <article className="cold-gallery-stage relative isolate overflow-hidden rounded-[2rem] border border-white/65 bg-[#e5eee8] shadow-[0_42px_100px_-45px_rgba(31,66,50,0.72)] sm:rounded-[2.75rem] lg:min-h-[42rem]">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#dbe6df] sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
                {image?.url ? (
                  <OptimizedImage
                    key={`${activeProduct.id}-${image.url}`}
                    src={image.url}
                    alt={image.alt || activeProduct.name}
                    className="cold-gallery-image absolute inset-0 h-full w-full object-cover"
                    loading={activeIndex === 0 ? "eager" : "lazy"}
                    fetchPriority={activeIndex === 0 ? "high" : "low"}
                    sizes="(min-width: 1024px) 72vw, 100vw"
                    width={1400}
                    height={1050}
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.9),transparent_38%),linear-gradient(145deg,#dce8e1,#f8faf4)] text-center text-[#557263]">
                    <span className="grid gap-3 px-6 text-xs font-black">
                      <Snowflake className="mx-auto" size={34} aria-hidden="true" />
                      تصویر واقعی محصول پس از تأیید رسانه نمایش داده می‌شود
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#102b20]/25 via-transparent to-white/5 lg:bg-[linear-gradient(90deg,rgba(13,32,25,0.05)_0%,rgba(13,32,25,0.08)_48%,rgba(11,28,22,0.72)_100%)]" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40" aria-hidden="true" />
              </div>

              <div className="relative z-10 mx-3 -mt-5 mb-3 rounded-[1.5rem] border border-[#b9cbbf]/55 bg-[#f9fbf6] p-5 text-[#254535] shadow-[0_24px_70px_-35px_rgba(14,38,28,0.75)] sm:mx-5 sm:-mt-8 sm:mb-5 sm:p-6 lg:absolute lg:bottom-8 lg:right-8 lg:top-8 lg:m-0 lg:w-[22rem] lg:border-white/35 lg:bg-[#f9fbf6]/94 lg:p-7 lg:backdrop-blur-2xl">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#91aa83]/35 bg-white/70 px-3 py-1 text-[10px] font-black text-[#5f7750]">
                    {activeProduct.category}
                  </span>
                  <span className="text-xs font-black tabular-nums text-[#698078]">
                    {(activeIndex + 1).toLocaleString("fa-IR")} / {galleryProducts.length.toLocaleString("fa-IR")}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
                  {activeProduct.name}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#60736a] lg:line-clamp-3">
                  {getPublicProductSummary(activeProduct)}
                </p>

                <div className="mt-5 grid gap-2 text-xs font-bold text-[#52675d]">
                  <span className="flex min-h-10 items-center gap-2 rounded-xl border border-[#aac0b1]/35 bg-white/58 px-3">
                    <Snowflake size={16} className="text-[#537b6d]" aria-hidden="true" />
                    نیازمند نگهداری سرد
                  </span>
                  {activeProduct.weight && (
                    <span className="flex min-h-10 items-center gap-2 rounded-xl border border-[#aac0b1]/35 bg-white/58 px-3">
                      <Box size={16} className="text-[#537b6d]" aria-hidden="true" />
                      {activeProduct.weight}
                    </span>
                  )}
                  <span className="flex min-h-10 items-center gap-2 rounded-xl border border-[#aac0b1]/35 bg-white/58 px-3">
                    <CheckCircle2 size={16} className="text-[#537b6d]" aria-hidden="true" />
                    <span className="line-clamp-1">{stockPresentation.label}</span>
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-[#9fb5a8]/30 pt-5 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch">
                  <p className="font-black text-[#254535]">
                    {displayPrice ? formatToman(displayPrice) : "قیمت پس از استعلام"}
                  </p>
                  <Link
                    to={`/products/${encodeURIComponent(activeProduct.slug)}`}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c96d58] px-6 text-sm font-black text-white shadow-[0_14px_30px_-18px_rgba(138,59,43,0.9)] transition hover:-translate-y-0.5 hover:bg-[#b95d49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#254535] focus-visible:ring-offset-2"
                  >
                    مشاهده محصول
                    <ArrowLeft size={17} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>

            {galleryProducts.length > 1 && (
              <div className="hidden gap-3 lg:grid lg:grid-rows-2" aria-label="پیش‌نمایش محصولات بعدی">
                {nextProducts.map((product, index) => {
                  const targetIndex = galleryProducts.findIndex((item) => item.id === product.id);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => selectIndex(targetIndex)}
                      className="group/peek relative min-h-0 overflow-hidden rounded-[1.75rem] border border-white/60 bg-[#dbe6df] shadow-[0_24px_55px_-35px_rgba(31,66,50,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557b68] focus-visible:ring-offset-2"
                      aria-label={`${index === 0 ? "محصول بعدی" : "محصول پس از آن"}: ${product.name}`}
                    >
                      {isProductMediaVerified(product) && product.images[0]?.url ? (
                        <OptimizedImage
                          src={product.images[0].url}
                          alt=""
                          className="h-full w-full object-cover transition duration-700 group-hover/peek:scale-105"
                          loading="lazy"
                          fetchPriority="low"
                          sizes="168px"
                          width={336}
                          height={520}
                        />
                      ) : (
                        <span className="absolute inset-0 grid place-items-center bg-[linear-gradient(145deg,#dce8e1,#f8faf4)] text-[#557263]">
                          <Snowflake size={25} aria-hidden="true" />
                        </span>
                      )}
                      <span className="absolute inset-0 bg-gradient-to-t from-[#173629]/65 via-transparent to-white/10" aria-hidden="true" />
                      <span className="absolute inset-x-2 bottom-3 line-clamp-2 text-center text-[10px] font-black leading-5 text-white">
                        {product.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {galleryProducts.length > 1 && (
            <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => selectIndex(activeIndex - 1)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#799686]/35 bg-white/78 text-[#254535] shadow-sm backdrop-blur-lg transition hover:border-[#557b68] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557b68]"
                  aria-label="محصول قبلی"
                >
                  <ArrowRight size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => selectIndex(activeIndex + 1)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#799686]/35 bg-white/78 text-[#254535] shadow-sm backdrop-blur-lg transition hover:border-[#557b68] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557b68]"
                  aria-label="محصول بعدی"
                >
                  <ArrowLeft size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5" role="group" aria-label="انتخاب محصول یخچالی">
                {galleryProducts.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => selectIndex(index)}
                    className={`h-1.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557b68] focus-visible:ring-offset-2 ${
                      index === activeIndex
                        ? "w-12 bg-[#567845]"
                        : "w-6 bg-[#b8c9b6] hover:bg-[#839b82]"
                    }`}
                    aria-label={`نمایش ${product.name}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                  />
                ))}
              </div>
            </div>
          )}

          <p className="mt-4 text-center text-xs font-bold text-[#6e8178] lg:hidden">
            برای دیدن محصولات دیگر، تصویر را بکشید
          </p>
        </div>

        <div className="mt-8 grid gap-3 rounded-[1.75rem] border border-[#a9beaf]/35 bg-white/58 p-4 text-xs font-bold text-[#52675d] shadow-[0_24px_60px_-45px_rgba(31,66,50,0.7)] backdrop-blur-xl sm:grid-cols-3 sm:p-5">
          <span className="flex items-center justify-center gap-2">
            <Snowflake size={17} aria-hidden="true" />
            نیازمند حفظ زنجیره سرد
          </span>
          <span className="flex items-center justify-center gap-2 sm:border-x sm:border-[#a9beaf]/35">
            <Box size={17} aria-hidden="true" />
            محدوده ارسال در صفحه محصول
          </span>
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 size={17} aria-hidden="true" />
            موجودی نهایی با تأیید سرور
          </span>
        </div>
      </div>
    </section>
  );
};
