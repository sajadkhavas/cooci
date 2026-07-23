import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { extname, join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const CLIENT_DIR = "build/client";
const RUNTIME_DIR = "build/runtime";
const KIB = 1024;
const MIB = 1024 * KIB;
const budgets = {
  largestJavaScriptGzip: 150 * KIB,
  totalJavaScriptGzip: 700 * KIB,
  largestCssGzip: 50 * KIB,
  largestImage: 750 * KIB,
  totalImageBytes: 5 * MIB,
  minimumJavaScriptChunks: 12,
  runtimeBundleGzip: 2.5 * MIB,
};
const failures = [];
const warnings = [];
const walk = (directory) =>
  readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const gzipBytes = (file) => gzipSync(readFileSync(file), { level: 9 }).byteLength;
const formatBytes = (value) =>
  value >= MIB
    ? (value / MIB).toFixed(2) + " MiB"
    : (value / KIB).toFixed(1) + " KiB";

for (const directory of [CLIENT_DIR, RUNTIME_DIR]) {
  if (!existsSync(directory)) failures.push("Missing production directory: " + directory);
}
for (const path of [
  "build/client/manifest.webmanifest",
  "build/client/sw.js",
  "build/client/offline.html",
  "build/client/icons/winimi-192.png",
  "build/client/icons/winimi-512.png",
  "build/runtime/server.mjs",
]) {
  if (!existsSync(path)) failures.push("Required production file is missing: " + path);
}

const clientFiles = existsSync(CLIENT_DIR) ? walk(CLIENT_DIR) : [];
const runtimeFiles = existsSync(RUNTIME_DIR) ? walk(RUNTIME_DIR) : [];
const allFiles = [...clientFiles, ...runtimeFiles];
const sourceMaps = allFiles.filter((file) => file.endsWith(".map"));
if (sourceMaps.length) failures.push("Production output contains source maps.");

const javascript = clientFiles
  .filter((file) => [".js", ".mjs"].includes(extname(file)))
  .map((file) => ({
    file: relative(CLIENT_DIR, file),
    bytes: statSync(file).size,
    gzipBytes: gzipBytes(file),
  }));
const css = clientFiles
  .filter((file) => extname(file) === ".css")
  .map((file) => ({
    file: relative(CLIENT_DIR, file),
    bytes: statSync(file).size,
    gzipBytes: gzipBytes(file),
  }));
const images = clientFiles
  .filter((file) =>
    [".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"].includes(
      extname(file).toLowerCase(),
    ),
  )
  .map((file) => ({ file: relative(CLIENT_DIR, file), bytes: statSync(file).size }));
const runtime = runtimeFiles
  .filter((file) => [".js", ".mjs"].includes(extname(file)))
  .map((file) => ({
    file: relative(RUNTIME_DIR, file),
    bytes: statSync(file).size,
    gzipBytes: gzipBytes(file),
  }));

if (javascript.length < budgets.minimumJavaScriptChunks) {
  failures.push(
    "Only " + javascript.length +
      " client JavaScript chunks were generated; route-module splitting is missing.",
  );
}
const largestJavaScript = [...javascript].sort((a, b) => b.gzipBytes - a.gzipBytes)[0];
const totalJavaScriptGzip = javascript.reduce((total, item) => total + item.gzipBytes, 0);
const largestCss = [...css].sort((a, b) => b.gzipBytes - a.gzipBytes)[0];
const largestImage = [...images].sort((a, b) => b.bytes - a.bytes)[0];
const totalImageBytes = images.reduce((total, item) => total + item.bytes, 0);
const runtimeGzip = runtime.reduce((total, item) => total + item.gzipBytes, 0);
if (largestJavaScript?.gzipBytes > budgets.largestJavaScriptGzip) {
  failures.push(
    "Largest client JavaScript chunk exceeds budget: " +
      largestJavaScript.file + " (" + formatBytes(largestJavaScript.gzipBytes) + ")",
  );
}
if (totalJavaScriptGzip > budgets.totalJavaScriptGzip) {
  failures.push("Total client JavaScript exceeds budget: " + formatBytes(totalJavaScriptGzip));
}
if (largestCss?.gzipBytes > budgets.largestCssGzip) {
  failures.push("Largest CSS exceeds budget: " + formatBytes(largestCss.gzipBytes));
}
if (largestImage?.bytes > budgets.largestImage) {
  failures.push(
    "Largest image exceeds Phase 10.8 budget: " +
      largestImage.file + " (" + formatBytes(largestImage.bytes) + ")",
  );
}
if (totalImageBytes > budgets.totalImageBytes) {
  failures.push(
    "Total production image bytes exceed Phase 10.8 budget: " +
      formatBytes(totalImageBytes),
  );
}
if (runtimeGzip > budgets.runtimeBundleGzip) {
  failures.push("Bundled SSR runtime exceeds budget: " + formatBytes(runtimeGzip));
}

let serviceWorkerVersion = null;
if (existsSync("build/client/sw.js")) {
  const serviceWorker = readFileSync("build/client/sw.js", "utf8");
  serviceWorkerVersion = serviceWorker.match(/const BUILD_VERSION = "([a-f0-9]{16})";/)?.[1] || null;
  if (!serviceWorkerVersion) failures.push("Service worker fingerprint is missing.");
  if (serviceWorker.includes("__WINIMI_BUILD_VERSION__")) {
    failures.push("Service worker placeholder remains in production output.");
  }
}

let manifestSummary = null;
if (existsSync("build/client/manifest.webmanifest")) {
  try {
    const manifest = JSON.parse(readFileSync("build/client/manifest.webmanifest", "utf8"));
    manifestSummary = {
      id: manifest.id,
      scope: manifest.scope,
      startUrl: manifest.start_url,
      iconCount: Array.isArray(manifest.icons) ? manifest.icons.length : 0,
    };
    if (manifest.id !== "/" || manifest.scope !== "/") {
      failures.push("Manifest must keep root id and scope.");
    }
  } catch (error) {
    failures.push("Manifest JSON is invalid: " + error.message);
  }
}

for (const image of images.filter((item) => item.bytes > 500 * KIB)) {
  warnings.push(item.file + " is " + formatBytes(item.bytes) + ".");
}
const report = {
  generatedAt: new Date().toISOString(),
  mode: "react-router-framework-ssr",
  budgets,
  serviceWorkerVersion,
  manifest: manifestSummary,
  summary: {
    javascriptChunks: javascript.length,
    largestJavaScript: largestJavaScript || null,
    totalJavaScriptGzip,
    largestCss: largestCss || null,
    imageCount: images.length,
    largestImage: largestImage || null,
    totalImageBytes,
    runtimeFiles: runtime.length,
    runtimeGzip,
  },
  warnings,
  failures,
};
writeFileSync("performance-report.json", JSON.stringify(report, null, 2) + "\n");
console.log("Client JavaScript chunks: " + javascript.length);
console.log("Client JavaScript gzip: " + formatBytes(totalJavaScriptGzip));
console.log("Production images: " + images.length + " / " + formatBytes(totalImageBytes));
console.log("SSR runtime gzip: " + formatBytes(runtimeGzip));
warnings.forEach((warning) => console.warn("Warning: " + warning));
if (failures.length) {
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}
console.log("SSR, client, media and PWA performance budgets passed.");
