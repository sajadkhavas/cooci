import assert from "node:assert/strict";
import test from "node:test";
import {
  isNavigationTargetActive,
  matchesRoutePrefix,
} from "@/lib/accessibility/navigation";
import {
  getProgrammaticScrollBehavior,
  prefersReducedMotion,
} from "@/lib/accessibility/motion";

test("cookie navigation is active only for the exact cookie category", () => {
  const cookies = {
    href: "/products/category/cookies",
    match: "exact" as const,
  };
  assert.equal(
    isNavigationTargetActive("/products/category/cookies", cookies),
    true,
  );
  assert.equal(
    isNavigationTargetActive("/products/category/diet", cookies),
    false,
  );
  assert.equal(
    isNavigationTargetActive("/products/category/cakes", cookies),
    false,
  );
});

test("store navigation includes product details but excludes category routes", () => {
  const store = { href: "/products", match: "products" as const };
  assert.equal(isNavigationTargetActive("/products", store), true);
  assert.equal(
    isNavigationTargetActive("/products/staging-chocolate-cookie", store),
    true,
  );
  assert.equal(
    isNavigationTargetActive("/products/category/cookies", store),
    false,
  );
});

test("route-prefix matching respects path segment boundaries", () => {
  assert.equal(matchesRoutePrefix("/cart", "/cart"), true);
  assert.equal(matchesRoutePrefix("/cart/checkout", "/cart"), true);
  assert.equal(matchesRoutePrefix("/cartoon", "/cart"), false);
  assert.equal(matchesRoutePrefix("/payment-history", "/payment"), false);
});

test("programmatic scrolling respects reduced-motion preference", () => {
  const originalWindow = globalThis.window;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      matchMedia: (query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
      }),
    },
  });
  try {
    assert.equal(prefersReducedMotion(), true);
    assert.equal(getProgrammaticScrollBehavior(), "auto");
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
  }
});
