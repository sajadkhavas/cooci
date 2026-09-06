import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/products";

interface HomeProductRailProps {
  products: Product[];
}

const AUTOPLAY_DELAY = 6000;

export const HomeProductRail = ({ products }: HomeProductRailProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const stopAutoPlay = useCallback(() => setIsAutoPlaying(false), []);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const rail = railRef.current;
      if (!rail || products.length === 0) return;

      const normalizedIndex = (index + products.length) % products.length;
      const target = rail.children.item(normalizedIndex) as HTMLElement | null;
      target?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : behavior,
        block: "nearest",
        inline: "start",
      });
      setActiveIndex(normalizedIndex);
    },
    [prefersReducedMotion, products.length],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) setIsAutoPlaying(false);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.45),
      { threshold: [0, 0.45, 1] },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () =>
      setIsDocumentVisible(document.visibilityState === "visible");
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (
      !isAutoPlaying ||
      !isInView ||
      !isDocumentVisible ||
      prefersReducedMotion ||
      products.length < 2
    ) {
      return;
    }

    const timer = window.setInterval(
      () => scrollToIndex(activeIndex + 1),
      AUTOPLAY_DELAY,
    );
    return () => window.clearInterval(timer);
  }, [
    activeIndex,
    isAutoPlaying,
    isDocumentVisible,
    isInView,
    prefersReducedMotion,
    products.length,
    scrollToIndex,
  ]);

  useEffect(() => {
    if (prefersReducedMotion || products.length < 2) return;
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    if (!mobileQuery.matches) return;

    const nudgeTimer = window.setTimeout(() => {
      const rail = railRef.current;
      if (!rail || rail.scrollLeft !== 0) return;
      rail.scrollBy({ left: -28, behavior: "smooth" });
      window.setTimeout(
        () => rail.scrollBy({ left: 28, behavior: "smooth" }),
        480,
      );
    }, 1400);

    return () => window.clearTimeout(nudgeTimer);
  }, [prefersReducedMotion, products.length]);

  const handleScroll = () => {
    const rail = railRef.current;
    if (!rail) return;

    const children = Array.from(rail.children) as HTMLElement[];
    if (!children.length) return;

    const railStart = rail.getBoundingClientRect().right;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    children.forEach((child, index) => {
      const distance = Math.abs(child.getBoundingClientRect().right - railStart);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    setActiveIndex(nearestIndex);
  };

  const canAutoPlay = !prefersReducedMotion && products.length > 1;

  return (
    <div
      ref={rootRef}
      className="group/rail relative"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby="home-products-heading"
      onMouseEnter={stopAutoPlay}
      onFocusCapture={stopAutoPlay}
      onPointerDown={stopAutoPlay}
      onWheel={stopAutoPlay}
    >
      <div className="mb-4 flex justify-end">
        <div
          className="inline-flex min-h-10 items-center overflow-hidden rounded-full border border-[#31520f]/20 bg-[#31520f] text-white shadow-[0_10px_28px_-14px_rgba(49,82,15,0.85)]"
          aria-label="وضعیت نمایش محصولات پیشنهادی"
        >
          <span className="px-4 text-xs font-black tabular-nums">
            {(activeIndex + 1).toLocaleString("fa-IR")} / {products.length.toLocaleString("fa-IR")}
          </span>
          {canAutoPlay && (
            <button
              type="button"
              onClick={() => setIsAutoPlaying((current) => !current)}
              className="inline-flex min-h-10 items-center justify-center gap-2 border-r border-white/20 bg-white/10 px-3 text-xs font-black text-white transition hover:bg-[#d0e596] hover:text-[#263b12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
              aria-label={isAutoPlaying ? "توقف حرکت خودکار" : "شروع حرکت خودکار"}
            >
              {isAutoPlaying ? (
                <Pause size={15} aria-hidden="true" />
              ) : (
                <Play size={15} aria-hidden="true" />
              )}
              {isAutoPlaying ? "توقف" : "پخش"}
            </button>
          )}
        </div>
      </div>

      {products.length > 1 && (
        <div className="pointer-events-none absolute inset-x-[-1.35rem] top-1/2 z-30 hidden -translate-y-1/2 items-center justify-between lg:flex">
          <button
            type="button"
            onClick={() => {
              stopAutoPlay();
              scrollToIndex(activeIndex + 1);
            }}
            className="pointer-events-auto inline-flex h-12 w-12 translate-x-2 items-center justify-center rounded-full border border-[#31520f]/15 bg-[#fffdf7]/95 text-[#31520f] opacity-0 shadow-[0_12px_35px_-14px_rgba(38,59,18,0.6)] backdrop-blur-xl transition duration-300 hover:scale-105 hover:border-[#91b33f]/65 hover:bg-[#d0e596] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31520f] group-hover/rail:translate-x-0 group-hover/rail:opacity-100"
            aria-label="محصول بعدی"
            aria-controls="home-product-rail"
          >
            <ArrowLeft size={21} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              stopAutoPlay();
              scrollToIndex(activeIndex - 1);
            }}
            className="pointer-events-auto inline-flex h-12 w-12 -translate-x-2 items-center justify-center rounded-full border border-[#31520f]/15 bg-[#fffdf7]/95 text-[#31520f] opacity-0 shadow-[0_12px_35px_-14px_rgba(38,59,18,0.6)] backdrop-blur-xl transition duration-300 hover:scale-105 hover:border-[#91b33f]/65 hover:bg-[#d0e596] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31520f] group-hover/rail:translate-x-0 group-hover/rail:opacity-100"
            aria-label="محصول قبلی"
            aria-controls="home-product-rail"
          >
            <ArrowRight size={21} aria-hidden="true" />
          </button>
        </div>
      )}

      <ul
        id="home-product-rail"
        ref={railRef}
        className="winimi-snap-nav -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0"
        onScroll={handleScroll}
        onTouchStart={stopAutoPlay}
        aria-label="محصولات پیشنهادی وینیمی"
        aria-live="off"
      >
        {products.map((product) => (
          <li
            key={product.id}
            className="min-w-0 basis-[86%] shrink-0 snap-start sm:basis-[48%] lg:basis-[31%] xl:basis-[23.5%]"
          >
            <ProductCard product={product} variant="rail" />
          </li>
        ))}
      </ul>
    </div>
  );
};
