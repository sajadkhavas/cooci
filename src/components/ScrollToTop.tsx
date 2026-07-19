import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    window.requestAnimationFrame(() => {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    });
  }, [pathname, search, hash]);

  return null;
};
