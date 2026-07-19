import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const ROOT = resolve(".");
const SRC_ROOT = resolve("src");
const errors = [];
const warnings = [];

const walk = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const absolute = resolve(directory, entry);
    if (statSync(absolute).isDirectory()) return walk(absolute);
    return [absolute];
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

  for (const match of source.matchAll(/className=["'`]([^"'`]*outline-none[^"'`]*)["'`]/g)) {
    if (!/(?:focus|focus-visible):/.test(match[1])) {
      warnings.push(
        `${displayPath}: outline-none class has no explicit focus replacement.`,
      );
    }
  }

  for (const match of source.matchAll(/<button\b([\s\S]*?)>([\s\S]*?)<\/button>/g)) {
    const attributes = match[1];
    const body = match[2]
      .replace(/<[^>]+>/g, "")
      .replace(/\{[^}]*\}/g, "")
      .replace(/\s+/g, "")
      .trim();
    if (!body && !/aria-label=|title=/.test(attributes)) {
      warnings.push(`${displayPath}: possible icon-only button without an accessible name.`);
    }
  }
}

const siteLayout = read("src/components/layout/SiteLayout.tsx");
if (!siteLayout.includes('href="#main-content"')) {
  errors.push("SiteLayout must include a skip link to #main-content.");
}
if (!siteLayout.includes("<RouteAnnouncer")) {
  errors.push("SiteLayout must include RouteAnnouncer.");
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
if (!globalCss.includes(":focus-visible")) {
  errors.push("Global CSS must define a visible keyboard focus style.");
}
if (!globalCss.includes("prefers-reduced-motion")) {
  errors.push("Global CSS must support prefers-reduced-motion.");
}
if (!globalCss.includes(".skip-link")) {
  errors.push("Global CSS must style the skip link.");
}

const checkout = read("src/pages/CheckoutPage.tsx");
for (const requirement of [
  "aria-invalid",
  "aria-describedby",
  "<fieldset",
  "<legend",
  "setFocus",
]) {
  if (!checkout.includes(requirement)) {
    errors.push(`Checkout accessibility contract is missing ${requirement}.`);
  }
}

const login = read("src/pages/LoginPage.tsx");
for (const requirement of ["aria-invalid", "aria-describedby", "role=\"alert\""]) {
  if (!login.includes(requirement)) {
    errors.push(`Login accessibility contract is missing ${requirement}.`);
  }
}

const indexHtml = read("index.html");
if (!indexHtml.includes("viewport-fit=cover")) {
  errors.push("index.html must support safe-area viewport fitting.");
}
if (!indexHtml.includes('lang="fa-IR"') || !indexHtml.includes('dir="rtl"')) {
  errors.push("index.html must declare Persian language and RTL direction.");
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
