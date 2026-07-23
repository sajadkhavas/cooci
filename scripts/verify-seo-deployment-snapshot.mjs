import { createHash } from "node:crypto";
import fs from "node:fs";

const snapshots = [
  ["ssr-home.html", ["Organization", "WebSite"]],
  ["ssr-product.html", ["Product", "BreadcrumbList"]],
  ["ssr-topic.html", ["CollectionPage"]],
  ["ssr-article.html", ["BlogPosting"]],
  ["ssr-locations.html", ["CollectionPage", "Organization"]],
  ["ssr-city.html", ["Service"]],
  ["ssr-contact.html", ["ContactPage"]],
];
const errors = [];
const results = [];

const extractJsonLd = (html) =>
  Array.from(
    html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
    (match) => JSON.parse(match[1]),
  );
const flatten = (schemas) =>
  schemas.flatMap((schema) => (Array.isArray(schema?.["@graph"]) ? schema["@graph"] : [schema]));
const types = (schemas) =>
  new Set(
    flatten(schemas).flatMap((schema) => {
      const type = schema?.["@type"];
      return Array.isArray(type) ? type : type ? [type] : [];
    }),
  );

for (const [file, requiredTypes] of snapshots) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing deployment SEO snapshot: ${file}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!/<title>[\s\S]+<\/title>/i.test(html)) errors.push(`${file}: missing title`);
  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+["']/i.test(html)) {
    errors.push(`${file}: missing meta description`);
  }
  if ((html.match(/rel=["']canonical["']/gi) || []).length !== 1) {
    errors.push(`${file}: canonical must appear exactly once`);
  }
  if ((html.match(/<h1\b/gi) || []).length !== 1) errors.push(`${file}: expected exactly one H1`);
  if (/name=["']robots["'][^>]+noindex/i.test(html)) errors.push(`${file}: indexable snapshot contains noindex`);
  let schemas = [];
  try {
    schemas = extractJsonLd(html);
  } catch (error) {
    errors.push(`${file}: invalid JSON-LD (${error.message})`);
  }
  const foundTypes = types(schemas);
  for (const type of requiredTypes) {
    if (!foundTypes.has(type)) errors.push(`${file}: missing ${type} schema`);
  }
  results.push({
    file,
    bytes: Buffer.byteLength(html),
    sha256: createHash("sha256").update(html).digest("hex"),
    schemaTypes: Array.from(foundTypes).sort(),
  });
}

for (const file of ["dynamic-sitemap.xml", "dynamic-robots.txt"]) {
  if (!fs.existsSync(file)) errors.push(`Missing crawl snapshot: ${file}`);
}
if (fs.existsSync("dynamic-sitemap.xml")) {
  const sitemap = fs.readFileSync("dynamic-sitemap.xml", "utf8");
  const urls = Array.from(sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/gi), (match) => match[1]);
  if (urls.length < 10) errors.push("Dynamic sitemap contains fewer than ten public URLs");
  if (new Set(urls).size !== urls.length) errors.push("Dynamic sitemap contains duplicate URLs");
  if (urls.some((url) => url.includes("?") || url.includes("/account") || url.includes("/checkout"))) {
    errors.push("Dynamic sitemap contains a query or private URL");
  }
}
if (fs.existsSync("dynamic-robots.txt")) {
  const robots = fs.readFileSync("dynamic-robots.txt", "utf8");
  if (!robots.includes("Sitemap: https://winimibakery.com/sitemap.xml")) errors.push("Robots sitemap declaration is invalid");
  if (!robots.includes("Disallow: /account") || !robots.includes("Disallow: /checkout")) {
    errors.push("Robots private-route policy is incomplete");
  }
}

const report = {
  format: "winimi-seo-deployment-acceptance-v1",
  marker: "seo_release_candidate=ready",
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  snapshots: results,
  errors,
};
fs.writeFileSync("seo-deployment-acceptance.json", `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) {
  console.error(`SEO deployment acceptance failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`SEO deployment acceptance passed for ${results.length} raw SSR snapshots.`);
