import fs from "node:fs";

const requiredFiles = {
  package: "package.json",
  workflow: ".github/workflows/phase18-e2e.yml",
  config: "e2e/playwright.config.mjs",
  spec: "e2e/phase18.spec.mjs",
  roadmap: "docs/FULL_LAUNCH_ROADMAP.md",
  topology: "docs/SINGLE_SERVER_TOPOLOGY.md",
  api: "src/lib/api.ts",
};

const sources = {};
const errors = [];

for (const [name, path] of Object.entries(requiredFiles)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 18 file: ${path}`);
    continue;
  }
  sources[name] = fs.readFileSync(path, "utf8");
}

const requireText = (source, needle, label) => {
  if (!sources[source]?.includes(needle)) {
    errors.push(`${requiredFiles[source]}: missing ${label}`);
  }
};

const forbidText = (source, needle, label) => {
  if (sources[source]?.includes(needle)) {
    errors.push(`${requiredFiles[source]}: contains forbidden ${label}`);
  }
};

requireText("package", '"audit:acceptance"', "Phase 18 audit script");
requireText("package", '"test:e2e"', "browser acceptance script");
requireText("workflow", "winimi-bakery-backend", "coordinated backend checkout");
requireText("workflow", "WinimiStagingSeeder", "deterministic staging seed");
requireText("workflow", "@playwright/test@1.55.0", "pinned browser runner");
requireText("workflow", "VITE_ALLOW_DEV_MOCKS: \"false\"", "mock-disabled browser mode");
requireText("workflow", "PAYMENT_PROVIDER: testing", "non-live payment provider");
requireText("workflow", "OTP_EXPOSE_TEST_CODE: \"true\"", "non-production OTP test code");
requireText("config", 'devices["Desktop Chrome"]', "desktop Chromium project");
requireText("config", 'devices["Pixel 7"]', "mobile Chromium project");
requireText("spec", "/api/system/contracts", "contract acceptance");
requireText("spec", "2026-07-20-phase-16", "frozen contract assertion");
requireText("spec", "2026-07-20-phase-18", "roadmap assertion");
requireText("spec", "loginWithTestingOtp", "real OTP browser journey");
requireText("spec", "credentials: \"include\"", "cookie session assertion");
requireText("spec", "کوکی شکلاتی تست", "backend catalog assertion");
requireText("spec", "horizontalOverflow", "mobile layout assertion");
requireText("roadmap", "Status: `end_to_end_verified=ready`", "Phase 18 readiness marker");
requireText("topology", "one Linux server", "single-server declaration");
requireText("topology", "api.winimibakery.com", "backend virtual host");
requireText("api", 'EXPECTED_API_CONTRACT_VERSION = "2026-07-20-phase-16"', "frozen API contract guard");

forbidText("workflow", "ZARINPAL_MERCHANT_ID:", "live payment credential");
forbidText("workflow", "KAVENEGAR_API_KEY:", "live SMS credential");
forbidText("workflow", "VITE_ALLOW_DEV_MOCKS: \"true\"", "browser mock mode");
forbidText("spec", "/payment/mock", "browser-only payment simulation");

if (errors.length) {
  console.error(`Phase 18 frontend acceptance audit failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log("Phase 18 frontend acceptance audit passed: desktop/mobile Chromium, real Laravel session, frozen contract and single-server handoff are locked.");
