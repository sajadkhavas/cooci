import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { getProgrammaticScrollBehavior } from "@/lib/accessibility/motion";

export const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 640);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: getProgrammaticScrollBehavior(),
        })
      }
      className={`fixed right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#27390c]/15 bg-[#d0e596] text-[#27390c] shadow-[0_16px_36px_-16px_rgba(39,57,12,0.75)] transition duration-300 hover:-translate-y-1 hover:bg-[#c4df7b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27390c] focus-visible:ring-offset-2 sm:right-6 lg:bottom-6 ${
        visible
          ? "bottom-[6.75rem] translate-y-0 opacity-100"
          : "pointer-events-none bottom-[6.75rem] translate-y-3 opacity-0"
      }`}
      aria-label="بازگشت به بالای صفحه"
      title="بازگشت به بالا"
    >
      <ArrowUp size={21} strokeWidth={2.4} aria-hidden="true" />
    </button>
  );
};
