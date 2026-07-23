import { createHash } from "node:crypto";
import fs from "node:fs";
import { expect, test } from "@playwright/test";

const frontendOrigin =
  process.env.PHASE18_FRONTEND_URL || "http://127.0.0.1:4173";
const reportFormat = "winimi-seo-acceptance-v1";
const releaseMarker = "seo_release_candidate=ready";

const decodeHtml = (value = "") =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

const getAttribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"));
  return match ? decodeHtml(match[1]) : undefined;
};

const getTags = (html, tagName) =>
  Array.from(html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi")), (match) => match[0]);

const getMetaContent = (html, attribute, value) => {
  const tags = getTags(html, "meta").filter(
    (tag) => getAttribute(tag, attribute)?.toLowerCase() === value.toLowerCase(),
  );
  return tags.map((tag) => getAttribute(tag, "content") || "");
};

const extractJsonLd = (html) =>
  Array.from(
    html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ).map((match) => JSON.parse(match[1]));

const flattenSchemas = (schemas) =>
  schemas.flatMap((schema) =>
    Array.isArray(schema?.["@graph"]) ? schema["@graph"] : [schema],
  );

const schemaTypes = (schemas) =>
  Array.from(
    new Set(
      flattenSchemas(schemas).flatMap((schema) => {
        const type = schema?.["@type"];
        return Array.isArray(type) ? type : type ? [type] : [];
      }),
    ),
  ).sort();

const normalizeAbsoluteUrl = (value) => {
  const url = new URL(value, frontendOrigin);
  url.hash = "";
  return url.toString();
};

const expectedSchemaForPath = (pathname) => {
  if (pathname === "/products") return "CollectionPage";
  if (pathname.startsWith("/products/category/")) return "CollectionPage";
  if (pathname.startsWith("/products/")) return "Product";
  if (pathname === "/blog") return "Blog";
  if (pathname.startsWith("/blog/topic/")) return "CollectionPage";
  if (pathname.startsWith("/blog/")) return "BlogPosting";
  if (pathname === "/locations") return "CollectionPage";
  if (pathname.startsWith("/city/")) return "Service";
  if (pathname === "/contact") return "ContactPage";
  if (pathname === "/about") return "AboutPage";
  return undefined;
};

const inspectIndexableHtml = (html, expectedUrl) => {
  expect(html).toContain('<html lang="fa-IR" dir="rtl">');
  const titles = Array.from(html.matchAll(/<title>([\s\S]*?)<\/title>/gi), (match) => decodeHtml(match[1].trim()))
    .filter(Boolean);
  expect(titles.length).toBeGreaterThan(0);
  const title = titles.at(-1);
  expect(title.length).toBeGreaterThanOrEqual(8);
  expect(title.length).toBeLessThanOrEqual(120);

  const descriptions = getMetaContent(html, "name", "description").filter(Boolean);
  expect(descriptions.length).toBeGreaterThan(0);
  const description = descriptions.at(-1);
  expect(description.length).toBeGreaterThanOrEqual(20);
  expect(description.length).toBeLessThanOrEqual(320);

  const canonicalTags = getTags(html, "link").filter(
    (tag) => getAttribute(tag, "rel")?.toLowerCase() === "canonical",
  );
  expect(canonicalTags).toHaveLength(1);
  const canonical = normalizeAbsoluteUrl(getAttribute(canonicalTags[0], "href"));
  expect(canonical).toBe(normalizeAbsoluteUrl(expectedUrl));

  const robots = getMetaContent(html, "name", "robots").join(",").toLowerCase();
  expect(robots).not.toContain("noindex");
  expect(getMetaContent(html, "property", "og:title").filter(Boolean).length).toBeGreaterThan(0);
  expect(getMetaContent(html, "property", "og:description").filter(Boolean).length).toBeGreaterThan(0);
  expect(getMetaContent(html, "property", "og:url").map(normalizeAbsoluteUrl)).toContain(canonical);
  expect(getMetaContent(html, "name", "twitter:card")).toContain("summary_large_image");

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  expect(h1Count).toBe(1);
  const schemas = extractJsonLd(html);
  const types = schemaTypes(schemas);
  expect(types).toContain("Organization");
  expect(types).toContain("WebSite");
  const expectedType = expectedSchemaForPath(new URL(expectedUrl).pathname);
  if (expectedType) expect(types).toContain(expectedType);

  const internalLinks = getTags(html, "a")
    .map((tag) => getAttribute(tag, "href"))
    .filter((href) => href?.startsWith("/") && !href.startsWith("//"));
  expect(internalLinks.length).toBeGreaterThan(0);
  expect(internalLinks.some((href) => href.startsWith("/products?category="))).toBe(false);
  expect(internalLinks.includes("/categories")).toBe(false);

  return {
    title,
    descriptionLength: description.length,
    canonical,
    h1Count,
    schemaTypes: types,
    internalLinks,
  };
};

const getWithoutRedirect = (request, path) => request.get(path, { maxRedirects: 0 });

const assertNoindex = async (request, path, expected = "noindex, nofollow") => {
  const response = await getWithoutRedirect(request, path);
  expect(response.status()).toBeLessThan(500);
  expect(response.headers()["x-robots-tag"]).toBe(expected);
  return response;
};

test.describe("Phase 10.9 SEO acceptance and release candidate", () => {
  test("every sitemap URL passes raw HTML, metadata, schema, status and internal-link acceptance", async ({ page, request }, testInfo) => {
    const sitemapResponse = await request.get("/sitemap.xml");
    const sitemapXml = await sitemapResponse.text();
    expect(sitemapResponse.status()).toBe(200);
    expect(sitemapResponse.headers()["content-type"]).toContain("application/xml");

    const sitemapUrls = Array.from(
      sitemapXml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi),
      (match) => decodeHtml(match[1].trim()),
    );
    expect(sitemapUrls.length).toBeGreaterThanOrEqual(10);
    expect(new Set(sitemapUrls).size).toBe(sitemapUrls.length);
    for (const value of sitemapUrls) {
      const url = new URL(value);
      expect(url.origin).toBe(frontendOrigin);
      expect(url.search).toBe("");
      expect(url.hash).toBe("");
    }

    const routes = [];
    const collectedLinks = new Set();
    for (const absoluteUrl of sitemapUrls) {
      const url = new URL(absoluteUrl);
      const response = await request.get(`${url.pathname}${url.search}`);
      const html = await response.text();
      expect(response.status(), absoluteUrl).toBe(200);
      expect(response.headers()["content-type"], absoluteUrl).toContain("text/html");
      expect(response.headers()["x-robots-tag"] || "", absoluteUrl).not.toContain("noindex");
      const inspection = inspectIndexableHtml(html, absoluteUrl);
      inspection.internalLinks.forEach((href) => collectedLinks.add(href));
      routes.push({
        path: url.pathname,
        status: response.status(),
        canonical: inspection.canonical,
        title: inspection.title,
        descriptionLength: inspection.descriptionLength,
        h1Count: inspection.h1Count,
        schemaTypes: inspection.schemaTypes,
        internalLinkCount: inspection.internalLinks.length,
      });
    }

    const internalPaths = Array.from(collectedLinks)
      .map((href) => {
        const url = new URL(href, frontendOrigin);
        url.hash = "";
        return `${url.pathname}${url.search}`;
      })
      .filter((path, index, values) => values.indexOf(path) === index)
      .slice(0, 160);
    expect(internalPaths.length).toBeGreaterThanOrEqual(10);
    for (const path of internalPaths) {
      const response = await getWithoutRedirect(request, path);
      expect(response.status(), `broken internal link: ${path}`).not.toBe(404);
      expect(response.status(), `server error from internal link: ${path}`).toBeLessThan(500);
    }

    const robotsResponse = await request.get("/robots.txt");
    const robotsText = await robotsResponse.text();
    expect(robotsResponse.status()).toBe(200);
    expect(robotsText).toContain(`Sitemap: ${frontendOrigin}/sitemap.xml`);
    expect(robotsText).toContain("Disallow: /account");
    expect(robotsText).toContain("Disallow: /checkout");

    const redirectMatrix = [
      ["/categories", "/products"],
      ["/products?page=1", "/products"],
      ["/locations?utm_source=phase10-9", "/locations"],
      ["/city/staging-tehran?utm_source=phase10-9", "/city/staging-tehran"],
    ];
    for (const [source, destination] of redirectMatrix) {
      const response = await getWithoutRedirect(request, source);
      expect(response.status(), source).toBe(301);
      expect(response.headers().location, source).toBe(destination);
    }

    const missingMatrix = [
      "/products/phase10-9-missing-product",
      "/blog/phase10-9-missing-post",
      "/city/phase10-9-missing-city",
    ];
    for (const path of missingMatrix) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(404);
      expect(response.headers()["x-robots-tag"], path).toBe("noindex, nofollow");
    }

    const filtered = await request.get("/products?q=phase10-9&sort=newest");
    const filteredHtml = await filtered.text();
    expect(filtered.status()).toBe(200);
    expect(filtered.headers()["x-robots-tag"]).toBe("noindex,follow");
    expect(filteredHtml).toContain('name="robots" content="noindex,follow"');
    expect(filteredHtml).toContain(`rel="canonical" href="${frontendOrigin}/products"`);

    const privatePaths = [
      "/account",
      "/cart",
      "/checkout",
      "/payment/callback",
      "/__ssr_health",
    ];
    for (const path of privatePaths) await assertNoindex(request, path);

    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${frontendOrigin}/`);
    await expect(page.locator('script[type="application/ld+json"]')).not.toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("Application Error");

    const report = {
      format: reportFormat,
      marker: releaseMarker,
      generatedAt: new Date().toISOString(),
      project: testInfo.project.name,
      frontendOrigin,
      passed: true,
      sitemapSha256: createHash("sha256").update(sitemapXml).digest("hex"),
      routes,
      checkedInternalLinks: internalPaths.length,
      redirectChecks: redirectMatrix.length + missingMatrix.length,
      noindexChecks: privatePaths.length + 1,
    };
    const reportPath = `seo-acceptance-${testInfo.project.name}.json`;
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    await testInfo.attach("seo-acceptance", {
      body: Buffer.from(JSON.stringify(report, null, 2)),
      contentType: "application/json",
    });
  });
});
