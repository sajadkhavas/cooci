import fs from "node:fs";

const failures = [];
const read = (path) => {
  if (!fs.existsSync(path)) {
    failures.push(`Missing required launch file: ${path}`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
};
const requireText = (source, needle, label) => {
  if (!source.includes(needle)) failures.push(`Missing ${label}: ${needle}`);
};

const roadmap = read("docs/FULL_LAUNCH_ROADMAP.md");
const readme = read("README.md");
const env = read(".env.example");

for (const phase of [
  "Phase 17 — Full frontend/backend integration",
  "Phase 18 — End-to-end completion",
  "Phase 19A — production deployment package",
  "Phase 19B — live server execution",
  "Phase 20 — External activation only",
]) {
  requireText(roadmap, phase, "locked roadmap phase");
}
for (const externalInput of [
  "payment gateway credentials / Zarinpal Merchant ID",
  "eNAMAD badge code",
  "SMS provider API key and approved OTP template",
]) {
  requireText(roadmap, externalInput, "external-only input");
}
requireText(roadmap, "production_server_package=ready", "Phase 19A package marker");
requireText(roadmap, "production_deployed=ready", "Phase 19B live marker");
requireText(readme, "Winimi Bakery Storefront", "project identity");
requireText(readme, "Phase 17", "Phase 17 status");
requireText(env, "VITE_USE_BACKEND=true", "integrated backend default");
requireText(env, "VITE_ALLOW_DEV_MOCKS=false", "production mock boundary");

for (const secret of [
  "VITE_ZARINPAL",
  "VITE_KAVENEGAR",
  "VITE_ENAMAD_BADGE_CODE",
  "VITE_MERCHANT_ID",
]) {
  if (env.includes(secret)) failures.push(`Frontend env contains forbidden secret: ${secret}`);
}

if (failures.length) {
  console.error(`Full-launch roadmap audit failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Full-launch roadmap audit passed: Phase 19A package, Phase 19B live execution and exactly three external activations remain locked.");
