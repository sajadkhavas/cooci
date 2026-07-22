import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";

const CLIENT_DIR = resolve(process.cwd(), "build/client");
const TEMPLATE_PATH = resolve(process.cwd(), "scripts/service-worker.template.js");
const OUTPUT_PATH = join(CLIENT_DIR, "sw.js");
const VERSION_PLACEHOLDER = "__WINIMI_BUILD_VERSION__";

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
  });

if (!existsSync(CLIENT_DIR)) {
  throw new Error(
    "Service worker generation requires a completed React Router build in build/client/.",
  );
}
if (!existsSync(TEMPLATE_PATH)) {
  throw new Error("Service worker template is missing: " + TEMPLATE_PATH);
}

const template = readFileSync(TEMPLATE_PATH, "utf8");
const placeholderCount = template.split(VERSION_PLACEHOLDER).length - 1;
if (placeholderCount !== 1) {
  throw new Error(
    "Service worker template must contain exactly one " +
      VERSION_PLACEHOLDER +
      " placeholder.",
  );
}

const fingerprint = createHash("sha256");
fingerprint.update(template);
for (const filePath of walk(CLIENT_DIR)
  .filter((filePath) => filePath !== OUTPUT_PATH)
  .sort((left, right) => left.localeCompare(right))) {
  const stats = statSync(filePath);
  fingerprint.update(relative(CLIENT_DIR, filePath));
  fingerprint.update(String(stats.size));
  fingerprint.update(readFileSync(filePath));
}

const buildVersion = fingerprint.digest("hex").slice(0, 16);
const serviceWorker = template.replace(VERSION_PLACEHOLDER, buildVersion);
writeFileSync(OUTPUT_PATH, serviceWorker.trimEnd() + "\n");
console.log("Generated build/client/sw.js for build " + buildVersion + ".");
