import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getProgrammaticScrollBehavior } from "@/lib/accessibility/motion";

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

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const initialRenderRef = useRef(true);

  useLayoutEffect(() => {
    let frameId: number | undefined;

    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1));
      frameId = window.requestAnimationFrame(() => {
        const target = document.getElementById(targetId);
        if (!target) return;
        target.scrollIntoView({
          block: "start",
          behavior: getProgrammaticScrollBehavior(),
        });
        focusTarget(target);
      });
      initialRenderRef.current = false;
      return () => {
        if (frameId !== undefined) window.cancelAnimationFrame(frameId);
      };
    }

    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return undefined;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    frameId = window.requestAnimationFrame(() => {
      const main = document.getElementById("main-content");
      if (main) focusTarget(main);
    });

    return () => {
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
    };
  }, [pathname, hash]);

  return null;
};
