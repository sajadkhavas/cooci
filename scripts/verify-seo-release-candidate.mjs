import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  validateMergedSeoAcceptance,
  validateSeoReleaseCandidate,
} from "../src/lib/seo/release-candidate.ts";

const candidatePath = path.resolve(process.argv[2] || "seo-release-candidate.json");
const releaseDir = path.resolve(process.argv[3] || "");
const acceptancePath = path.resolve(process.argv[4] || "seo-acceptance-report.json");
const manifestPath = path.join(releaseDir, "release-manifest.json");

for (const requiredPath of [candidatePath, manifestPath, acceptancePath]) {
  if (!fs.existsSync(requiredPath)) throw new Error(`Required verification input is missing: ${requiredPath}`);
}

const candidate = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const manifestBytes = fs.readFileSync(manifestPath);
const acceptanceBytes = fs.readFileSync(acceptancePath);
const manifest = JSON.parse(manifestBytes.toString("utf8"));
const acceptance = JSON.parse(acceptanceBytes.toString("utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

const errors = [
  ...validateSeoReleaseCandidate(candidate),
  ...validateMergedSeoAcceptance(acceptance),
];
if (candidate.releaseId !== manifest.releaseId) errors.push("candidate release ID differs from release manifest");
if (candidate.releaseManifestSha256 !== sha256(manifestBytes)) errors.push("release manifest digest mismatch");
if (candidate.acceptanceReportSha256 !== sha256(acceptanceBytes)) errors.push("acceptance report digest mismatch");
if (manifest.publicBuild?.backendEnabled !== true) errors.push("verified release does not enable backend integration");
if (manifest.publicBuild?.developmentMocks !== false) errors.push("verified release allows development mocks");

if (errors.length) {
  console.error(`SEO release candidate verification failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Verified SEO release candidate ${candidate.releaseId} for ${candidate.acceptedProjects.join(", ")}.`);
