import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const DIST_DIR = "dist";
const KIB = 1024;
const MIB = 1024 * KIB;

const budgets = {
  entryGzip: 90 * KIB,
  largestJavaScriptGzip: 100 * KIB,
  totalJavaScriptGzip: 450 * KIB,
  largestCssGzip: 40 * KIB,
  largestImage: 1 * MIB,
  minimumJavaScriptChunks: 12,
};

const failures = [];
const warnings = [];

const walk = (directory) =>
  readdirSync(directory).flatMap((name) => {
    const absolutePath = join(directory, name);
    return statSync(absolutePath).isDirectory() ? walk(absolutePath) : [absolutePath];
  });

const formatBytes = (value) => {
  if (value >= MIB) return `${(value / MIB).toFixed(2)} MiB`;
  return `${(value / KIB).toFixed(1)} KiB`;
};

if (!existsSync(DIST_DIR)) {
  console.error("Performance audit requires a completed production build in dist/.");
  process.exit(1);
}

const requiredFiles = [
  "dist/index.html",
  "dist/manifest.webmanifest",
  "dist/sw.js",
  "dist/offline.html",
  "dist/_headers",
  "dist/_redirects",
  "dist/icons/winimi-192.png",
  "dist/icons/winimi-512.png",
  "dist/icons/winimi-apple-touch.png",
  "dist/icons/winimi-192.svg",
  "dist/icons/winimi-512.svg",
];

for (const path of requiredFiles) {
  if (!existsSync(path)) failures.push(`Required production file is missing: ${path}`);
}

const files = walk(DIST_DIR);
const sourceMaps = files.filter((file) => file.endsWith(".map"));
if (sourceMaps.length) {
  failures.push(`Production build contains ${sourceMaps.length} source map file(s).`);
}

const javascriptFiles = files.filter((file) => extname(file) === ".js");
const cssFiles = files.filter((file) => extname(file) === ".css");
const imageFiles = files.filter((file) =>
  [".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"].includes(
    extname(file).toLowerCase(),
  ),
);

const measureGzip = (file) => gzipSync(readFileSync(file), { level: 9 }).byteLength;
const javascript = javascriptFiles.map((file) => ({
  file: relative(DIST_DIR, file),
  bytes: statSync(file).size,
  gzipBytes: measureGzip(file),
}));
const css = cssFiles.map((file) => ({
  file: relative(DIST_DIR, file),
  bytes: statSync(file).size,
  gzipBytes: measureGzip(file),
}));
const images = imageFiles.map((file) => ({
  file: relative(DIST_DIR, file),
  bytes: statSync(file).size,
}));

if (javascript.length < budgets.minimumJavaScriptChunks) {
  failures.push(
    `Only ${javascript.length} JavaScript chunks were generated; expected at least ${budgets.minimumJavaScriptChunks} for route-level splitting.`,
  );
}

const indexHtml = readFileSync("dist/index.html", "utf8");
if (!indexHtml.includes('rel="manifest"')) {
  failures.push("Built index.html does not link to the web app manifest.");
}
if (!indexHtml.includes('/icons/winimi-apple-touch.png')) {
  failures.push("Built index.html does not use the dedicated Apple touch icon.");
}

const entryMatch = indexHtml.match(/<script[^>]+src="([^"]+\.js)"/);
const entryPath = entryMatch?.[1]?.replace(/^\//, "");
const entry = javascript.find((item) => item.file === entryPath);

if (!entry) {
  failures.push("Unable to identify the generated JavaScript entry chunk.");
} else if (entry.gzipBytes > budgets.entryGzip) {
  failures.push(
    `Entry chunk ${entry.file} is ${formatBytes(entry.gzipBytes)} gzip; budget is ${formatBytes(budgets.entryGzip)}.`,
  );
}

const largestJavaScript = [...javascript].sort(
  (a, b) => b.gzipBytes - a.gzipBytes,
)[0];
const totalJavaScriptGzip = javascript.reduce(
  (total, item) => total + item.gzipBytes,
  0,
);
const largestCss = [...css].sort((a, b) => b.gzipBytes - a.gzipBytes)[0];
const largestImage = [...images].sort((a, b) => b.bytes - a.bytes)[0];

if (
  largestJavaScript &&
  largestJavaScript.gzipBytes > budgets.largestJavaScriptGzip
) {
  failures.push(
    `Largest JavaScript chunk ${largestJavaScript.file} is ${formatBytes(largestJavaScript.gzipBytes)} gzip; budget is ${formatBytes(budgets.largestJavaScriptGzip)}.`,
  );
}

if (totalJavaScriptGzip > budgets.totalJavaScriptGzip) {
  failures.push(
    `Total JavaScript is ${formatBytes(totalJavaScriptGzip)} gzip; budget is ${formatBytes(budgets.totalJavaScriptGzip)}.`,
  );
}

if (largestCss && largestCss.gzipBytes > budgets.largestCssGzip) {
  failures.push(
    `Largest CSS file ${largestCss.file} is ${formatBytes(largestCss.gzipBytes)} gzip; budget is ${formatBytes(budgets.largestCssGzip)}.`,
  );
}

if (largestImage && largestImage.bytes > budgets.largestImage) {
  failures.push(
    `Largest image ${largestImage.file} is ${formatBytes(largestImage.bytes)}; budget is ${formatBytes(budgets.largestImage)}.`,
  );
}

for (const image of images.filter((item) => item.bytes > 700 * KIB)) {
  warnings.push(`${image.file} is ${formatBytes(image.bytes)} and should be converted to WebP or AVIF when final media is supplied.`);
}

let serviceWorkerVersion = null;
if (existsSync("dist/sw.js")) {
  const serviceWorker = readFileSync("dist/sw.js", "utf8");
  const versionMatch = serviceWorker.match(/const BUILD_VERSION = "([a-f0-9]{16})";/);
  serviceWorkerVersion = versionMatch?.[1] ?? null;

  if (!serviceWorkerVersion) {
    failures.push("Generated service worker does not contain a 16-character artifact fingerprint.");
  }
  if (serviceWorker.includes("__WINIMI_BUILD_VERSION__")) {
    failures.push("Generated service worker still contains its build-version placeholder.");
  }
  for (const requiredPolicy of [
    "`${CACHE_PREFIX}-shell-${BUILD_VERSION}`",
    "`${CACHE_PREFIX}-assets-${BUILD_VERSION}`",
    "`${CACHE_PREFIX}-images-${BUILD_VERSION}`",
    'cache: "no-store"',
    '"/account"',
    '"/checkout"',
    '"/payment"',
    "if (isSensitiveNavigation(url.pathname))",
    'request.headers.has("range")',
    "url.origin !== self.location.origin",
  ]) {
    if (!serviceWorker.includes(requiredPolicy)) {
      failures.push(`Generated service worker is missing policy: ${requiredPolicy}`);
    }
  }
  if (serviceWorker.includes("caches.match(request)")) {
    failures.push("Generated service worker performs a cross-version global cache lookup.");
  }
}

let manifestSummary = null;
if (existsSync("dist/manifest.webmanifest")) {
  try {
    const manifest = JSON.parse(readFileSync("dist/manifest.webmanifest", "utf8"));
    const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
    manifestSummary = {
      id: manifest.id,
      scope: manifest.scope,
      startUrl: manifest.start_url,
      iconCount: icons.length,
    };

    if (manifest.id !== "/" || manifest.scope !== "/") {
      failures.push("Built manifest must keep root id and scope.");
    }
    if (!icons.some((icon) => icon.src === "/icons/winimi-192.png" && icon.type === "image/png")) {
      failures.push("Built manifest is missing its 192x192 PNG icon.");
    }
    if (!icons.some((icon) => icon.src === "/icons/winimi-512.png" && icon.type === "image/png")) {
      failures.push("Built manifest is missing its 512x512 PNG icon.");
    }
    if (!icons.some((icon) => icon.src === "/icons/winimi-512.png" && String(icon.purpose).includes("maskable"))) {
      failures.push("Built manifest is missing its maskable PNG icon.");
    }
  } catch (error) {
    failures.push(`Built manifest is invalid JSON: ${error.message}`);
  }
}

if (existsSync("dist/_headers")) {
  const headers = readFileSync("dist/_headers", "utf8");
  for (const requiredHeader of [
    "/assets/*\n  Cache-Control: public, max-age=31536000, immutable",
    "/sw.js\n  Cache-Control: no-cache, no-store, must-revalidate",
    "/\n  Cache-Control: no-cache, no-store, must-revalidate",
    "/index.html\n  Cache-Control: no-cache, no-store, must-revalidate",
  ]) {
    if (!headers.includes(requiredHeader)) {
      failures.push(`Built cache policy is missing: ${requiredHeader.split("\n")[0]}`);
    }
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  budgets,
  serviceWorkerVersion,
  manifest: manifestSummary,
  summary: {
    javascriptChunks: javascript.length,
    entry: entry ?? null,
    largestJavaScript: largestJavaScript ?? null,
    totalJavaScriptGzip,
    largestCss: largestCss ?? null,
    largestImage: largestImage ?? null,
    imageCount: images.length,
  },
  largestJavaScriptFiles: [...javascript]
    .sort((a, b) => b.gzipBytes - a.gzipBytes)
    .slice(0, 12),
  largestImages: [...images].sort((a, b) => b.bytes - a.bytes).slice(0, 12),
  warnings,
  failures,
};

writeFileSync("performance-report.json", `${JSON.stringify(report, null, 2)}\n`);

console.log(`JavaScript chunks: ${javascript.length}`);
console.log(`Entry gzip: ${entry ? formatBytes(entry.gzipBytes) : "unknown"}`);
console.log(
  `Largest JavaScript gzip: ${largestJavaScript ? `${largestJavaScript.file} (${formatBytes(largestJavaScript.gzipBytes)})` : "none"}`,
);
console.log(`Total JavaScript gzip: ${formatBytes(totalJavaScriptGzip)}`);
console.log(
  `Largest image: ${largestImage ? `${largestImage.file} (${formatBytes(largestImage.bytes)})` : "none"}`,
);
console.log(`Service worker build: ${serviceWorkerVersion ?? "invalid"}`);

warnings.forEach((warning) => console.warn(`Warning: ${warning}`));

if (failures.length) {
  console.error(`Performance audit failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Performance and PWA budgets passed.");
