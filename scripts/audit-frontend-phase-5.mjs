import fs from "node:fs";

const files = {
  threatModel: "docs/FRONTEND_FULL_AUDIT_PHASE_5.md",
  root: "src/root.tsx",
  contentContract: "src/lib/content-contract-schema.ts",
  contentSchema: "src/lib/content-schema.ts",
  contentApi: "src/lib/content.ts",
  seoSecurity: "src/lib/security/seo.ts",
  seoComponent: "src/components/SEO.tsx",
  breadcrumbs: "src/components/Breadcrumbs.tsx",
  enamadSecurity: "src/lib/security/enamad.ts",
  enamadSlot: "src/components/trust/EnamadTrustSlot.tsx",
  inquiryHelpers: "src/lib/inquiry-form.ts",
  inquiryForm: "src/components/forms/InquiryForm.tsx",
  structuredText: "src/components/content/StructuredText.tsx",
  unit: "tests/unit/content-security.test.ts",
  package: "package.json",
};

const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 5 file: ${path}`);
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

requireText(
  "threatModel",
  "Every store-settings, page, FAQ, gallery, post, city, review and inquiry response is untrusted runtime data",
  "runtime content trust boundary",
);
requireText(
  "threatModel",
  "JSON-LD must be serialized as inert script text",
  "JSON-LD breakout boundary",
);
requireText(
  "threatModel",
  "eNAMAD code is data, not executable markup",
  "trust seal execution boundary",
);

forbidText(
  "root",
  'rel="canonical"',
  "static root-document canonical competing with route metadata",
);
requireText("root", "<Meta />", "framework route metadata outlet");

requireText("contentContract", "storeSettingsSchema", "store settings schema");
requireText("contentContract", "contentPageSchema", "managed page schema");
requireText("contentContract", "galleryItemSchema", "gallery schema");
requireText("contentContract", "postDetailSchema", "post schema");
requireText("contentContract", "reviewSchema", "review schema");
requireText("contentContract", "inquiryResultSchema", "persisted inquiry schema");
requireText("contentContract", "pagination range is inverted", "pagination invariant");
requireText("contentContract", 'parsed.protocol === "https:"', "HTTPS absolute content URL policy");
requireText("contentContract", '!trimmed.startsWith("//")', "protocol-relative URL rejection");

requireText("contentSchema", 'code: "invalid_content_contract"', "runtime content contract error");
requireText("contentSchema", "parseStoreSettings", "settings parser");
requireText("contentSchema", "parseInquiryResult", "inquiry parser");
requireText("contentSchema", "parsePagination", "pagination parser");

for (const parser of [
  "parseStoreSettings",
  "parseContentPage",
  "parseFaqs",
  "parseGallery",
  "parsePosts",
  "parsePost",
  "parseCityPage",
  "parseReviews",
  "parseReviewSummary",
  "parseInquiryResult",
]) {
  requireText("contentApi", parser, `${parser} usage`);
}
requireText("contentApi", "apiRequest<unknown>", "unknown content response boundary");
forbidText("contentApi", "apiRequest<BackendStoreSettings>", "TypeScript-only settings response");
forbidText("contentApi", "apiRequest<BackendPostSummary[]>", "TypeScript-only post response");

requireText("seoSecurity", "resolveCanonicalUrl", "same-origin canonical resolver");
requireText("seoSecurity", "parsed.origin !== origin.origin", "external canonical rejection");
requireText("seoSecurity", "resolvePublicMediaUrl", "public media resolver");
requireText("seoSecurity", 'parsed.protocol !== "https:"', "insecure external media rejection");
requireText("seoSecurity", "serializeJsonLd", "JSON-LD serializer");
requireText("seoSecurity", '.replaceAll("<",', "JSON-LD less-than replacement");
requireText("seoSecurity", "u003c", "JSON-LD less-than escape code");
requireText("seoSecurity", '.replaceAll("&",', "JSON-LD ampersand replacement");
requireText("seoSecurity", "u0026", "JSON-LD ampersand escape code");

requireText("seoComponent", "resolveCanonicalUrl", "secure canonical usage");
requireText("seoComponent", "resolvePublicMediaUrl", "secure media usage");
requireText("seoComponent", "serializeJsonLd", "safe JSON-LD usage");
requireText(
  "seoComponent",
  "resolveCanonicalUrl(url || location.pathname, SITE_ORIGIN)",
  "query-free default canonical",
);
requireText("seoComponent", "useCspNonce", "nonce-bound JSON-LD");
forbidText("seoComponent", "location.search", "query parameters in canonical URL");
forbidText("seoComponent", "JSON.stringify(finalSchema)", "unescaped JSON-LD insertion");

requireText("breadcrumbs", "resolveCanonicalUrl", "same-origin breadcrumb item URLs");
requireText("breadcrumbs", "serializeJsonLd", "escaped breadcrumb JSON-LD");
requireText("breadcrumbs", "useCspNonce", "nonce-bound breadcrumb JSON-LD");
requireText(
  "breadcrumbs",
  'aria-current={isLast ? "page" : undefined}',
  "current breadcrumb semantics",
);
forbidText("breadcrumbs", "JSON.stringify(schema)", "unescaped breadcrumb JSON-LD");

requireText("enamadSecurity", 'const ENAMAD_HOST = "trustseal.enamad.ir"', "exact eNAMAD host");
requireText("enamadSecurity", 'url.protocol === "https:"', "eNAMAD HTTPS boundary");
requireText("enamadSecurity", "!url.username", "eNAMAD credential rejection");
requireText("enamadSecurity", "MAX_BADGE_CODE_LENGTH", "bounded eNAMAD code");
requireText("enamadSlot", "extractOfficialEnamadBadge", "isolated trust parser usage");
forbidText("enamadSlot", "dangerouslySetInnerHTML", "raw eNAMAD HTML execution");
forbidText("enamadSlot", "innerHTML", "manual eNAMAD HTML execution");

requireText("structuredText", "renderInlineText", "plain structured-text renderer");
forbidText("structuredText", "dangerouslySetInnerHTML", "raw managed HTML execution");

requireText("inquiryHelpers", "normalizeInquiryMobile", "Iranian mobile normalization");
requireText("inquiryHelpers", "normalizeInquiryEmail", "email normalization");
requireText("inquiryHelpers", "sanitizeInquiryMetadata", "metadata bounds");
requireText("inquiryHelpers", "depth >= 2", "metadata depth limit");
requireText("inquiryForm", "if (submitting) return", "duplicate submit guard");
requireText("inquiryForm", "normalizeInquiryMobile", "normalized inquiry mobile usage");
requireText("inquiryForm", "sanitizeInquiryMetadata", "sanitized inquiry metadata usage");
requireText("inquiryForm", "setReference(inquiry.id)", "persisted inquiry success reference");
requireText("inquiryForm", "website.slice(0, 1)", "bounded honeypot forwarding");

requireText("unit", "public URL contracts reject executable", "malicious content URL test");
requireText("unit", "canonical URL resolution never leaves", "canonical attack test");
requireText("unit", "JSON-LD serialization prevents script breakout", "JSON-LD breakout test");
requireText("unit", "eNAMAD extraction accepts only exact official", "eNAMAD lookalike test");
requireText("unit", "inquiry fields normalize Iranian phone", "inquiry normalization test");
requireText("package", '"audit:phase5"', "Phase 5 audit command");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
};
fs.writeFileSync("frontend-phase5-audit.json", `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) {
  console.error(`Frontend Phase 5 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(
  "Frontend Phase 5 audit passed: route-managed SSR metadata, runtime content contracts, nonce-protected JSON-LD, safe media URLs, exact eNAMAD extraction and bounded persisted inquiries are locked.",
);
