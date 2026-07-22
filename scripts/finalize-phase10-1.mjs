import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const read = (path) => readFileSync(path, "utf8");
const write = (path, content) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart().replace(/\s*$/, "\n"), "utf8");
};
const replaceExactly = (path, needle, replacement, expected = 1) => {
  const source = read(path);
  const count = source.split(needle).length - 1;
  if (count !== expected) {
    throw new Error(`${path}: expected ${expected} occurrence(s), found ${count}`);
  }
  writeFileSync(path, source.split(needle).join(replacement), "utf8");
};

const packageJson = JSON.parse(read("package.json"));
packageJson.scripts["audit:ssr"] = "node scripts/audit-frontend-phase-10-1.mjs";
packageJson.scripts.check = packageJson.scripts.check.replace(
  "npm run audit:runtime &&",
  "npm run audit:runtime && npm run audit:ssr &&",
);
write("package.json", JSON.stringify(packageJson, null, 2));

write(
  "scripts/audit-frontend-phase-7.mjs",
  `import fs from "node:fs";

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
const report = { generatedAt: new Date().toISOString(), passed: errors.length === 0, routeModules: (sources.routes?.match(/route\\(/g) || []).length + 1, errors };
fs.writeFileSync("frontend-phase7-audit.json", JSON.stringify(report, null, 2) + "\\n");
if (errors.length) { errors.forEach((error) => console.error("- " + error)); process.exit(1); }
console.log("Frontend Phase 7 audit passed under Framework Mode: route splitting, hydration, PWA and SSR/client performance boundaries are locked.");
`,
);

write(
  "scripts/audit-frontend-phase-8.mjs",
  `import fs from "node:fs";
const files = {
  creator: "scripts/create-frontend-release.mjs",
  verifier: "scripts/verify-frontend-release.mjs",
  deploy: "deploy/bin/deploy-frontend.sh",
  rollback: "deploy/bin/rollback-frontend.sh",
  smoke: "deploy/bin/smoke-test-frontend.sh",
  nginx: "deploy/nginx/winimi-frontend.conf.example",
  commonHeaders: "deploy/nginx/winimi-security-headers.conf",
  staticCsp: "deploy/nginx/winimi-static-csp.conf",
  renderer: "scripts/render-frontend-nginx.mjs",
  systemd: "deploy/systemd/winimi-frontend-ssr.service.example",
  workflow: ".github/workflows/phase8-deployment.yml",
};
const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) errors.push("Missing Phase 8 SSR file: " + path);
  else sources[name] = fs.readFileSync(path, "utf8");
}
const requireText = (file, text, label = text) => { if (!sources[file]?.includes(text)) errors.push(files[file] + ": missing " + label); };
const forbidText = (file, text, label = text) => { if (sources[file]?.includes(text)) errors.push(files[file] + ": contains forbidden " + label); };
requireText("creator", '"winimi-frontend-ssr-release-v2"', "SSR manifest v2");
requireText("creator", '"runtime/server.mjs"', "runtime release entry");
requireText("creator", "forbiddenTextPatterns", "secret scan");
requireText("verifier", "SHA-256 mismatch", "release integrity");
requireText("deploy", "FRONTEND_RESTART_COMMAND", "runtime restart hook");
requireText("deploy", "FRONTEND_HEALTH_URL", "post-switch health hook");
requireText("deploy", "restoring previous release", "failed activation rollback");
requireText("rollback", "restart_runtime", "rollback runtime restart");
requireText("smoke", "homepage H1 before hydration", "source HTML smoke");
requireText("smoke", "nonce CSP", "nonce-bearing CSP smoke");
requireText("nginx", "upstream winimi_ssr", "SSR upstream");
requireText("nginx", "proxy_pass http://winimi_ssr", "SSR proxy");
requireText("nginx", "current/app/build/client", "client asset root");
requireText("nginx", "proxy_buffering off", "streaming SSR proxy");
forbidText("commonHeaders", "Content-Security-Policy", "static CSP overriding SSR nonce");
requireText("staticCsp", "Content-Security-Policy", "offline document CSP");
requireText("renderer", "FRONTEND_SSR_UPSTREAM", "SSR render input");
requireText("systemd", "build/runtime/server.mjs", "systemd SSR entrypoint");
requireText("systemd", "NoNewPrivileges=true", "systemd hardening");
requireText("workflow", "Start release A SSR runtime", "real SSR release boot");
requireText("workflow", "Run HTTPS SSR production smoke test", "SSR HTTPS gate");
const report = { generatedAt: new Date().toISOString(), passed: errors.length === 0, format: "winimi-frontend-ssr-release-v2", errors };
fs.writeFileSync("frontend-phase8-audit.json", JSON.stringify(report, null, 2) + "\\n");
if (errors.length) { errors.forEach((error) => console.error("- " + error)); process.exit(1); }
console.log("Frontend Phase 8 audit passed: deterministic SSR release, atomic runtime activation, Nginx proxy, nonce CSP and rollback are locked.");
`,
);

write(
  "scripts/audit-frontend-phase-10-1.mjs",
  `import fs from "node:fs";
const files = {
  package: "package.json",
  config: "react-router.config.ts",
  routes: "src/routes.ts",
  root: "src/root.tsx",
  entry: "src/entry.client.tsx",
  server: "server.runtime.mjs",
  cart: "src/context/CartContext.tsx",
  seo: "src/components/SEO.tsx",
  breadcrumb: "src/components/Breadcrumbs.tsx",
  patch: "scripts/patch-react-router-dev-module-sync.mjs",
  deployWorkflow: ".github/workflows/phase8-deployment.yml",
  acceptanceWorkflow: ".github/workflows/phase18-e2e.yml",
  doc: "docs/FRONTEND_PHASE_10_1_SSR_FOUNDATION.md",
};
const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) errors.push("Missing Phase 10.1 file: " + path);
  else sources[name] = fs.readFileSync(path, "utf8");
}
const requireText = (file, text, label = text) => { if (!sources[file]?.includes(text)) errors.push(files[file] + ": missing " + label); };
const forbidText = (file, text, label = text) => { if (sources[file]?.includes(text)) errors.push(files[file] + ": contains forbidden " + label); };
requireText("package", '"react": "19.2.7"', "React 19 pin");
requireText("package", '"react-router": "7.18.1"', "stable Framework Mode pin");
requireText("package", '"vite": "7.3.6"', "Vite compatibility pin");
requireText("package", '"postinstall": "node scripts/patch-react-router-dev-module-sync.mjs"', "published-package repair");
requireText("config", "ssr: true", "SSR enabled");
requireText("routes", "satisfies RouteConfig", "typed route modules");
requireText("root", 'lang="fa-IR" dir="rtl"', "server document identity");
requireText("root", "x-winimi-csp-nonce", "request nonce loader");
requireText("root", "<Scripts nonce={nonce}", "nonce hydration");
requireText("entry", "hydrateRoot", "React hydration");
requireText("server", "randomBytes(18)", "per-response nonce");
requireText("server", '"private, no-store, max-age=0"', "transactional cache boundary");
requireText("server", 'app.get("/__ssr_health"', "runtime health endpoint");
requireText("cart", "isStorageHydrated", "hydration-safe persistence");
forbidText("seo", "react-helmet-async", "legacy Helmet runtime");
requireText("seo", "useCspNonce", "nonce JSON-LD");
requireText("breadcrumb", "useCspNonce", "breadcrumb nonce JSON-LD");
requireText("patch", "module-sync-enabled", "bounded build-tool repair");
requireText("deployWorkflow", "server-rendered homepage", "deployment source HTML gate");
requireText("acceptanceWorkflow", "Verify server-rendered source HTML before hydration", "Laravel topology SSR source gate");
requireText("doc", "frontend_ssr_foundation=ready", "final Phase 10.1 marker");
const report = { generatedAt: new Date().toISOString(), passed: errors.length === 0, framework: "React Router 7.18.1", react: "19.2.7", vite: "7.3.6", errors };
fs.writeFileSync("frontend-phase10-1-audit.json", JSON.stringify(report, null, 2) + "\\n");
if (errors.length) { errors.forEach((error) => console.error("- " + error)); process.exit(1); }
console.log("Frontend Phase 10.1 audit passed: frontend_ssr_foundation=ready.");
`,
);

write(
  "docs/FRONTEND_PHASE_10_1_SSR_FOUNDATION.md",
  `# Frontend Phase 10.1 — SSR foundation

Marker: \`frontend_ssr_foundation=ready\`

## Delivered runtime

- React 19.2.7 with React Router Framework Mode 7.18.1 and Vite 7.3.6
- typed route modules with server rendering and client hydration
- Persian RTL root document rendered on the server
- per-response CSP nonces for framework scripts and JSON-LD
- hydration-safe cart persistence and unchanged Laravel transaction authority
- private/no-store account, cart, checkout and payment surfaces
- deterministic SSR release format containing client, server and bundled Node runtime
- Nginx immutable asset serving plus streamed SSR proxying
- hardened systemd unit, atomic restart hooks, health checks and rollback
- source-HTML acceptance before hydration in deployment and Laravel browser topology

## Deployment boundary

The repository is ready for a Node 22 SSR process behind Nginx. Live activation still requires server access, DNS/TLS installation and the external provider credentials already documented for Phase 19.
`,
);

write(
  ".github/workflows/phase8-deployment.yml",
  `name: Phase 8 Deployment Readiness

on:
  push:
    branches:
      - "agent/**"
      - main
  pull_request:
    branches:
      - main

concurrency:
  group: phase8-deployment-\${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

env:
  SITE_URL: https://winimibakery.com
  VITE_SITE_ORIGIN: https://winimibakery.com
  VITE_USE_BACKEND: "true"
  VITE_API_BASE_URL: https://api.winimibakery.com
  VITE_ALLOW_DEV_MOCKS: "false"
  VITE_AUTH_MODE: disabled
  VITE_PAYMENT_MODE: disabled
  DEPLOY_ROOT: /tmp/winimi-frontend

jobs:
  release:
    name: Reproducible SSR release, Nginx, deploy and rollback
    runs-on: ubuntu-latest
    timeout-minutes: 35
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22.22.0
          cache: npm
      - name: Install dependencies and Nginx
        run: |
          npm ci
          sudo apt-get update
          sudo apt-get install -y nginx
      - name: Validate production environment and Phase 8 policy
        run: |
          npm run env:production:validate
          npm run audit:phase8
          npm run audit:ssr
      - name: Build production SSR storefront
        run: npm run build
      - name: Create and verify release A
        run: |
          npm run release:create -- build .release-a
          node -e 'const fs=require("fs");const x=JSON.parse(fs.readFileSync("release-output.json"));fs.writeFileSync("release-a-path.txt",x.releaseDir);fs.writeFileSync("release-a-id.txt",x.releaseId)'
          npm run release:verify -- "$(cat release-a-path.txt)"
      - name: Deploy release A
        run: deploy/bin/deploy-frontend.sh "$(cat release-a-path.txt)" "$DEPLOY_ROOT"
      - name: Create and verify release B
        run: |
          cp -a build build-b
          printf 'release-b\n' > build-b/client/release-probe.txt
          npm run release:create -- build-b .release-b
          node -e 'const fs=require("fs");const x=JSON.parse(fs.readFileSync("release-output.json"));fs.writeFileSync("release-b-path.txt",x.releaseDir);fs.writeFileSync("release-b-id.txt",x.releaseId)'
          npm run release:verify -- "$(cat release-b-path.txt)"
      - name: Deploy release B
        run: |
          deploy/bin/deploy-frontend.sh "$(cat release-b-path.txt)" "$DEPLOY_ROOT"
          test -f "$DEPLOY_ROOT/current/app/build/client/release-probe.txt"
      - name: Rollback to release A
        run: |
          deploy/bin/rollback-frontend.sh "$DEPLOY_ROOT" "$(cat release-a-id.txt)"
          test ! -f "$DEPLOY_ROOT/current/app/build/client/release-probe.txt"
      - name: Start release A SSR runtime
        run: |
          cd "$DEPLOY_ROOT/current/app"
          HOST=127.0.0.1 PORT=4178 NODE_ENV=production WINIMI_API_ORIGIN=https://api.winimibakery.com node build/runtime/server.mjs > "$GITHUB_WORKSPACE/ssr-runtime.log" 2>&1 &
          echo $! > "$GITHUB_WORKSPACE/ssr-runtime.pid"
      - name: Wait for SSR health
        run: |
          for attempt in {1..60}; do
            curl --fail --silent http://127.0.0.1:4178/__ssr_health && exit 0
            sleep 1
          done
          cat ssr-runtime.log
          exit 1
      - name: Verify server-rendered homepage
        run: |
          curl --fail --silent http://127.0.0.1:4178/ > ssr-home.html
          grep -q 'سفارش آنلاین کوکی،' ssr-home.html
          grep -q 'rel="canonical"' ssr-home.html
          grep -Eq '<script[^>]+nonce="[A-Za-z0-9_-]+"' ssr-home.html
      - name: Generate ephemeral TLS certificate
        run: |
          mkdir -p .ci-tls
          openssl req -x509 -newkey rsa:2048 -nodes -keyout .ci-tls/loopback.key -out .ci-tls/loopback.crt -days 1 -subj '/CN=127.0.0.1' -addext 'subjectAltName=IP:127.0.0.1,DNS:localhost'
      - name: Render and validate SSR Nginx
        run: |
          mkdir -p .ci-nginx/snippets .ci-nginx/logs
          cp deploy/nginx/winimi-security-headers.conf .ci-nginx/snippets/
          cp deploy/nginx/winimi-static-csp.conf .ci-nginx/snippets/
          FRONTEND_HTTP_PORT=8080 FRONTEND_HTTPS_PORT=8444 FRONTEND_HTTPS_REDIRECT_PORT=:8444 FRONTEND_SERVER_NAMES='127.0.0.1 localhost' FRONTEND_CANONICAL_HOST=127.0.0.1 FRONTEND_DEPLOY_ROOT="$DEPLOY_ROOT" FRONTEND_SSR_UPSTREAM=127.0.0.1:4178 FRONTEND_ACME_ROOT="$PWD/.ci-nginx/acme" FRONTEND_TLS_CERTIFICATE="$PWD/.ci-tls/loopback.crt" FRONTEND_TLS_CERTIFICATE_KEY="$PWD/.ci-tls/loopback.key" FRONTEND_SECURITY_HEADERS_INCLUDE="$PWD/.ci-nginx/snippets/winimi-security-headers.conf" FRONTEND_STATIC_CSP_INCLUDE="$PWD/.ci-nginx/snippets/winimi-static-csp.conf" npm run nginx:render -- deploy/nginx/winimi-frontend.conf.example .ci-nginx/site.conf
          cat > .ci-nginx/nginx.conf <<EOF
          pid $PWD/.ci-nginx/nginx.pid;
          error_log $PWD/.ci-nginx/logs/error.log;
          events { worker_connections 256; }
          http { include /etc/nginx/mime.types; access_log $PWD/.ci-nginx/logs/access.log; include $PWD/.ci-nginx/site.conf; }
          EOF
          sudo nginx -t -c "$PWD/.ci-nginx/nginx.conf"
          sudo nginx -c "$PWD/.ci-nginx/nginx.conf"
      - name: Run HTTPS SSR production smoke test
        env:
          SMOKE_INSECURE: "true"
        run: deploy/bin/smoke-test-frontend.sh https://127.0.0.1:8444
      - name: Upload Phase 8 SSR evidence
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: phase8-ssr-deployment-evidence
          path: |
            release-a-id.txt
            release-b-id.txt
            release-output.json
            performance-report.json
            ssr-home.html
            ssr-runtime.log
            .ci-nginx/site.conf
            .ci-nginx/logs
          if-no-files-found: warn
          retention-days: 14
`,
);

replaceExactly(
  ".github/workflows/phase18-e2e.yml",
  `      - name: Start internal production storefront preview
        run: |
          npm run preview -- --host 127.0.0.1 --port 4173 > frontend-server.log 2>&1 &
          echo $! > frontend-server.pid

      - name: Wait for internal storefront preview
        run: |
          for attempt in {1..60}; do
            if curl --fail --silent http://127.0.0.1:4173/products > /dev/null; then
              exit 0
            fi
            sleep 1
          done
          cat frontend-server.log
          exit 1
`,
  `      - name: Start internal production SSR storefront
        run: |
          HOST=127.0.0.1 PORT=4173 NODE_ENV=production NODE_TLS_REJECT_UNAUTHORIZED=0 WINIMI_API_ORIGIN=https://127.0.0.1:8443 npm run preview > frontend-server.log 2>&1 &
          echo $! > frontend-server.pid

      - name: Wait for internal SSR storefront
        run: |
          for attempt in {1..60}; do
            if curl --fail --silent http://127.0.0.1:4173/__ssr_health > ssr-ready.json; then
              exit 0
            fi
            sleep 1
          done
          cat frontend-server.log
          exit 1

      - name: Verify server-rendered source HTML before hydration
        run: |
          curl --fail --silent http://127.0.0.1:4173/ > ssr-source-home.html
          curl --fail --silent http://127.0.0.1:4173/categories > ssr-source-categories.html
          grep -q 'سفارش آنلاین کوکی،' ssr-source-home.html
          grep -q 'دسته‌بندی محصولات وینیمی' ssr-source-categories.html
          grep -q 'rel="canonical"' ssr-source-home.html
          grep -Eq '<script[^>]+nonce="[A-Za-z0-9_-]+"' ssr-source-home.html
`,
);

replaceExactly(
  ".github/workflows/phase18-e2e.yml",
  `            frontend-server.log
            frontend-https-proxy.log
`,
  `            frontend-server.log
            ssr-ready.json
            ssr-source-home.html
            ssr-source-categories.html
            frontend-https-proxy.log
`,
  2,
);

replaceExactly(
  ".github/workflows/frontend-ci.yml",
  `      - name: Frontend runtime performance Phase 9.5
        run: npm run audit:runtime

      - name: Production environment schema audit
`,
  `      - name: Frontend runtime performance Phase 9.5
        run: npm run audit:runtime

      - name: Frontend SSR foundation Phase 10.1
        run: npm run audit:ssr

      - name: Production environment schema audit
`,
);
replaceExactly(
  ".github/workflows/frontend-ci.yml",
  `            runtime-performance-audit.json
            production-env-audit.json
`,
  `            runtime-performance-audit.json
            frontend-phase10-1-audit.json
            production-env-audit.json
`,
);

const readmePath = "deploy/README.md";
const readme = read(readmePath);
if (!readme.includes("## SSR runtime activation")) {
  write(
    readmePath,
    readme + `

## SSR runtime activation

The active release contains \`app/build/client\`, \`app/build/server\` and the bundled \`app/build/runtime/server.mjs\`. Install the example systemd unit, set \`FRONTEND_RESTART_COMMAND=\"systemctl restart winimi-frontend-ssr\"\` and \`FRONTEND_HEALTH_URL=http://127.0.0.1:4173/__ssr_health\` during deploy/rollback. Nginx serves immutable assets directly and proxies HTML to the loopback SSR process so the response-specific CSP nonce is preserved.
` ,
  );
}

console.log("Phase 10.1 deployment, audit and acceptance finalization written.");
