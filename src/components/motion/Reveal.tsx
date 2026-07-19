import { type CSSProperties, type ElementType, type ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  threshold?: number;
}

export const Reveal = ({
  children,
  as: Component = "div",
  className = "",
  delay = 0,
  threshold = 0.12,
}: RevealProps) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  return (
    <Component
      ref={elementRef}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </Component>
  );
};
