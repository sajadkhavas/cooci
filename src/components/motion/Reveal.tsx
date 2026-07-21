import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export const Reveal = ({
  children,
  className = "",
  delay = 0,
  threshold = 0.12,
}: RevealProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("is-visible");
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.add("is-visible");
        observer.disconnect();
      },
      { threshold, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  return (
    <div ref={elementRef} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
};
