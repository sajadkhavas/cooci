import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  SEO_RELEASE_CANDIDATE_FORMAT,
  SEO_RELEASE_MARKER,
  validateMergedSeoAcceptance,
  validateSeoReleaseCandidate,
} from "../src/lib/seo/release-candidate.ts";

const releaseDir = path.resolve(process.argv[2] || "");
const acceptancePath = path.resolve(process.argv[3] || "seo-acceptance-report.json");
const outputPath = path.resolve(process.argv[4] || "seo-release-candidate.json");
const manifestPath = path.join(releaseDir, "release-manifest.json");

for (const requiredPath of [manifestPath, acceptancePath]) {
  if (!fs.existsSync(requiredPath)) throw new Error(`Required release candidate input is missing: ${requiredPath}`);
}

const manifestBytes = fs.readFileSync(manifestPath);
const acceptanceBytes = fs.readFileSync(acceptancePath);
const manifest = JSON.parse(manifestBytes.toString("utf8"));
const acceptance = JSON.parse(acceptanceBytes.toString("utf8"));
const acceptanceErrors = validateMergedSeoAcceptance(acceptance);
if (acceptanceErrors.length) {
  throw new Error(`SEO acceptance report is invalid: ${acceptanceErrors.join("; ")}`);
}
if (manifest.format !== "winimi-frontend-ssr-release-v2") {
  throw new Error("Unsupported frontend release manifest format.");
}
if (manifest.publicBuild?.siteOrigin !== "https://winimibakery.com") {
  throw new Error("Release site origin is not production.");
}
if (manifest.publicBuild?.apiOrigin !== "https://api.winimibakery.com") {
  throw new Error("Release API origin is not production.");
}
if (manifest.publicBuild?.backendEnabled !== true || manifest.publicBuild?.developmentMocks !== false) {
  throw new Error("Release backend/mock boundary is invalid.");
}

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const candidate = {
  format: SEO_RELEASE_CANDIDATE_FORMAT,
  marker: SEO_RELEASE_MARKER,
  generatedAt: new Date().toISOString(),
  releaseId: manifest.releaseId,
  backendContract: "2026-07-20-phase-16",
  releaseManifestSha256: sha256(manifestBytes),
  acceptanceReportSha256: sha256(acceptanceBytes),
  acceptedProjects: acceptance.projects.map((project) => project.project).sort(),
  publicBuild: {
    siteOrigin: manifest.publicBuild.siteOrigin,
    apiOrigin: manifest.publicBuild.apiOrigin,
    backendEnabled: manifest.publicBuild.backendEnabled,
    developmentMocks: manifest.publicBuild.developmentMocks,
  },
};
const candidateErrors = validateSeoReleaseCandidate(candidate);
if (candidateErrors.length) {
  throw new Error(`SEO release candidate is invalid: ${candidateErrors.join("; ")}`);
}

fs.writeFileSync(outputPath, `${JSON.stringify(candidate, null, 2)}\n`);
console.log(`Created SEO release candidate ${candidate.releaseId} at ${outputPath}.`);
