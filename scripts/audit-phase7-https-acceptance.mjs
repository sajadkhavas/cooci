import fs from "node:fs";

const files = {
  workflow: ".github/workflows/phase18-e2e.yml",
  frontendWorkflow: ".github/workflows/frontend-ci.yml",
  proxy: "scripts/https-loopback-proxy.mjs",
  playwright: "e2e/playwright.config.mjs",
  apiPolicy: "src/lib/security/api-url.ts",
  auth: "src/lib/auth.ts",
};

const errors = [];
const sources = {};
for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing HTTPS acceptance file: ${filePath}`);
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
  "workflow",
  "SITE_URL: https://127.0.0.1:4443",
  "HTTPS storefront production origin",
);
requireText(
  "workflow",
  "VITE_SITE_ORIGIN: https://127.0.0.1:4443",
  "HTTPS storefront build origin",
);
requireText(
  "workflow",
  "VITE_API_BASE_URL: https://127.0.0.1:8443",
  "HTTPS API URL for production browser acceptance",
);
requireText(
  "workflow",
  "VITE_E2E_ACCEPTANCE: \"true\"",
  "explicit acceptance diagnostics mode",
);
requireText(
  "workflow",
  "PHASE18_FRONTEND_URL: https://127.0.0.1:4443",
  "HTTPS Playwright base URL",
);
requireText(
  "workflow",
  "PHASE18_API_URL: https://127.0.0.1:8443",
  "HTTPS browser API URL",
);
requireText("workflow", "SESSION_SECURE_COOKIE: \"true\"", "secure session cookie policy");
requireText(
  "workflow",
  "SANCTUM_STATEFUL_DOMAINS: 127.0.0.1:4443,127.0.0.1:8443",
  "same-site Sanctum test domains",
);
requireText("workflow", "Generate ephemeral loopback TLS certificate", "ephemeral certificate step");
requireText("workflow", "openssl req -x509 -newkey rsa:2048 -nodes", "ephemeral certificate generation");
requireText("workflow", "-days 1", "one-day certificate lifetime");
requireText("workflow", "Start ephemeral HTTPS API proxy", "ephemeral API TLS proxy step");
requireText("workflow", "HTTPS_PROXY_PORT=8443", "API HTTPS port");
requireText("workflow", "HTTPS_PROXY_TARGET=http://127.0.0.1:8000", "loopback Laravel target");
requireText(
  "workflow",
  "curl --fail --silent --insecure https://127.0.0.1:8443/api/system/ready",
  "HTTPS API proxy readiness check",
);
requireText("workflow", "Start ephemeral HTTPS storefront proxy", "ephemeral storefront TLS proxy step");
requireText("workflow", "HTTPS_PROXY_PORT=4443", "storefront HTTPS port");
requireText("workflow", "HTTPS_PROXY_TARGET=http://127.0.0.1:4173", "internal storefront target");
requireText(
  "workflow",
  "curl --fail --silent --insecure https://127.0.0.1:4443/products",
  "HTTPS storefront readiness check",
);
forbidText("workflow", ".ci-tls/loopback.key\n            production-build.log", "private key artifact upload");
forbidText("workflow", ".ci-tls/loopback.crt\n            production-build.log", "certificate artifact upload");
forbidText(
  "frontendWorkflow",
  "VITE_E2E_ACCEPTANCE",
  "acceptance OTP diagnostics in normal production CI",
);

requireText("proxy", "https.createServer", "HTTPS listener");
requireText("proxy", "http.request", "HTTP loopback upstream");
requireText("proxy", 'target.protocol !== "http:"', "HTTP-only upstream guard");
requireText("proxy", '"x-forwarded-proto": "https"', "forwarded HTTPS protocol");

requireText("playwright", "allowLocalSelfSignedCertificate", "scoped self-signed certificate policy");
requireText("playwright", 'process.env.CI === "true"', "CI-only certificate exception");
requireText(
  "playwright",
  'baseURL === "https://127.0.0.1:4443"',
  "exact loopback HTTPS certificate exception",
);
requireText("playwright", "ignoreHTTPSErrors: allowLocalSelfSignedCertificate", "conditional TLS exception");
requireText(
  "playwright",
  '? ["--ignore-certificate-errors"]',
  "exact-loopback Chromium certificate exception",
);
requireText(
  "playwright",
  "launchOptions: { args: localCertificateLaunchArgs }",
  "conditional Chromium launch arguments",
);
forbidText(
  "playwright",
  'args: ["--ignore-certificate-errors"]',
  "unconditional Chromium certificate exception",
);

requireText("apiPolicy", 'if (!policy.development && parsed.protocol !== "https:")', "strict production HTTPS API rule");
forbidText("apiPolicy", "allowInsecureLoopback", "production HTTP loopback exception");

requireText(
  "auth",
  'import.meta.env.VITE_E2E_ACCEPTANCE === "true"',
  "explicit OTP acceptance flag",
);
requireText(
  "auth",
  'import.meta.env.VITE_SITE_ORIGIN === "https://127.0.0.1:4443"',
  "exact acceptance storefront origin",
);
requireText(
  "auth",
  'import.meta.env.VITE_API_BASE_URL === "https://127.0.0.1:8443"',
  "exact acceptance API origin",
);
requireText(
  "auth",
  "import.meta.env.DEV || exposeLoopbackAcceptanceOtpCode",
  "OTP diagnostic exposure boundary",
);
forbidText(
  "auth",
  "devCode: challenge.debugCode,",
  "unconditional backend OTP debug exposure",
);

if (errors.length) {
  console.error(`Phase 7 HTTPS acceptance audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Phase 7 HTTPS acceptance audit passed: storefront and API share an HTTPS site, Chromium trusts only the exact CI loopback certificate, and OTP diagnostics remain loopback-only.",
);
