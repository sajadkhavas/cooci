import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router";

const focusTarget = (target: HTMLElement) => {
  const hadTabIndex = target.hasAttribute("tabindex");
  if (!hadTabIndex) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  if (!hadTabIndex) {
    target.addEventListener(
      "blur",
      () => target.removeAttribute("tabindex"),
      { once: true },
    );
  }
};

const decodeHashTarget = (hash: string) => {
  const raw = hash.slice(1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

/**
 * Accessibility-only route focus manager.
 *
 * React Router's <ScrollRestoration /> is the single owner of scroll position.
 * Keeping explicit programmatic route/hash scrolling here caused two independent
 * scroll authorities to race during hydration/navigation and could surface as a
 * visible vertical jump on content-heavy routes such as Home.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const initialRenderRef = useRef(true);

  useLayoutEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(decodeHashTarget(hash));
        if (target) focusTarget(target);
        return;
      }

      const main = document.getElementById("main-content");
      if (main) focusTarget(main);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname, hash]);

  return null;
};
