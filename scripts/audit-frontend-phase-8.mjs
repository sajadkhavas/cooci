import fs from "node:fs";

const files = {
  threatModel: "docs/FRONTEND_FULL_AUDIT_PHASE_8.md",
  envSchema: "deploy/frontend.production.env.schema.json",
  envExample: "deploy/frontend.production.env.example",
  envValidator: "scripts/validate-production-env.mjs",
  releaseCreator: "scripts/create-frontend-release.mjs",
  releaseVerifier: "scripts/verify-frontend-release.mjs",
  deploy: "deploy/bin/deploy-frontend.sh",
  rollback: "deploy/bin/rollback-frontend.sh",
  smoke: "deploy/bin/smoke-test-frontend.sh",
  nginx: "deploy/nginx/winimi-frontend.conf.example",
  securityHeaders: "deploy/nginx/winimi-security-headers.conf",
  nginxRenderer: "scripts/render-frontend-nginx.mjs",
  deployReadme: "deploy/README.md",
  package: "package.json",
  frontendWorkflow: ".github/workflows/frontend-ci.yml",
  deploymentWorkflow: ".github/workflows/phase8-deployment.yml",
};

const errors = [];
const sources = {};
for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing Phase 8 file: ${filePath}`);
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

requireText("threatModel", "Vite environment variables are public build inputs", "public Vite boundary");
requireText("threatModel", "atomic `current` symlink switch", "atomic deployment boundary");
requireText("threatModel", "Production smoke checks", "HTTPS smoke boundary");

let schema;
try {
  schema = JSON.parse(sources.envSchema || "");
} catch (error) {
  errors.push(`${files.envSchema}: invalid JSON (${error.message})`);
}
const expectedPublicVariables = [
  "SITE_URL",
  "VITE_SITE_ORIGIN",
  "VITE_USE_BACKEND",
  "VITE_API_BASE_URL",
  "VITE_ALLOW_DEV_MOCKS",
  "VITE_AUTH_MODE",
  "VITE_PAYMENT_MODE",
];
if (schema) {
  const actual = Object.keys(schema.variables || {}).sort();
  if (JSON.stringify(actual) !== JSON.stringify([...expectedPublicVariables].sort())) {
    errors.push(`${files.envSchema}: production public variable set changed`);
  }
  if (schema.unknownViteVariables !== "reject") {
    errors.push(`${files.envSchema}: unknown VITE variables must be rejected`);
  }
  for (const forbidden of [
    "APP_KEY",
    "DB_PASSWORD",
    "ENAMAD_BADGE_CODE",
    "KAVENEGAR_API_KEY",
    "ZARINPAL_MERCHANT_ID",
    "VITE_E2E_ACCEPTANCE",
  ]) {
    if (!schema.forbiddenNames?.includes(forbidden)) {
      errors.push(`${files.envSchema}: missing forbidden variable ${forbidden}`);
    }
  }
}

for (const line of [
  "SITE_URL=https://winimibakery.com",
  "VITE_SITE_ORIGIN=https://winimibakery.com",
  "VITE_USE_BACKEND=true",
  "VITE_API_BASE_URL=https://api.winimibakery.com",
  "VITE_ALLOW_DEV_MOCKS=false",
  "VITE_AUTH_MODE=disabled",
  "VITE_PAYMENT_MODE=disabled",
]) {
  requireText("envExample", line, `production environment value ${line}`);
}
forbidText("envExample", "VITE_E2E_ACCEPTANCE", "acceptance-only build flag");
forbidText("envExample", "KEY=", "secret-like environment placeholder");

requireText("envValidator", "Unknown VITE variable is forbidden", "unknown VITE rejection");
requireText("envValidator", "Secret-shaped VITE variable is forbidden", "secret-shaped VITE rejection");
requireText("releaseCreator", 'createHash("sha256")', "SHA-256 release hashing");
requireText("releaseCreator", "forbiddenTextPatterns", "release secret scan");
requireText("releaseCreator", '"winimi-frontend-release-v1"', "release manifest format");
requireText("releaseVerifier", "SHA-256 mismatch", "file integrity verification");
requireText("releaseVerifier", "Release ID mismatch", "content ID verification");

requireText("deploy", "set -Eeuo pipefail", "strict deploy shell");
requireText("deploy", "verify-frontend-release.mjs", "pre/post deployment verification");
requireText("deploy", "mv -Tf", "atomic symlink replacement");
requireText("rollback", "verify-frontend-release.mjs", "rollback target verification");
requireText("rollback", "mv -Tf", "atomic rollback switch");
requireText("smoke", "/__frontend_health", "frontend health smoke check");
requireText("smoke", "strict-transport-security", "HSTS smoke check");
requireText("smoke", "content-security-policy", "CSP smoke check");
requireText("smoke", "content-encoding: gzip", "gzip smoke check");
requireText("smoke", "nonexistent.js.map", "source-map denial smoke check");

requireText("nginx", "include __SECURITY_HEADERS_INCLUDE__;", "security header include");
const includeCount = (sources.nginx?.match(/include __SECURITY_HEADERS_INCLUDE__;/g) || []).length;
if (includeCount < 7) errors.push(`${files.nginx}: security headers must be included in server and header-overriding locations`);
requireText("nginx", "gzip on;", "gzip compression");
requireText("nginx", "try_files $uri $uri/ /index.html;", "SPA fallback");
requireText("nginx", 'Cache-Control "public, max-age=31536000, immutable"', "immutable assets");
requireText("nginx", 'Cache-Control "no-cache, no-store, must-revalidate"', "application shell revalidation");
requireText("nginx", "location = /__frontend_health", "frontend health endpoint");
forbidText("nginx", "Content-Security-Policy-Report-Only", "report-only CSP");

requireText("securityHeaders", 'Strict-Transport-Security "max-age=31536000; includeSubDomains"', "enforced HSTS");
requireText("securityHeaders", 'Content-Security-Policy "default-src', "enforced CSP");
requireText("securityHeaders", 'frame-ancestors \'none\'', "frame CSP boundary");
forbidText("securityHeaders", "Content-Security-Policy-Report-Only", "report-only CSP");
forbidText("securityHeaders", "'unsafe-eval'", "unsafe-eval CSP");

requireText("nginxRenderer", "Unresolved Nginx placeholders", "placeholder completeness guard");
requireText("nginxRenderer", "Unsafe script execution is forbidden", "CSP render guard");
requireText("nginxRenderer", "FRONTEND_SECURITY_HEADERS_INCLUDE", "security snippet render value");
requireText("deployReadme", "Release ID is a SHA-256-derived content identifier", "release reproducibility documentation");
requireText("deployReadme", "partial copy can never become active", "atomic deployment documentation");
requireText("deployReadme", "add_header` inheritance", "Nginx header inheritance documentation");
requireText("deployReadme", "Rollback must be exercised once in staging", "rollback drill documentation");

requireText("package", '"audit:phase8"', "Phase 8 audit command");
requireText("package", '"release:create"', "release creation command");
requireText("package", '"release:verify"', "release verification command");
requireText("frontendWorkflow", "Frontend full-audit Phase 8", "Phase 8 frontend CI gate");
requireText("frontendWorkflow", "frontend-phase8-audit.json", "Phase 8 diagnostic artifact");
requireText("deploymentWorkflow", "Reproducible release, Nginx, deploy and rollback", "deployment workflow job");
requireText("deploymentWorkflow", "Deploy release A", "first deployment simulation");
requireText("deploymentWorkflow", "Deploy release B", "second deployment simulation");
requireText("deploymentWorkflow", "Rollback to release A", "rollback simulation");
requireText("deploymentWorkflow", "Run HTTPS production smoke test", "HTTPS smoke gate");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  publicVariableCount: schema ? Object.keys(schema.variables || {}).length : 0,
  securityIncludeCount: includeCount,
  errors,
};
fs.writeFileSync("frontend-phase8-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Frontend Phase 8 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 8 audit passed: public environment, secret-free deterministic releases, atomic deploy/rollback, inherited Nginx security and HTTPS smoke gates are locked.",
);
