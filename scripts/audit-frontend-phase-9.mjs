import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = {
  threatModel: "docs/FRONTEND_FULL_AUDIT_PHASE_9.md",
  finalAudit: "docs/FRONTEND_SECURITY_AND_DEPLOYMENT_AUDIT.md",
  matrix: "e2e/phase9-matrix.json",
  adversarialE2e: "e2e/phase9-adversarial.spec.mjs",
  proxy: "scripts/https-loopback-proxy.mjs",
  pwaE2e: "e2e/phase7-pwa.spec.mjs",
  playwright: "e2e/playwright.config.mjs",
  coordinatedAudit: "scripts/audit-phase9-coordinated.mjs",
  package: "package.json",
  frontendWorkflow: ".github/workflows/frontend-ci.yml",
  acceptanceWorkflow: ".github/workflows/phase18-e2e.yml",
  deploymentWorkflow: ".github/workflows/phase8-deployment.yml",
  productionEnv: "deploy/frontend.production.env.example",
};

const errors = [];
const sources = {};
for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing Phase 9 file: ${filePath}`);
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

requireText("threatModel", "A scenario is accepted only when it has machine-verifiable evidence", "machine evidence rule");
requireText("threatModel", "payment cancellation, failure, success and duplicate verification replay", "payment adversarial matrix");
requireText("threatModel", "frontend_security_and_deployment_audited=ready", "final marker");
requireText("finalAudit", "Final marker: `frontend_security_and_deployment_audited=ready`", "final audit marker");
requireText("finalAudit", "Production DNS/server deployment and live-provider verification are operational launch activities", "operational boundary");

let matrix;
try {
  matrix = JSON.parse(sources.matrix || "");
} catch (error) {
  errors.push(`${files.matrix}: invalid JSON (${error.message})`);
}

const expectedScenarios = [
  "desktop-mobile-browser-matrix",
  "offline-reconnect",
  "expired-session",
  "rate-limit-retry",
  "stale-tampered-cart",
  "changed-stock",
  "changed-delivery-zone",
  "duplicate-submit-idempotency",
  "payment-terminal-and-replay",
  "hostile-url-inputs",
  "deployment-security-rollback",
  "final-marker",
];
const checkedFrontendEvidence = [];

const verifyEvidence = (evidence, scenarioId) => {
  const separator = evidence.indexOf("::");
  if (separator <= 0 || separator === evidence.length - 2) {
    errors.push(`${scenarioId}: malformed frontend evidence pointer ${evidence}`);
    return;
  }
  const relativePath = evidence.slice(0, separator);
  const token = evidence.slice(separator + 2);
  const absolutePath = path.resolve(root, relativePath);
  if (!absolutePath.startsWith(`${root}${path.sep}`)) {
    errors.push(`${scenarioId}: frontend evidence escapes repository root: ${relativePath}`);
    return;
  }
  if (!fs.existsSync(absolutePath)) {
    errors.push(`${scenarioId}: frontend evidence file is missing: ${relativePath}`);
    return;
  }
  const source = fs.readFileSync(absolutePath, "utf8");
  if (!source.includes(token)) {
    errors.push(`${scenarioId}: frontend evidence token is missing in ${relativePath}: ${token}`);
    return;
  }
  checkedFrontendEvidence.push({ scenarioId, path: relativePath, token });
};

if (matrix) {
  if (matrix.version !== "2026-07-21-phase-9") {
    errors.push(`${files.matrix}: unexpected matrix version ${matrix.version}`);
  }
  if (matrix.finalMarker !== "frontend_security_and_deployment_audited=ready") {
    errors.push(`${files.matrix}: final marker mismatch`);
  }
  const actualIds = (matrix.scenarios || []).map((scenario) => scenario.id);
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedScenarios)) {
    errors.push(`${files.matrix}: scenario order or membership changed`);
  }
  for (const scenario of matrix.scenarios || []) {
    if (!Array.isArray(scenario.frontendEvidence) || scenario.frontendEvidence.length === 0) {
      errors.push(`${scenario.id}: frontend evidence is required`);
      continue;
    }
    for (const pointer of scenario.frontendEvidence) verifyEvidence(pointer, scenario.id);
  }
}

requireText(
  "adversarialE2e",
  "rate-limited server render fails closed and recovers on clean request",
  "SSR 429 recovery browser test",
);
requireText("adversarialE2e", "expect(limitedResponse?.status()).toBe(503)", "fail-closed SSR status");
requireText("adversarialE2e", 'headers()["retry-after"]', "Retry-After propagation evidence");
requireText("adversarialE2e", 'headers()["x-robots-tag"]', "SSR noindex header evidence");
requireText("adversarialE2e", "hostile encoded query values remain inert", "hostile URL browser test");
requireText("adversarialE2e", "window.__phase9Xss", "XSS canary");
requireText("adversarialE2e", "externalRequests", "external request canary");
requireText("proxy", "HTTPS_PROXY_RATE_LIMIT_SEARCH_VALUE", "deterministic SSR rate-limit injection");
requireText("proxy", "writeCatalogRateLimit", "structured 429 response");
requireText(
  "pwaE2e",
  "network restoration returns to the live server-rendered application",
  "SSR PWA reconnect assertion",
);
requireText("pwaE2e", "#main-content", "live application restoration target");
requireText("pwaE2e", "navigationCacheKey", "route-aware PWA evidence");
requireText("playwright", '"phase9-adversarial.spec.mjs"', "Phase 9 Playwright inclusion");
requireText("coordinatedAudit", "checkedBackendEvidence", "backend evidence ledger");
requireText("coordinatedAudit", "assertTooManyRequests()", "backend 429 invariant");
requireText("coordinatedAudit", "InventoryReservationStatus::Consumed", "backend stock-consumption invariant");

requireText("package", '"audit:phase9"', "Phase 9 audit command");
requireText("package", "npm run audit:phase9", "Phase 9 check gate");
requireText("frontendWorkflow", "Frontend full-audit Phase 9", "Phase 9 frontend CI step");
requireText("frontendWorkflow", "frontend-phase9-audit.json", "Phase 9 frontend diagnostic");
requireText("acceptanceWorkflow", "Phase 9 coordinated adversarial audit", "coordinated backend audit step");
requireText("acceptanceWorkflow", "HTTPS_PROXY_RATE_LIMIT_SEARCH_VALUE", "SSR rate-limit proxy configuration");
requireText("acceptanceWorkflow", "Run final adversarial acceptance — Phase 9", "Phase 9 browser step");
requireText("acceptanceWorkflow", "phase9-adversarial.log", "Phase 9 browser evidence artifact");
requireText("acceptanceWorkflow", "phase9-coordinated-audit.json", "Phase 9 coordinated evidence artifact");
requireText("deploymentWorkflow", "Rollback to release A", "Phase 8 rollback evidence");
requireText("deploymentWorkflow", "Run HTTPS production smoke test", "Phase 8 HTTPS evidence");

for (const forbidden of [
  "ZARINPAL_MERCHANT_ID=",
  "ENAMAD_BADGE_CODE=",
  "KAVENEGAR_API_KEY=",
  "VITE_E2E_ACCEPTANCE=",
]) {
  forbidText("productionEnv", forbidden, `external or acceptance credential ${forbidden}`);
}

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  matrixVersion: matrix?.version,
  scenarioCount: matrix?.scenarios?.length ?? 0,
  checkedFrontendEvidence,
  finalMarker: matrix?.finalMarker,
  errors,
};
fs.writeFileSync("frontend-phase9-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Frontend Phase 9 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Frontend Phase 9 audit passed: ${expectedScenarios.length} adversarial scenarios and ${checkedFrontendEvidence.length} frontend evidence pointer(s), including SSR PWA recovery, are locked; frontend_security_and_deployment_audited=ready.`,
);
