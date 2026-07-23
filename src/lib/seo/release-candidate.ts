export const SEO_ACCEPTANCE_FORMAT = "winimi-seo-acceptance-v1";
export const SEO_RELEASE_CANDIDATE_FORMAT = "winimi-seo-release-candidate-v1";
export const SEO_RELEASE_MARKER = "seo_release_candidate=ready";
export const REQUIRED_SEO_ACCEPTANCE_PROJECTS = [
  "desktop-chromium",
  "mobile-chromium",
] as const;

export interface SeoRouteAcceptance {
  path: string;
  status: number;
  canonical: string;
  title: string;
  descriptionLength: number;
  h1Count: number;
  schemaTypes: string[];
  internalLinkCount: number;
}

export interface SeoProjectAcceptanceReport {
  format: typeof SEO_ACCEPTANCE_FORMAT;
  marker: typeof SEO_RELEASE_MARKER;
  generatedAt: string;
  project: string;
  frontendOrigin: string;
  passed: boolean;
  sitemapSha256: string;
  routes: SeoRouteAcceptance[];
  checkedInternalLinks: number;
  redirectChecks: number;
  noindexChecks: number;
}

export interface MergedSeoAcceptanceReport {
  format: typeof SEO_ACCEPTANCE_FORMAT;
  marker: typeof SEO_RELEASE_MARKER;
  generatedAt: string;
  passed: boolean;
  frontendOrigin: string;
  sitemapSha256: string;
  projects: SeoProjectAcceptanceReport[];
}

export interface SeoReleaseCandidate {
  format: typeof SEO_RELEASE_CANDIDATE_FORMAT;
  marker: typeof SEO_RELEASE_MARKER;
  generatedAt: string;
  releaseId: string;
  backendContract: "2026-07-20-phase-16";
  releaseManifestSha256: string;
  acceptanceReportSha256: string;
  acceptedProjects: string[];
  publicBuild: {
    siteOrigin: string;
    apiOrigin: string;
    backendEnabled: true;
    developmentMocks: false;
  };
}

export const validateSeoProjectReport = (
  report: Partial<SeoProjectAcceptanceReport>,
): string[] => {
  const errors: string[] = [];
  if (report.format !== SEO_ACCEPTANCE_FORMAT) errors.push("invalid acceptance format");
  if (report.marker !== SEO_RELEASE_MARKER) errors.push("missing acceptance marker");
  if (report.passed !== true) errors.push("acceptance report did not pass");
  if (!report.project) errors.push("missing project name");
  if (!report.frontendOrigin?.startsWith("https://")) errors.push("frontend origin must use HTTPS");
  if (!/^[a-f0-9]{64}$/.test(report.sitemapSha256 || "")) errors.push("invalid sitemap digest");
  if (!Array.isArray(report.routes) || report.routes.length < 10) {
    errors.push("acceptance report must cover at least ten indexable routes");
  }
  if (!report.checkedInternalLinks || report.checkedInternalLinks < 10) {
    errors.push("acceptance report must verify internal links");
  }
  if (!report.redirectChecks) errors.push("redirect checks are missing");
  if (!report.noindexChecks) errors.push("noindex checks are missing");
  return errors;
};

export const validateMergedSeoAcceptance = (
  report: Partial<MergedSeoAcceptanceReport>,
): string[] => {
  const errors: string[] = [];
  if (report.format !== SEO_ACCEPTANCE_FORMAT) errors.push("invalid merged acceptance format");
  if (report.marker !== SEO_RELEASE_MARKER) errors.push("missing merged acceptance marker");
  if (report.passed !== true) errors.push("merged acceptance did not pass");
  if (!report.frontendOrigin?.startsWith("https://")) errors.push("merged frontend origin must use HTTPS");
  if (!Array.isArray(report.projects)) {
    errors.push("merged acceptance projects are missing");
    return errors;
  }
  for (const requiredProject of REQUIRED_SEO_ACCEPTANCE_PROJECTS) {
    if (!report.projects.some((project) => project.project === requiredProject)) {
      errors.push(`missing required project: ${requiredProject}`);
    }
  }
  for (const project of report.projects) errors.push(...validateSeoProjectReport(project));
  const origins = new Set(report.projects.map((project) => project.frontendOrigin));
  const digests = new Set(report.projects.map((project) => project.sitemapSha256));
  if (origins.size !== 1 || !origins.has(report.frontendOrigin || "")) {
    errors.push("project origins do not match the merged report");
  }
  if (digests.size !== 1 || !digests.has(report.sitemapSha256 || "")) {
    errors.push("project sitemap digests do not match");
  }
  return errors;
};

export const validateSeoReleaseCandidate = (
  candidate: Partial<SeoReleaseCandidate>,
): string[] => {
  const errors: string[] = [];
  if (candidate.format !== SEO_RELEASE_CANDIDATE_FORMAT) errors.push("invalid release candidate format");
  if (candidate.marker !== SEO_RELEASE_MARKER) errors.push("missing release candidate marker");
  if (!/^[a-f0-9]{20}$/.test(candidate.releaseId || "")) errors.push("invalid release ID");
  if (candidate.backendContract !== "2026-07-20-phase-16") errors.push("backend contract drift");
  if (!/^[a-f0-9]{64}$/.test(candidate.releaseManifestSha256 || "")) {
    errors.push("invalid release manifest digest");
  }
  if (!/^[a-f0-9]{64}$/.test(candidate.acceptanceReportSha256 || "")) {
    errors.push("invalid acceptance report digest");
  }
  for (const project of REQUIRED_SEO_ACCEPTANCE_PROJECTS) {
    if (!candidate.acceptedProjects?.includes(project)) errors.push(`candidate is missing ${project}`);
  }
  if (candidate.publicBuild?.siteOrigin !== "https://winimibakery.com") {
    errors.push("candidate site origin is invalid");
  }
  if (candidate.publicBuild?.apiOrigin !== "https://api.winimibakery.com") {
    errors.push("candidate API origin is invalid");
  }
  if (candidate.publicBuild?.backendEnabled !== true) errors.push("backend must be enabled");
  if (candidate.publicBuild?.developmentMocks !== false) errors.push("development mocks must be disabled");
  return errors;
};
