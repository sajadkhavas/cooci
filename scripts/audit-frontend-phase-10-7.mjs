import fs from "node:fs";

const files = {
  docs: "docs/FRONTEND_PHASE_10_7_LOCAL_SEO_BRAND_ENTITY.md",
  roadmap: "docs/FULL_LAUNCH_ROADMAP.md",
  readme: "README.md",
  package: "package.json",
  brand: "src/lib/seo/brand-entity.ts",
  local: "src/lib/seo/local-seo.ts",
  localServer: "src/lib/seo/local-seo.server.ts",
  seo: "src/components/SEO.tsx",
  publicSsr: "src/lib/public-ssr.ts",
  loaders: "src/lib/public-loaders.server.ts",
  routes: "src/routes.ts",
  locationsRoute: "src/routes/locations.tsx",
  locationsPage: "src/pages/LocationsPage.tsx",
  cityPage: "src/pages/CityPage.tsx",
  contactPage: "src/pages/ContactPage.tsx",
  aboutPage: "src/pages/AboutPage.tsx",
  footer: "src/components/layout/Footer.tsx",
  sitemap: "src/lib/seo/sitemap.server.ts",
  unit: "tests/unit/local-seo.test.ts",
  e2e: "e2e/phase10-7-local-seo-brand-entity.spec.mjs",
  playwright: "e2e/playwright.config.mjs",
  fixture: "scripts/phase10-3-catalog-fixture.mjs",
  frontendCi: ".github/workflows/frontend-ci.yml",
  deployment: ".github/workflows/phase8-deployment.yml",
  phase18: ".github/workflows/phase18-e2e.yml",
};

const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 10.7 file: ${path}`);
    continue;
  }
  sources[name] = fs.readFileSync(path, "utf8");
}

const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) errors.push(`${files[file]}: missing ${label}`);
};
const forbidText = (file, text, label = text) => {
  if (sources[file]?.includes(text)) errors.push(`${files[file]}: contains forbidden ${label}`);
};

requireText("docs", "local_seo_brand_entity=ready", "final Phase 10.7 marker");
requireText("roadmap", "Phase 10.7 — Local SEO and brand entity — complete");
requireText("readme", "Local SEO and brand entity | Complete in Phase 10.7");

requireText("brand", '`${origin}/#organization`', "stable Organization ID");
requireText("brand", '`${origin}/#website`', "stable WebSite ID");
requireText("brand", '"@type": "Organization"', "central Organization entity");
requireText("brand", '"@type": "WebSite"', "central WebSite entity");
requireText("brand", '"@type": "PostalAddress"', "bounded NAP address");
requireText("brand", "brandConfig.phoneClean", "single phone source");
requireText("brand", "brandConfig.email", "single email source");
forbidText("brand", '"@type": "LocalBusiness"', "unverified LocalBusiness claim");
forbidText("brand", '"@type": "Bakery"', "unverified Bakery location claim");
forbidText("brand", "openingHoursSpecification", "invented opening hours");
forbidText("brand", "streetAddress", "invented street address");
forbidText("brand", '"geo"', "invented coordinates");

requireText("seo", "serializedBrandSchema", "brand entity emitted on every SEO page");
requireText("seo", "serializedPageSchema", "page schemas preserved separately");
requireText("local", '"@type": "CollectionPage"', "location collection schema");
requireText("local", '"@type": "Service"', "city service schema");
requireText("local", 'provider: { "@id": ids.organization }', "service provider entity link");
requireText("local", "areaServed", "published city areaServed link");
requireText("localServer", "collectPublishedCityPages", "Laravel city page collector");
requireText("localServer", "error instanceof ApiError && error.status === 404", "unpublished city omission");

requireText("routes", 'route("locations"', "crawlable locations route");
requireText("locationsRoute", 'redirect("/locations", 301)', "location hub duplicate redirect");
requireText("loaders", "loadLocationsPublicData", "location hub SSR loader");
requireText("loaders", "getCityPagePath(city.slug)", "authoritative city canonical redirect");
requireText("publicSsr", "cities?: StoreCityPage[]", "typed city collection SSR payload");
requireText("locationsPage", "createLocationsCollectionSchema", "location hub structured data");
requireText("locationsPage", "وجود شعبه فیزیکی", "visible no-branch clarification");
requireText("cityPage", "createCityLocalServiceSchema", "city service structured data");
requireText("cityPage", 'href: "/locations"', "city breadcrumb to location hub");
requireText("contactPage", "createContactPageSchema", "ContactPage entity");
requireText("aboutPage", "createAboutPageSchema", "AboutPage entity");
requireText("footer", 'name: "مناطق منتشرشده ارسال"', "authoritative local hub label");
requireText("footer", 'href: "/locations"', "authoritative local hub URL");
forbidText("footer", 'href: "/city/tehran"', "hard-coded Tehran city link");
forbidText("footer", 'href: "/city/karaj"', "hard-coded Karaj city link");
forbidText("footer", 'href: "/city/andisheh"', "hard-coded Andisheh city link");
requireText("sitemap", '{ path: "/locations" }', "conditional locations sitemap entry");
requireText("sitemap", "collectPublishedCityPages", "authoritative sitemap city source");

requireText("unit", "stable IDs and the single configured NAP source", "brand identity unit gate");
requireText("unit", "links the published area to the central organization", "local service unit gate");
requireText("e2e", "Phase 10.7 local SEO and brand entity", "local SEO Playwright acceptance");
requireText("playwright", "phase10-7-local-seo-brand-entity.spec.mjs", "Playwright Phase 10.7 registration");
requireText("fixture", "phase10-4-city", "deterministic published city fixture");
requireText("frontendCi", "Frontend local SEO and brand entity Phase 10.7", "CI Phase 10.7 gate");
requireText("deployment", "audit:phase10-7", "deployment Phase 10.7 audit");
requireText("deployment", "Verify server-rendered local SEO and brand entity", "deployment local SSR evidence");
requireText("phase18", "Run Phase 10.7 local SEO and brand entity acceptance", "Laravel local SEO E2E gate");
requireText("package", '"audit:phase10-7"', "Phase 10.7 package command");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
};
fs.writeFileSync("frontend-phase10-7-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Frontend Phase 10.7 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 10.7 audit passed: stable brand entities, authoritative location hubs, city Service schemas, NAP consistency and local crawl gates are locked.",
);
