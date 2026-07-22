import fs from "node:fs";
import path from "node:path";

const files = {
  main: "src/root.tsx",
  runtimeCss: "src/styles/runtime-performance.css",
  scrollProgress: "src/components/layout/ScrollProgress.tsx",
  reveal: "src/components/motion/Reveal.tsx",
  bottomNavigation: "src/components/layout/MobileBottomNavigation.tsx",
  siteLayout: "src/components/layout/SiteLayout.tsx",
  floatingWhatsapp: "src/components/layout/FloatingWhatsApp.tsx",
  vite: "vite.config.ts",
  runtimeE2e: "e2e/runtime-performance.spec.mjs",
  playwright: "e2e/playwright.config.mjs",
  acceptanceWorkflow: ".github/workflows/phase18-e2e.yml",
  documentation: "docs/FRONTEND_RUNTIME_PERFORMANCE_PHASE_9_5.md",
};

const errors = [];
const sources = {};

for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing runtime-performance file: ${filePath}`);
    continue;
  }
  sources[name] = fs.readFileSync(filePath, "utf8");
}

const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) errors.push(`${files[file]}: missing ${label}`);
};

const forbidText = (file, text, label = text) => {
  if (sources[file]?.includes(text)) errors.push(`${files[file]}: contains forbidden ${label}`);
};

requireText(
  "main",
  'import "./styles/runtime-performance.css";',
  "last-mile runtime stylesheet import",
);
requireText("runtimeCss", "overflow-x: clip", "non-scroll-container horizontal clipping");
requireText("runtimeCss", "(pointer: coarse)", "coarse-pointer rendering policy");
requireText("runtimeCss", "backdrop-filter: none !important", "mobile backdrop-filter removal");
requireText("runtimeCss", '[class*="blur-["]', "large decorative blur suppression");
requireText("runtimeCss", "prefers-reduced-motion: reduce", "reduced-motion policy");
requireText("runtimeCss", "contain: strict", "scroll progress containment");
requireText(
  "runtimeCss",
  ".mobile-bottom-navigation__surface",
  "mobile bottom-navigation styling",
);
requireText(
  "runtimeCss",
  "env(safe-area-inset-bottom, 0px)",
  "mobile safe-area handling",
);

forbidText("scrollProgress", "useState", "React state in per-frame scroll path");
forbidText("scrollProgress", "setProgress", "per-frame React state update");
requireText("scrollProgress", "progressRef.current.style.transform", "direct compositor transform update");
requireText("scrollProgress", "ResizeObserver", "cached scroll-range refresh");
requireText("scrollProgress", "if (frame) return", "single scheduled animation frame");

forbidText("reveal", "useState", "React state update from reveal observer");
requireText("reveal", 'element.classList.add("is-visible")', "DOM-only one-shot reveal");
requireText("reveal", "observer.disconnect()", "one-shot observer cleanup");

requireText(
  "bottomNavigation",
  'aria-label="ناوبری پایین موبایل"',
  "accessible bottom-navigation landmark",
);
requireText("bottomNavigation", 'label: "فروشگاه"', "emphasized shop destination");
requireText("bottomNavigation", "badge: totalItems", "cart count badge");
requireText("bottomNavigation", "aria-current", "current-route semantics");
requireText(
  "siteLayout",
  "<MobileBottomNavigation />",
  "bottom-navigation layout integration",
);
requireText(
  "floatingWhatsapp",
  "+6.15rem",
  "mobile WhatsApp offset above bottom navigation",
);

requireText(
  "vite",
  'mode === "development" && componentTagger()',
  "Lovable component tagger restricted to development",
);
requireText("runtimeE2e", "Emulation.setCPUThrottlingRate", "CPU-throttled runtime profiling");
requireText("runtimeE2e", "framesOver50ms", "janky-frame evidence");
requireText("runtimeE2e", "longTaskTotalMs", "Long Task evidence");
requireText("runtimeE2e", "durationMs = 2_600", "deterministic down/up scroll cycle");
requireText(
  "runtimeE2e",
  "mobile bottom navigation is responsive, accessible and route-aware",
  "mobile bottom-navigation browser acceptance",
);
requireText("playwright", '"runtime-performance.spec.mjs"', "runtime suite inclusion");
requireText(
  "acceptanceWorkflow",
  "Collect runtime scroll baseline — Phase 9.5",
  "production runtime workflow gate",
);
requireText(
  "documentation",
  "frontend_runtime_performance_audited=ready",
  "runtime performance marker",
);

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });

const sourceFiles = walk("src").filter((filePath) => /\.(css|tsx?)$/.test(filePath));
const sourceText = sourceFiles.map((filePath) => fs.readFileSync(filePath, "utf8")).join("\n");
const count = (pattern) => [...sourceText.matchAll(pattern)].length;

const inventory = {
  sourceFiles: sourceFiles.length,
  backdropBlurUtilities: count(/backdrop-blur(?:-|\b)/g),
  explicitBackdropFilters: count(/backdrop-filter\s*:/g),
  largeArbitraryBlurs: count(/blur-\[(?:\d{2,}|\d+\.\d+)(?:px|rem)\]/g),
  stickyUtilities: count(/\bsticky\b/g),
  fixedUtilities: count(/\bfixed\b/g),
  infiniteAnimations: count(/\binfinite\b/g),
};

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  inventory,
  diagnosis: {
    productionBundleIsWithinStaticBudgets: true,
    developmentOnlyLovableTagger: true,
    primaryRisk: "client-side paint, compositing and scroll-linked work",
    productionDeploymentExpectedEffect:
      "faster transfer, caching and no editor instrumentation; browser paint costs still require code fixes",
  },
  errors,
};

fs.writeFileSync("runtime-performance-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Runtime performance audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Runtime performance audit passed: ${inventory.backdropBlurUtilities} backdrop utilities inventoried; mobile paint simplification, compositor-only progress and bottom navigation are locked.`,
);
