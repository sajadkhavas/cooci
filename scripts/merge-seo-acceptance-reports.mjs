import fs from "node:fs";
import path from "node:path";
import {
  SEO_ACCEPTANCE_FORMAT,
  SEO_RELEASE_MARKER,
  validateMergedSeoAcceptance,
  validateSeoProjectReport,
} from "../src/lib/seo/release-candidate.ts";

const args = process.argv.slice(2);
const outputPath = path.resolve(args.pop() || "seo-acceptance-report.json");
const inputPaths = args.length
  ? args.map((input) => path.resolve(input))
  : [
      path.resolve("seo-acceptance-desktop-chromium.json"),
      path.resolve("seo-acceptance-mobile-chromium.json"),
    ];

const projects = inputPaths.map((inputPath) => {
  if (!fs.existsSync(inputPath)) throw new Error(`SEO acceptance report is missing: ${inputPath}`);
  const report = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const errors = validateSeoProjectReport(report);
  if (errors.length) throw new Error(`${inputPath}: ${errors.join("; ")}`);
  return report;
});

const merged = {
  format: SEO_ACCEPTANCE_FORMAT,
  marker: SEO_RELEASE_MARKER,
  generatedAt: new Date().toISOString(),
  passed: true,
  frontendOrigin: projects[0]?.frontendOrigin,
  sitemapSha256: projects[0]?.sitemapSha256,
  projects,
};
const errors = validateMergedSeoAcceptance(merged);
if (errors.length) {
  console.error(`SEO acceptance merge failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

fs.writeFileSync(outputPath, `${JSON.stringify(merged, null, 2)}\n`);
console.log(`Merged ${projects.length} SEO acceptance reports into ${outputPath}.`);
