import fs from "node:fs";

const files = {
  package: "package.json",
  config: "react-router.config.ts",
  routes: "src/routes.ts",
  root: "src/root.tsx",
  clientEntry: "src/entry.client.tsx",
  serverEntry: "src/entry.server.tsx",
  server: "server.runtime.mjs",
  cart: "src/context/CartContext.tsx",
  networkStatus: "src/components/network/NetworkStatus.tsx",
  seo: "src/components/SEO.tsx",
  breadcrumb: "src/components/Breadcrumbs.tsx",
  patch: "scripts/patch-react-router-dev-module-sync.mjs",
  nonceAudit: "scripts/assert-csp-nonces.mjs",
  deployWorkflow: ".github/workflows/phase8-deployment.yml",
  acceptanceWorkflow: ".github/workflows/phase18-e2e.yml",
  doc: "docs/FRONTEND_PHASE_10_1_SSR_FOUNDATION.md",
};
const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) errors.push(`Missing Phase 10.1 file: ${path}`);
  else sources[name] = fs.readFileSync(path, "utf8");
}
const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) errors.push(`${files[file]}: missing ${label}`);
};
const forbidText = (file, text, label = text) => {
  if (sources[file]?.includes(text)) errors.push(`${files[file]}: contains forbidden ${label}`);
};

requireText("package", '"react": "19.2.7"', "React 19 pin");
requireText("package", '"react-router": "7.18.1"', "stable Framework Mode pin");
requireText("package", '"vite": "7.3.6"', "Vite compatibility pin");
requireText(
  "package",
  '"postinstall": "node scripts/patch-react-router-dev-module-sync.mjs"',
  "published-package repair",
);
requireText("config", "ssr: true", "SSR enabled");
requireText("routes", "satisfies RouteConfig", "typed route modules");
requireText("root", 'lang="fa-IR" dir="rtl"', "server document identity");
requireText("root", "x-winimi-csp-nonce", "request nonce loader");
requireText("root", "<Scripts nonce={nonce}", "nonce-aware document scripts");
requireText("clientEntry", "hydrateRoot", "React hydration");
requireText("serverEntry", "<ServerRouter", "custom Framework server entry");
requireText("serverEntry", "nonce={nonce}", "ServerRouter nonce propagation");
requireText(
  "serverEntry",
  "renderToPipeableStream",
  "streaming React server renderer",
);
requireText("serverEntry", "nonce,", "React streamed-script nonce option");
requireText(
  "serverEntry",
  'request.headers.get("x-winimi-csp-nonce")',
  "runtime nonce handoff",
);
requireText("server", "randomBytes(18)", "per-response nonce");
requireText(
  "server",
  '"private, no-store, max-age=0"',
  "transactional cache boundary",
);
requireText("server", 'app.get("/__ssr_health"', "runtime health endpoint");
requireText("cart", "isStorageHydrated", "hydration-safe persistence");
requireText(
  "networkStatus",
  "useState(true)",
  "server/client-stable initial network state",
);
requireText(
  "networkStatus",
  "setIsOnline(navigator.onLine)",
  "post-hydration network synchronization",
);
forbidText(
  "networkStatus",
  "useState(getOnlineState)",
  "browser-dependent initial render",
);
forbidText("seo", "react-helmet-async", "legacy Helmet runtime");
requireText("seo", "useCspNonce", "nonce JSON-LD");
requireText("breadcrumb", "useCspNonce", "breadcrumb nonce JSON-LD");
requireText("patch", "module-sync-enabled", "bounded build-tool repair");
requireText("nonceAudit", "inline SSR scripts do not share", "complete nonce invariant");
requireText(
  "deployWorkflow",
  "node scripts/assert-csp-nonces.mjs ssr-home.html",
  "deployment nonce verification",
);
requireText(
  "acceptanceWorkflow",
  "Verify server-rendered source HTML before hydration",
  "Laravel topology SSR source gate",
);
requireText("doc", "frontend_ssr_foundation=ready", "final Phase 10.1 marker");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  framework: "React Router 7.18.1",
  react: "19.2.7",
  vite: "7.3.6",
  errors,
};
fs.writeFileSync(
  "frontend-phase10-1-audit.json",
  `${JSON.stringify(report, null, 2)}\n`,
);
if (errors.length) {
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(
  "Frontend Phase 10.1 audit passed: streamed scripts share the response CSP nonce and browser capability state is hydration-stable; frontend_ssr_foundation=ready.",
);
