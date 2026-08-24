import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

interface DraggableMarqueeProps {
  items: string[];
}

export const DraggableMarquee = ({ items }: DraggableMarqueeProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ active: false, startX: 0, startScroll: 0 });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (
      !viewport ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(now - previous, 50);
      previous = now;

      if (!paused && !dragState.current.active) {
        viewport.scrollLeft += elapsed * 0.026;
        const resetPoint = viewport.scrollWidth / 2;
        if (viewport.scrollLeft >= resetPoint) {
          viewport.scrollLeft -= resetPoint;
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [paused]);

  const repeatedItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-[#27390c]/15 bg-[#d0e596] py-3.5 text-[#27390c] shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[#d0e596] to-transparent sm:w-24"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[#d0e596] to-transparent sm:w-24"
        aria-hidden="true"
      />
      <div
        ref={viewportRef}
        className="marquee-scrollbar flex cursor-grab select-none gap-7 overflow-x-auto px-6 active:cursor-grabbing sm:gap-10 sm:px-10"
        dir="ltr"
        role="region"
        aria-label="دسترسی سریع به محصولات و خدمات وینیمی؛ برای مرور، نوار را بکشید"
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          dragState.current.active = false;
          setPaused(false);
        }}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onPointerDown={(event) => {
          if (event.pointerType === "touch") {
            setPaused(true);
            return;
          }
          const viewport = viewportRef.current;
          if (!viewport) return;
          dragState.current = {
            active: true,
            startX: event.clientX,
            startScroll: viewport.scrollLeft,
          };
          viewport.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const viewport = viewportRef.current;
          if (!viewport || !dragState.current.active) return;
          viewport.scrollLeft =
            dragState.current.startScroll -
            (event.clientX - dragState.current.startX);
        }}
        onPointerUp={(event) => {
          dragState.current.active = false;
          event.currentTarget.releasePointerCapture?.(event.pointerId);
          setPaused(false);
        }}
        onTouchEnd={() => setPaused(false)}
      >
        {repeatedItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 px-2 text-sm font-black sm:text-base"
            dir="rtl"
            aria-hidden={index >= items.length}
          >
            <Sparkles size={14} className="text-[#b96552]" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
