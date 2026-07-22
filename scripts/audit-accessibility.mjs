import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const ROOT = resolve(".");
const SRC_ROOT = resolve("src");
const errors = [];
const warnings = [];
const walk = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const absolute = resolve(directory, entry);
    return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
  });
const files = walk(SRC_ROOT).filter((file) => /\.(tsx|ts|css)$/.test(file));
const read = (path) => readFileSync(resolve(path), "utf8");

for (const file of files.filter((path) => path.endsWith(".tsx"))) {
  const source = readFileSync(file, "utf8");
  const displayPath = relative(ROOT, file);
  for (const match of source.matchAll(/<img\b[\s\S]*?>/g)) {
    if (!/\balt\s*=/.test(match[0])) {
      errors.push(`${displayPath}: image is missing an alt attribute.`);
    }
  }
  for (const match of source.matchAll(/<a\b[\s\S]*?target=["']_blank["'][\s\S]*?>/g)) {
    if (!/rel=["'][^"']*noopener[^"']*["']/.test(match[0])) {
      errors.push(`${displayPath}: target=_blank link is missing rel=noopener.`);
    }
  }
  if (/tabIndex=\{?[1-9]/.test(source)) {
    errors.push(`${displayPath}: positive tabIndex changes the natural keyboard order.`);
  }
  if (/<(?:div|span)\b[^>]*\bonClick=/.test(source)) {
    warnings.push(
      `${displayPath}: non-semantic click target found; verify keyboard support and role.`,
    );
  }
  for (const match of source.matchAll(/<button\b([\s\S]*?)>([\s\S]*?)<\/button>/g)) {
    const attributes = match[1];
    const rawBody = match[2].trim();
    const containsOnlyStaticIcon = /^<[A-Z][A-Za-z0-9_.]*(?:\s[\s\S]*?)?\/>$/.test(
      rawBody,
    );
    if (
      containsOnlyStaticIcon &&
      !/aria-label=|aria-labelledby=|title=/.test(attributes)
    ) {
      warnings.push(`${displayPath}: icon-only button may be missing an accessible name.`);
    }
  }
}

const siteLayout = read("src/components/layout/SiteLayout.tsx");
for (const requirement of [
  'href="#main-content"',
  "<RouteAnnouncer",
  'id="main-content"',
]) {
  if (!siteLayout.includes(requirement)) {
    errors.push(`SiteLayout accessibility contract is missing ${requirement}.`);
  }
}
const header = read("src/components/layout/Header.tsx");
for (const requirement of [
  'role="dialog"',
  'aria-modal="true"',
  "focusableSelector",
  'aria-controls="mobile-navigation-dialog"',
]) {
  if (!header.includes(requirement)) {
    errors.push(`Header mobile navigation is missing ${requirement}.`);
  }
}
const globalCss = read("src/index.css");
for (const requirement of [":focus-visible", "prefers-reduced-motion", ".skip-link"]) {
  if (!globalCss.includes(requirement)) {
    errors.push(`Global CSS is missing ${requirement}.`);
  }
}
const checkout = read("src/pages/CheckoutPage.tsx");
for (const requirement of ["<form", "aria-busy", "aria-pressed", 'role="alert"', "<label"]) {
  if (!checkout.includes(requirement)) {
    errors.push(`Checkout accessibility contract is missing ${requirement}.`);
  }
}
const login = read("src/pages/LoginPage.tsx");
for (const requirement of ["aria-invalid", "aria-describedby", 'role="alert"']) {
  if (!login.includes(requirement)) {
    errors.push(`Login accessibility contract is missing ${requirement}.`);
  }
}

const rootDocument = read("src/root.tsx");
if (!rootDocument.includes("viewport-fit=cover")) {
  errors.push("SSR root document must support safe-area viewport fitting.");
}
if (
  !rootDocument.includes('lang="fa-IR"') ||
  !rootDocument.includes('dir="rtl"')
) {
  errors.push("SSR root document must declare Persian language and RTL direction.");
}
if (!rootDocument.includes("<noscript>")) {
  errors.push("SSR root document must provide a no-script message.");
}

if (warnings.length) {
  console.warn(`Accessibility audit warnings (${warnings.length}):`);
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}
if (errors.length) {
  console.error(`Accessibility audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(
  `Accessibility audit passed: ${files.length} source files checked with ${warnings.length} warning(s).`,
);
