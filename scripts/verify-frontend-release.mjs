import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const releaseDir = resolve(process.cwd(), process.argv[2] || "");
if (!releaseDir || !existsSync(releaseDir)) {
  throw new Error("Usage: node scripts/verify-frontend-release.mjs <release-directory>");
}

const manifestPath = join(releaseDir, "release-manifest.json");
const distDir = join(releaseDir, "dist");
if (!existsSync(manifestPath) || !existsSync(distDir)) {
  throw new Error(`Release is incomplete: ${releaseDir}`);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (manifest.format !== "winimi-frontend-release-v1") {
  throw new Error("Unsupported frontend release manifest format.");
}
if (!/^[a-f0-9]{20}$/.test(manifest.releaseId || "")) {
  throw new Error("Release ID is invalid.");
}

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
  });

const actualPaths = walk(distDir)
  .map((filePath) => relative(distDir, filePath).replaceAll("\\", "/"))
  .sort();
const expectedPaths = manifest.files.map((file) => file.path).sort();
if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
  throw new Error("Release file list differs from the signed manifest.");
}

const contentDigest = createHash("sha256");
for (const file of manifest.files) {
  const absolutePath = join(distDir, file.path);
  const bytes = readFileSync(absolutePath);
  const actualHash = createHash("sha256").update(bytes).digest("hex");
  if (actualHash !== file.sha256) throw new Error(`SHA-256 mismatch: ${file.path}`);
  if (statSync(absolutePath).size !== file.bytes) throw new Error(`Size mismatch: ${file.path}`);
  contentDigest.update(file.path);
  contentDigest.update("\0");
  contentDigest.update(actualHash);
  contentDigest.update("\0");
}

const actualReleaseId = contentDigest.digest("hex").slice(0, 20);
if (actualReleaseId !== manifest.releaseId) {
  throw new Error(`Release ID mismatch: expected ${manifest.releaseId}, calculated ${actualReleaseId}`);
}

for (const requiredPath of ["index.html", "offline.html", "manifest.webmanifest", "sw.js"]) {
  if (!actualPaths.includes(requiredPath)) throw new Error(`Missing required release file: ${requiredPath}`);
}

console.log(`Verified frontend release ${manifest.releaseId} (${manifest.fileCount} files).`);
