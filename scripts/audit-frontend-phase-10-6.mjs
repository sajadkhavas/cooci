import fs from "node:fs";

const files = {
  docs: "docs/FRONTEND_PHASE_10_6_CONTENT_TOPICAL_AUTHORITY.md",
  roadmap: "docs/FULL_LAUNCH_ROADMAP.md",
  readme: "README.md",
  package: "package.json",
  topics: "src/lib/seo/content-topics.ts",
  topicsServer: "src/lib/seo/content-topics.server.ts",
  contentSchema: "src/lib/seo/content-schema.ts",
  publicSsr: "src/lib/public-ssr.ts",
  loaders: "src/lib/public-loaders.server.ts",
  routes: "src/routes.ts",
  topicRoute: "src/routes/blog-topic.tsx",
  blogList: "src/pages/BlogListPage.tsx",
  blogTopic: "src/pages/BlogTopicPage.tsx",
  blogDetail: "src/pages/BlogDetailPage.tsx",
  postCard: "src/components/content/BlogPostCard.tsx",
  topicNav: "src/components/content/ContentTopicNav.tsx",
  seo: "src/components/SEO.tsx",
  sitemap: "src/lib/seo/sitemap.server.ts",
  unit: "tests/unit/content-topics.test.ts",
  e2e: "e2e/phase10-6-content-topical-authority.spec.mjs",
  fixture: "scripts/phase10-3-catalog-fixture.mjs",
  frontendCi: ".github/workflows/frontend-ci.yml",
  deployment: ".github/workflows/phase8-deployment.yml",
  phase18: ".github/workflows/phase18-e2e.yml",
};

const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 10.6 file: ${path}`);
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

requireText("docs", "content_topical_authority=ready", "final Phase 10.6 marker");
requireText("roadmap", "Phase 10.6 — Content and topical authority foundation — complete");
requireText("readme", "Content and topical authority | Complete in Phase 10.6");

requireText("topics", "collectContentTopics", "authoritative topic collector");
requireText("topics", "/blog/topic/", "stable topic URL builder");
requireText("topicsServer", "collectPublishedContentTopics", "paginated Laravel taxonomy collection");
requireText("topicsServer", "loadRelatedPublishedPosts", "same-topic related content");
requireText("contentSchema", '"@type": activeTopic ? "CollectionPage" : "Blog"', "Blog and CollectionPage schemas");
requireText("contentSchema", '"@type": "BlogPosting"', "BlogPosting schema");
requireText("contentSchema", "articleSection", "article topic metadata");
requireText("contentSchema", "keywords", "backend tag metadata");

requireText("routes", 'route("blog/topic/:topic"', "crawlable topic route");
requireText("topicRoute", "loadBlogTopicPublicData", "topic SSR loader wiring");
requireText("loaders", "collectPublishedContentTopics", "Laravel topic loader");
requireText("loaders", "loadOptionalRelatedPosts", "optional related content load");
requireText("publicSsr", "contentTopics?: ContentTopicSummary[]", "typed topic SSR payload");
requireText("publicSsr", "relatedPosts?: BackendPostSummary[]", "typed related post payload");
requireText("blogList", "ContentTopicNav", "blog topic navigation");
requireText("blogTopic", "createBlogCollectionSchema", "topic collection schema");
requireText("blogDetail", "راهنماهای مرتبط", "visible related content section");
requireText("blogDetail", "getContentTopicPath", "article-to-topic internal link");
requireText("postCard", "getContentTopicPath", "card topic link");
requireText("topicNav", 'aria-label="موضوعات راهنما"', "semantic topic navigation");
requireText("seo", 'pathname.startsWith("/blog/topic/")', "topic pagination canonical support");
requireText("sitemap", "content.topics", "topic sitemap entries");

forbidText("blogList", "const topics = [", "static topic inventory");
forbidText("blogTopic", "mock", "mock topic content");
forbidText("contentSchema", "dateModified:", "invented article modification date");

requireText("unit", "topic summaries are derived only from published post payloads", "authoritative taxonomy unit gate");
requireText("unit", "links the article to its crawlable topic hub", "article cluster unit gate");
requireText("e2e", "Phase 10.6 content and topical authority", "content authority Playwright acceptance");
requireText("fixture", "phase10-6-related-guide", "deterministic related content fixture");
requireText("frontendCi", "Frontend content and topical authority Phase 10.6", "CI Phase 10.6 gate");
requireText("deployment", "audit:phase10-6", "deployment Phase 10.6 audit");
requireText("phase18", "Run Phase 10.6 content and topical authority acceptance", "Laravel content E2E gate");
requireText("package", '"audit:phase10-6"', "Phase 10.6 package command");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
};
fs.writeFileSync("frontend-phase10-6-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Frontend Phase 10.6 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 10.6 audit passed: Laravel-derived topic hubs, visible internal links, related content, BlogPosting schemas and topic sitemap entries are locked.",
);
