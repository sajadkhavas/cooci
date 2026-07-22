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
const routesSource = read("src/routes.ts");
const routePaths = [
  "/",
  ...Array.from(
    routesSource.matchAll(/route\(["']([^"']+)["']/g),
    (match) => "/" + match[1].replace(/^\//, ""),
  ),
];
if (!routePaths.includes("/*") && !routePaths.includes("/*")) {
  if (!routesSource.includes('route("*"')) errors.push("src/routes.ts must include a wildcard 404 route.");
}
const routeRegexes = routePaths
  .filter((route) => route !== "/*")
  .map((route) => {
    const expression = route
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/:[a-zA-Z0-9_]+/g, "[^/]+")
      .replace(/\\\*/g, ".*");
    return new RegExp("^" + expression + "/?$");
  });
const isKnownRoute = (pathname) =>
  pathname === "/" || routeRegexes.some((pattern) => pattern.test(pathname));
for (const file of sourceFiles) {
  const source = readFileSync(file, "utf8");
  const displayPath = relative(ROOT, file);
  for (const match of source.matchAll(/(?:to|href)=["'](\/[^"']*)["']/g)) {
    const target = match[1];
    const pathname = target.split(/[?#]/, 1)[0] || "/";
    if (!isKnownRoute(pathname)) {
      errors.push(displayPath + ": internal link does not match a framework route: " + target);
    }
  }
  for (const rule of [
    { pattern: /(?:href|to)=["']#["']/g, message: "empty hash navigation" },
    { pattern: /javascript:/gi, message: "javascript: URL" },
    { pattern: /\b(?:TODO|FIXME)\b/g, message: "unfinished TODO/FIXME marker" },
    { pattern: /lorem ipsum/gi, message: "placeholder Lorem Ipsum copy" },
    { pattern: /cooci\.lovable\.app/gi, message: "temporary Lovable domain" },
  ]) {
    if (rule.pattern.test(source)) errors.push(displayPath + ": contains " + rule.message + ".");
  }
}
const pageFiles = sourceFiles.filter((file) => /src[\/]pages[\/].+Page\.tsx$/.test(file));
for (const file of pageFiles) {
  const source = readFileSync(file, "utf8");
  const displayPath = relative(ROOT, file);
  if (!source.includes("<SEO") && !source.includes("ManagedContentPage")) {
    errors.push(displayPath + ": routed page is missing SEO.");
  }
  if (!/export default\s+[A-Za-z0-9_]+/.test(source)) {
    errors.push(displayPath + ": page is missing a default export.");
  }
}
for (const required of [
  'index("./routes/home.tsx")',
  'route("categories", "./routes/categories-redirect.tsx")',
  'route("products/:slug", "./routes/product-detail.tsx")',
  'route("blog/:slug", "./routes/blog-detail.tsx")',
  'route("city/:slug", "./routes/city.tsx")',
  'route("*", "./routes/not-found.tsx")',
]) {
  if (!routesSource.includes(required)) errors.push("src/routes.ts missing " + required);
}
if (!read("src/root.tsx").includes("<Scripts nonce={nonce}")) {
  errors.push("src/root.tsx must render nonce-protected framework scripts.");
}
if (routePaths.length < 20) warnings.push("Framework route inventory appears unexpectedly small.");
warnings.forEach((warning) => console.warn("- " + warning));
if (errors.length) {
  errors.forEach((error) => console.error("- " + error));
  process.exit(1);
}
console.log(
  "Frontend framework audit passed: " + routePaths.length +
    " routes, " + pageFiles.length + " pages and " + sourceFiles.length + " source files checked.",
);
