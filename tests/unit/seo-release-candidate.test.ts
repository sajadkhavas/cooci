import assert from "node:assert/strict";
import test from "node:test";
import {
  SEO_ACCEPTANCE_FORMAT,
  SEO_RELEASE_CANDIDATE_FORMAT,
  SEO_RELEASE_MARKER,
  validateMergedSeoAcceptance,
  validateSeoProjectReport,
  validateSeoReleaseCandidate,
} from "@/lib/seo/release-candidate";

const route = {
  path: "/",
  status: 200,
  canonical: "https://winimibakery.com/",
  title: "وینیمی بیکری",
  descriptionLength: 120,
  h1Count: 1,
  schemaTypes: ["Organization", "WebSite"],
  internalLinkCount: 12,
};
const projectReport = (project: string) => ({
  format: SEO_ACCEPTANCE_FORMAT,
  marker: SEO_RELEASE_MARKER,
  generatedAt: "2026-07-23T00:00:00.000Z",
  project,
  frontendOrigin: "https://winimibakery.com",
  passed: true,
  sitemapSha256: "a".repeat(64),
  routes: Array.from({ length: 10 }, (_, index) => ({ ...route, path: `/route-${index}` })),
  checkedInternalLinks: 20,
  redirectChecks: 7,
  noindexChecks: 6,
});

test("SEO project acceptance requires a broad crawl and status matrix", () => {
  assert.deepEqual(validateSeoProjectReport(projectReport("desktop-chromium")), []);
  const invalid = projectReport("desktop-chromium");
  invalid.routes = invalid.routes.slice(0, 2);
  invalid.checkedInternalLinks = 0;
  assert.equal(validateSeoProjectReport(invalid).length, 2);
});

test("merged SEO acceptance requires matching desktop and mobile evidence", () => {
  const desktop = projectReport("desktop-chromium");
  const mobile = projectReport("mobile-chromium");
  const merged = {
    format: SEO_ACCEPTANCE_FORMAT,
    marker: SEO_RELEASE_MARKER,
    generatedAt: "2026-07-23T00:00:00.000Z",
    passed: true,
    frontendOrigin: desktop.frontendOrigin,
    sitemapSha256: desktop.sitemapSha256,
    projects: [desktop, mobile],
  };
  assert.deepEqual(validateMergedSeoAcceptance(merged), []);
  merged.projects = [desktop];
  assert.match(validateMergedSeoAcceptance(merged).join(" "), /mobile-chromium/);
});

test("release candidate locks hashes, production origins and backend boundary", () => {
  const candidate = {
    format: SEO_RELEASE_CANDIDATE_FORMAT,
    marker: SEO_RELEASE_MARKER,
    generatedAt: "2026-07-23T00:00:00.000Z",
    releaseId: "b".repeat(20),
    backendContract: "2026-07-20-phase-16" as const,
    releaseManifestSha256: "c".repeat(64),
    acceptanceReportSha256: "d".repeat(64),
    acceptedProjects: ["desktop-chromium", "mobile-chromium"],
    publicBuild: {
      siteOrigin: "https://winimibakery.com",
      apiOrigin: "https://api.winimibakery.com",
      backendEnabled: true as const,
      developmentMocks: false as const,
    },
  };
  assert.deepEqual(validateSeoReleaseCandidate(candidate), []);
  candidate.publicBuild.siteOrigin = "http://localhost:4173";
  assert.match(validateSeoReleaseCandidate(candidate).join(" "), /site origin/);
});
