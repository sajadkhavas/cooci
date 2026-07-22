import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const buildDir = resolve(process.cwd(), process.argv[2] || "build");
const releaseRoot = resolve(process.cwd(), process.argv[3] || ".release");
const forbiddenTextPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:sk|pk)-(?:live|proj)-[A-Za-z0-9_-]{16,}\b/,
  /\b(?:ZARINPAL_MERCHANT_ID|KAVENEGAR_API_KEY|ENAMAD_BADGE_CODE|APP_KEY|DB_PASSWORD)\s*=/,
  /\b(?:mysql|postgres(?:ql)?):\/\/[^\s"']+:[^\s"']+@/i,
];
const forbiddenExtensions = new Set([".map", ".pem", ".key", ".env"]);

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
  });

if (!existsSync(buildDir)) {
  throw new Error(`Production build directory is missing: ${buildDir}`);
}

const sourceFiles = walk(buildDir).sort((left, right) => left.localeCompare(right));
if (!sourceFiles.length) throw new Error("Production build directory is empty.");

const files = [];
const errors = [];
for (const absolutePath of sourceFiles) {
  const relativePath = relative(buildDir, absolutePath).replaceAll("\\", "/");
  const bytes = readFileSync(absolutePath);
  const lowerName = relativePath.toLowerCase();
  const extension = [...forbiddenExtensions].find((suffix) => lowerName.endsWith(suffix));
  if (extension) errors.push(`Forbidden release file extension: ${relativePath}`);
  if (/(^|\/)\.(?:env|git|npmrc)(?:$|\/)/i.test(relativePath)) {
    errors.push(`Hidden configuration file is forbidden: ${relativePath}`);
  }
  const printable = bytes.toString("utf8");
  for (const pattern of forbiddenTextPatterns) {
    if (pattern.test(printable)) {
      errors.push(`Secret-shaped content found in ${relativePath}: ${pattern}`);
    }
  }
  files.push({
    path: relativePath,
    bytes: statSync(absolutePath).size,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}

for (const requiredPath of [
  "client/offline.html",
  "client/manifest.webmanifest",
  "client/sw.js",
  "client/_headers",
  "client/_redirects",
  "server/index.js",
  "runtime/server.mjs",
]) {
  if (!files.some((file) => file.path === requiredPath)) {
    errors.push(`Required SSR production file is missing: ${requiredPath}`);
  }
}

if (errors.length) {
  console.error(`Release creation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const contentDigest = createHash("sha256");
for (const file of files) {
  contentDigest.update(file.path);
  contentDigest.update("\0");
  contentDigest.update(file.sha256);
  contentDigest.update("\0");
}
const releaseId = contentDigest.digest("hex").slice(0, 20);
const releaseDir = join(releaseRoot, `frontend-${releaseId}`);
const outputBuild = join(releaseDir, "app", "build");

rmSync(releaseDir, { recursive: true, force: true });
mkdirSync(dirname(outputBuild), { recursive: true });
cpSync(buildDir, outputBuild, { recursive: true, dereference: false });

const manifest = {
  format: "winimi-frontend-ssr-release-v2",
  releaseId,
  runtime: {
    nodeMajor: 22,
    entrypoint: "app/build/runtime/server.mjs",
    healthPath: "/__ssr_health",
    clientRoot: "app/build/client",
  },
  fileCount: files.length,
  totalBytes: files.reduce((total, file) => total + file.bytes, 0),
  publicBuild: {
    siteOrigin: "https://winimibakery.com",
    apiOrigin: "https://api.winimibakery.com",
    backendEnabled: true,
    developmentMocks: false,
  },
  files,
};
writeFileSync(
  join(releaseDir, "release-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
writeFileSync(
  "release-output.json",
  `${JSON.stringify({ releaseId, releaseDir }, null, 2)}\n`,
);
console.log(`Created deterministic SSR frontend release ${releaseId} at ${releaseDir}.`);
