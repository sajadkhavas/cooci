import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const ROOT = resolve(".");
const SRC_ROOT = resolve("src");
const errors = [];
const warnings = [];
const read = (path) => readFileSync(resolve(path), "utf8");
const walk = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const absolute = resolve(directory, entry);
    return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
  });

const sourceFiles = walk(SRC_ROOT).filter((file) => /\.(ts|tsx)$/.test(file));
const appSource = read("src/App.tsx");
const routePaths = Array.from(
  appSource.matchAll(/<Route\s+[\s\S]*?path=["']([^"']+)["']/g),
  (match) => match[1],
);
if (!routePaths.includes("*")) errors.push("src/App.tsx must include a wildcard 404 route.");
const routeRegexes = routePaths
  .filter((route) => route !== "*")
  .map((route) => {
    const expression = route
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/:[a-zA-Z0-9_]+/g, "[^/]+")
      .replace(/\\\*/g, ".*");
    return new RegExp(`^${expression}/?$`);
  });
const isKnownRoute = (pathname) => routeRegexes.some((pattern) => pattern.test(pathname));

for (const file of sourceFiles) {
  const source = readFileSync(file, "utf8");
  const displayPath = relative(ROOT, file);
  for (const match of source.matchAll(/(?:to|href)=["'](\/[^"']*)["']/g)) {
    const target = match[1];
    const pathname = target.split(/[?#]/, 1)[0] || "/";
    if (!isKnownRoute(pathname)) errors.push(`${displayPath}: internal link does not match an app route: ${target}`);
  }
  for (const rule of [
    { pattern: /(?:href|to)=["']#["']/g, message: "empty hash navigation" },
    { pattern: /javascript:/gi, message: "javascript: URL" },
    { pattern: /\b(?:TODO|FIXME)\b/g, message: "unfinished TODO/FIXME marker" },
    { pattern: /lorem ipsum/gi, message: "placeholder Lorem Ipsum copy" },
    { pattern: /cooci\.lovable\.app/gi, message: "temporary Lovable domain" },
    { pattern: /سفارش سریع در واتساپ|سفارش در واتساپ|در واتساپ ثبت (?:کنید|شود)/g, message: "legacy WhatsApp ordering copy" },
  ]) {
    if (rule.pattern.test(source)) errors.push(`${displayPath}: contains ${rule.message}.`);
  }
}

const pageFiles = sourceFiles.filter((file) => /src[\\/]pages[\\/].+Page\.tsx$/.test(file));
for (const file of pageFiles) {
  const source = readFileSync(file, "utf8");
  const displayPath = relative(ROOT, file);
  if (!source.includes("<SEO") && !source.includes("ManagedContentPage")) {
    errors.push(`${displayPath}: routed page is missing SEO or the managed-content SEO wrapper.`);
  }
  if (!/export default\s+[A-Za-z0-9_]+/.test(source)) errors.push(`${displayPath}: page is missing a default export.`);
}

const brandSource = read("src/config/brand.ts");
if (!brandSource.includes('website: "https://winimibakery.com"')) errors.push("src/config/brand.ts must use the production website origin.");
if (routePaths.length < 20) warnings.push(`Only ${routePaths.length} routes were detected; review route extraction if routes were refactored.`);

if (warnings.length) {
  console.warn("Frontend audit warnings:");
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}
if (errors.length) {
  console.error(`Frontend audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Frontend audit passed: ${routePaths.length} routes, ${pageFiles.length} pages and ${sourceFiles.length} source files checked.`);
