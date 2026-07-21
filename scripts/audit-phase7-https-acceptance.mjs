import fs from "node:fs";

const files = {
  workflow: ".github/workflows/phase18-e2e.yml",
  proxy: "scripts/https-loopback-proxy.mjs",
  playwright: "e2e/playwright.config.mjs",
  apiPolicy: "src/lib/security/api-url.ts",
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
  "VITE_API_BASE_URL: https://127.0.0.1:8443",
  "HTTPS API URL for production browser acceptance",
);
requireText("workflow", "Start ephemeral HTTPS API proxy", "ephemeral TLS proxy step");
requireText("workflow", "openssl req -x509 -newkey rsa:2048 -nodes", "ephemeral certificate generation");
requireText("workflow", "-days 1", "one-day certificate lifetime");
requireText("workflow", "HTTPS_PROXY_TARGET=http://127.0.0.1:8000", "loopback Laravel target");
requireText("workflow", "curl --fail --silent --insecure https://127.0.0.1:8443/api/system/ready", "HTTPS proxy readiness check");
forbidText("workflow", ".ci-tls/api-proxy.key\n            ", "private key artifact upload");

requireText("proxy", "https.createServer", "HTTPS listener");
requireText("proxy", "http.request", "HTTP loopback upstream");
requireText("proxy", 'target.protocol !== "http:"', "HTTP-only upstream guard");
requireText("proxy", '"x-forwarded-proto": "https"', "forwarded HTTPS protocol");

requireText("playwright", "allowLocalSelfSignedCertificate", "scoped self-signed certificate policy");
requireText("playwright", 'process.env.CI === "true"', "CI-only certificate exception");
requireText("playwright", 'baseURL.startsWith("http://127.0.0.1:")', "loopback-only certificate exception");
requireText("playwright", "ignoreHTTPSErrors: allowLocalSelfSignedCertificate", "conditional TLS exception");

requireText("apiPolicy", 'if (!policy.development && parsed.protocol !== "https:")', "strict production HTTPS API rule");
forbidText("apiPolicy", "allowInsecureLoopback", "production HTTP loopback exception");

if (errors.length) {
  console.error(`Phase 7 HTTPS acceptance audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Phase 7 HTTPS acceptance audit passed: production keeps strict HTTPS while CI uses an ephemeral loopback TLS proxy.",
);
