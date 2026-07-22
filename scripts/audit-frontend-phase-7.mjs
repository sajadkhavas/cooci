import fs from "node:fs";

const files = {
  package: "package.json",
  config: "react-router.config.ts",
  routes: "src/routes.ts",
  root: "src/root.tsx",
  entry: "src/entry.client.tsx",
  registration: "src/lib/registerServiceWorker.ts",
  workerTemplate: "scripts/service-worker.template.js",
  workerGenerator: "scripts/generate-service-worker.mjs",
  manifest: "public/manifest.webmanifest",
  performance: "scripts/audit-performance.mjs",
  pwaE2e: "e2e/phase7-pwa.spec.mjs",
  acceptanceWorkflow: ".github/workflows/phase18-e2e.yml",
};
const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) errors.push("Missing Phase 7 file: " + path);
  else sources[name] = fs.readFileSync(path, "utf8");
}
const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) errors.push(files[file] + ": missing " + label);
};
const forbidText = (file, text, label = text) => {
  if (sources[file]?.includes(text)) errors.push(files[file] + ": contains forbidden " + label);
};
requireText("package", '"build": "react-router build', "Framework Mode production build");
requireText("package", '"typegen": "react-router typegen"', "route type generation");
requireText("config", "ssr: true", "SSR enabled");
requireText("routes", "satisfies RouteConfig", "typed route-module inventory");
requireText("routes", 'route("checkout", "./routes/checkout.tsx")', "checkout route module");
requireText("root", "<Scripts nonce={nonce}", "nonce-protected hydration scripts");
requireText("entry", "hydrateRoot", "client hydration");
requireText("entry", "registerServiceWorker();", "service worker registration");
requireText("registration", "window.isSecureContext", "secure-context registration guard");
requireText("workerTemplate", 'const BUILD_VERSION = "__WINIMI_BUILD_VERSION__"');
requireText("workerTemplate", '"/checkout"', "transactional offline boundary");
requireText("workerGenerator", '"build/client"', "Framework client output");
requireText("performance", 'const CLIENT_DIR = "build/client"', "client performance inventory");
requireText("performance", 'const RUNTIME_DIR = "build/runtime"', "SSR runtime budget");
requireText("pwaE2e", "network restoration returns to the live application");
requireText("acceptanceWorkflow", "Start internal production SSR storefront");
requireText("acceptanceWorkflow", "Verify server-rendered source HTML before hydration");
forbidText("acceptanceWorkflow", "npm run dev -- --host", "development acceptance server");
let manifest;
try { manifest = JSON.parse(sources.manifest || ""); } catch (error) { errors.push("Invalid manifest: " + error.message); }
if (manifest?.id !== "/" || manifest?.scope !== "/") errors.push("Manifest root scope changed.");
const report = { generatedAt: new Date().toISOString(), passed: errors.length === 0, routeModules: (sources.routes?.match(/route\(/g) || []).length + 1, errors };
fs.writeFileSync("frontend-phase7-audit.json", JSON.stringify(report, null, 2) + "\n");
if (errors.length) { errors.forEach((error) => console.error("- " + error)); process.exit(1); }
console.log("Frontend Phase 7 audit passed under Framework Mode: route splitting, hydration, PWA and SSR/client performance boundaries are locked.");
