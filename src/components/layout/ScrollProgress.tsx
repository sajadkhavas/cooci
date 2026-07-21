import { useEffect, useRef } from "react";

export const ScrollProgress = () => {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    let maximumScroll = 1;

    const render = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / maximumScroll));
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress.toFixed(5)})`;
      }
    };

    const scheduleRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    const measure = () => {
      maximumScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      scheduleRender();
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    resizeObserver?.observe(document.documentElement);

    measure();
    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={progressRef} />
    </div>
  );
};
