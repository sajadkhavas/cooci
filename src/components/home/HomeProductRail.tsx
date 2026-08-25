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
      className="relative"
      onMouseEnter={stopAutoPlay}
      onFocusCapture={stopAutoPlay}
      onPointerDown={stopAutoPlay}
      onWheel={stopAutoPlay}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2" aria-label="کنترل محصولات پیشنهادی">
          <button
            type="button"
            onClick={() => {
              stopAutoPlay();
              scrollToIndex(activeIndex - 1);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-white/80 text-primary shadow-sm transition hover:border-[#91b33f]/55 hover:bg-[#d0e596]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#91b33f]"
            aria-label="محصول قبلی"
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              stopAutoPlay();
              scrollToIndex(activeIndex + 1);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-white/80 text-primary shadow-sm transition hover:border-[#91b33f]/55 hover:bg-[#d0e596]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#91b33f]"
            aria-label="محصول بعدی"
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          {canAutoPlay && (
            <button
              type="button"
              onClick={() => setIsAutoPlaying((current) => !current)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 text-xs font-black text-primary shadow-sm transition hover:border-[#91b33f]/55 hover:bg-[#d0e596]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#91b33f]"
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

        <span className="rounded-full border border-primary/10 bg-white/70 px-3 py-1.5 text-xs font-black text-primary/70">
          {(activeIndex + 1).toLocaleString("fa-IR")} / {products.length.toLocaleString("fa-IR")}
        </span>
      </div>

      <ul
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
