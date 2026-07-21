import fs from "node:fs";

const files = {
  threatModel: "docs/FRONTEND_FULL_AUDIT_PHASE_6.md",
  navigation: "src/lib/accessibility/navigation.ts",
  motion: "src/lib/accessibility/motion.ts",
  header: "src/components/layout/Header.tsx",
  footer: "src/components/layout/Footer.tsx",
  floatingSupport: "src/components/layout/FloatingWhatsApp.tsx",
  announcer: "src/components/accessibility/RouteAnnouncer.tsx",
  scroll: "src/components/ScrollToTop.tsx",
  errorBoundary: "src/components/RouteErrorBoundary.tsx",
  loading: "src/components/RouteLoadingFallback.tsx",
  siteLayout: "src/components/layout/SiteLayout.tsx",
  unit: "tests/unit/accessibility-navigation.test.ts",
  e2e: "e2e/phase18.spec.mjs",
  package: "package.json",
};

const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 6 file: ${path}`);
    continue;
  }
  sources[name] = fs.readFileSync(path, "utf8");
}

const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) errors.push(`${files[file]}: missing ${label}`);
};
const forbidText = (file, text, label = text) => {
  if (sources[file]?.includes(text)) errors.push(`${files[file]}: contains forbidden ${label}`);
};

requireText("threatModel", "Navigation state must not announce the wrong page as current", "route semantics boundary");
requireText("threatModel", "never strand body scroll", "dialog cleanup boundary");
requireText("threatModel", "respect `prefers-reduced-motion`", "motion boundary");

requireText("navigation", "isNavigationTargetActive", "shared active-route helper");
requireText("navigation", "matchesRoutePrefix", "path-segment prefix helper");
requireText("navigation", 'target.match === "exact"', "exact category matching");
requireText("navigation", '!matchesRoutePrefix(pathname, "/products/category")', "store/category separation");

requireText("motion", 'window.matchMedia("(prefers-reduced-motion: reduce)")', "reduced-motion query");
requireText("motion", 'prefersReducedMotion() ? "auto" : "smooth"', "programmatic motion policy");

requireText("header", "isNavigationTargetActive(location.pathname, link)", "route-accurate Header state");
requireText("header", 'match: "exact"', "exact cookie category match");
requireText("header", "restoreMenuFocusRef", "dialog focus-restoration intent");
requireText("header", "previousLocationRef", "route navigation close tracking");
requireText("header", 'event.key === "Escape"', "Escape dismissal");
requireText("header", 'event.key !== "Tab"', "focus trap");
requireText("header", 'role="dialog"', "mobile dialog role");
requireText("header", 'aria-modal="true"', "modal semantics");
requireText("header", "document.body.style.overflow = previousOverflow", "body-scroll restoration");
forbidText("header", 'match: "categories"', "all-category cookie current state");
forbidText("header", "const isNavLinkActive", "duplicated legacy route matcher");

requireText("footer", "getProgrammaticScrollBehavior", "reduced-motion Footer scroll");
forbidText("footer", 'behavior: "smooth"', "forced smooth Footer scroll");
requireText("floatingSupport", "matchesRoutePrefix", "segment-safe floating support routes");
forbidText("floatingSupport", "location.pathname.startsWith(prefix)", "unsafe raw prefix matching");

requireText("announcer", "window.clearTimeout(timeoutId)", "stale announcement cancellation");
requireText("announcer", "window.cancelAnimationFrame(frameId)", "announcement frame cancellation");
forbidText("announcer", "location.search", "query-triggered page announcements");

requireText("scroll", "initialRenderRef", "initial-load focus guard");
requireText("scroll", "window.cancelAnimationFrame(frameId)", "route focus frame cleanup");
requireText("scroll", "getProgrammaticScrollBehavior", "hash reduced-motion behavior");
requireText("scroll", 'document.getElementById("main-content")', "route main focus");
forbidText("scroll", "search } = useLocation", "query-triggered focus theft");

requireText("errorBoundary", "headingRef", "recoverable error focus target");
requireText("errorBoundary", 'id="route-error-title"', "error labelling");
requireText("errorBoundary", "window.cancelAnimationFrame", "error focus frame cleanup");
requireText("loading", 'role="status"', "loading status role");
requireText("loading", 'aria-hidden="true"', "decorative skeleton hiding");
requireText("loading", 'className="sr-only">در حال بارگذاری صفحه', "single loading announcement");
requireText("siteLayout", 'href="#main-content"', "skip link");
requireText("siteLayout", 'id="main-content"', "main focus target");

requireText("unit", "cookie navigation is active only for the exact cookie category", "category route unit test");
requireText("unit", "route-prefix matching respects path segment boundaries", "prefix collision unit test");
requireText("unit", "programmatic scrolling respects reduced-motion preference", "motion unit test");
requireText("e2e", "mobile navigation traps focus", "mobile keyboard E2E");
requireText("e2e", "query-string updates do not steal search focus", "query focus E2E");
requireText("package", '"audit:phase6"', "Phase 6 audit command");

const report = { generatedAt: new Date().toISOString(), passed: errors.length === 0, errors };
fs.writeFileSync("frontend-phase6-audit.json", `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) {
  console.error(`Frontend Phase 6 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Frontend Phase 6 audit passed: route semantics, keyboard dialogs, focus transitions, live regions, reduced motion and recoverable shared states are locked.");
