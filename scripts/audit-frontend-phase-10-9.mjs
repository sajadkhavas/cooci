import fs from "node:fs";

const files = {
  docs: "docs/FRONTEND_PHASE_10_9_SEO_ACCEPTANCE_RELEASE_CANDIDATE.md",
  roadmap: "docs/FULL_LAUNCH_ROADMAP.md",
  readme: "README.md",
  package: "package.json",
  contract: "src/lib/seo/release-candidate.ts",
  unit: "tests/unit/seo-release-candidate.test.ts",
  e2e: "e2e/phase10-9-seo-release-candidate.spec.mjs",
  playwright: "e2e/playwright.config.mjs",
  mergeReports: "scripts/merge-seo-acceptance-reports.mjs",
  createCandidate: "scripts/create-seo-release-candidate.mjs",
  verifyCandidate: "scripts/verify-seo-release-candidate.mjs",
  deploymentSnapshot: "scripts/verify-seo-deployment-snapshot.mjs",
  releaseCreate: "scripts/create-frontend-release.mjs",
  releaseVerify: "scripts/verify-frontend-release.mjs",
  frontendCi: ".github/workflows/frontend-ci.yml",
  deployment: ".github/workflows/phase8-deployment.yml",
  phase18: ".github/workflows/phase18-e2e.yml",
};

const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 10.9 file: ${path}`);
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

requireText("docs", "seo_release_candidate=ready", "final Phase 10.9 marker");
requireText("roadmap", "Phase 10.9 — SEO acceptance and release candidate — complete");
requireText("readme", "SEO acceptance and release candidate | Complete in Phase 10.9");
requireText("contract", "winimi-seo-acceptance-v1", "acceptance report format");
requireText("contract", "winimi-seo-release-candidate-v1", "release candidate format");
requireText("contract", "desktop-chromium", "desktop acceptance requirement");
requireText("contract", "mobile-chromium", "mobile acceptance requirement");
requireText("contract", "2026-07-20-phase-16", "frozen backend contract");
requireText("unit", "matching desktop and mobile evidence", "viewport evidence unit gate");
requireText("unit", "locks hashes, production origins and backend boundary", "attestation unit gate");

requireText("e2e", "every sitemap URL passes raw HTML", "sitemap-driven crawl suite");
requireText("e2e", "exactly one canonical", "canonical uniqueness gate");
requireText("e2e", "h1Count", "H1 acceptance gate");
requireText("e2e", "extractJsonLd", "JSON-LD parser");
requireText("e2e", "Organization", "brand entity gate");
requireText("e2e", "WebSite", "website entity gate");
requireText("e2e", "broken internal link", "internal link integrity gate");
requireText("e2e", "noindex,follow", "filtered URL gate");
requireText("e2e", "noindex, nofollow", "private and missing URL gate");
requireText("e2e", "seo-acceptance-${testInfo.project.name}.json", "per-project evidence");
forbidText("e2e", "products?category=", "legacy category query link allowance");

requireText("mergeReports", "validateMergedSeoAcceptance", "desktop/mobile merge validation");
requireText("createCandidate", "releaseManifestSha256", "release manifest attestation");
requireText("createCandidate", "acceptanceReportSha256", "acceptance report attestation");
requireText("verifyCandidate", "digest mismatch", "tamper verification");
requireText("deploymentSnapshot", "seo-deployment-acceptance.json", "deployment SEO evidence");
requireText("releaseCreate", "release-manifest.json", "deterministic release manifest");
requireText("releaseVerify", "SHA-256 mismatch", "release file integrity verification");

requireText("playwright", "phase10-9-seo-release-candidate.spec.mjs", "Playwright Phase 10.9 registration");
requireText("frontendCi", "Frontend SEO acceptance and release candidate Phase 10.9", "CI Phase 10.9 gate");
requireText("deployment", "audit:phase10-9", "deployment Phase 10.9 audit");
requireText("deployment", "Verify SEO release candidate deployment snapshot", "deployment snapshot gate");
requireText("phase18", "Run Phase 10.9 SEO acceptance and release candidate", "Laravel Phase 10.9 browser gate");
requireText("phase18", "Create and verify SEO release candidate attestation", "final candidate attestation gate");
requireText("package", '"audit:phase10-9"', "Phase 10.9 audit command");
requireText("package", '"seo:acceptance:merge"', "acceptance merge command");
requireText("package", '"seo:rc:create"', "candidate creation command");
requireText("package", '"seo:rc:verify"', "candidate verification command");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
};
fs.writeFileSync("frontend-phase10-9-audit.json", `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) {
  console.error(`Frontend Phase 10.9 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(
  "Frontend Phase 10.9 audit passed: sitemap-wide raw HTML acceptance, status policy, internal-link integrity and cryptographic release candidate evidence are locked.",
);
