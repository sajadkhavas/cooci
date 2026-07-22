import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const sourcePath = resolve(process.cwd(), "e2e/phase18.spec.mjs");
const outputPath = resolve(process.cwd(), "e2e/generated/phase18.spec.mjs");

let source = readFileSync(sourcePath, "utf8");

const replaceExactly = (needle, replacement, expectedCount, label) => {
  const count = source.split(needle).length - 1;
  if (count !== expectedCount) {
    throw new Error(
      `${label}: expected ${expectedCount} source occurrence(s), found ${count}.`,
    );
  }
  source = source.split(needle).join(replacement);
};

replaceExactly(
  `const attachPageErrorGuard = (page) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return () => expect(errors, \`Unhandled browser errors: \${errors.join(" | ")}\`).toEqual([]);
};`,
  `const attachPageErrorGuard = (page) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /Content Security Policy|Refused to execute inline script/i.test(message.text())
    ) {
      errors.push(message.text());
    }
  });
  return () =>
    expect(errors, \`Unhandled browser/security errors: \${errors.join(" | ")}\`).toEqual([]);
};`,
  1,
  "browser CSP error guard",
);
replaceExactly(
  'const apiOrigin = process.env.PHASE18_API_URL || "http://127.0.0.1:8000";\n',
  'const apiOrigin = process.env.PHASE18_API_URL || "http://127.0.0.1:8000";\n' +
    'const frontendOrigin =\n' +
    '  process.env.PHASE18_FRONTEND_URL || "http://127.0.0.1:4173";\n',
  1,
  "frontend acceptance origin insertion",
);
replaceExactly(
  'Origin: "http://127.0.0.1:4173",',
  "Origin: frontendOrigin,",
  2,
  "request Origin headers",
);
replaceExactly(
  'Referer: "http://127.0.0.1:4173/",',
  "Referer: `${frontendOrigin}/`,",
  2,
  "request Referer headers",
);
replaceExactly(
  'expect(new URL(page.url()).origin).toBe("http://127.0.0.1:4173");',
  "expect(new URL(page.url()).origin).toBe(new URL(frontendOrigin).origin);",
  1,
  "safe login destination origin",
);
replaceExactly(
  'await expect(canonicals).toHaveAttribute("href", "http://127.0.0.1:4173/products");',
  'await expect(canonicals).toHaveAttribute("href", `${frontendOrigin}/products`);',
  1,
  "canonical storefront origin",
);
replaceExactly(
  `  await page.goto("/products?q=staging-cookie&shipping=chilled&sort=price-desc");
  const canonicals = page.locator('link[rel="canonical"]');
  await expect(canonicals).toHaveCount(1);
  await expect(canonicals).toHaveAttribute("href", \`\${frontendOrigin}/products\`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,nofollow",
  );`,
  `  const filteredResponse = await page.goto(
    "/products?q=staging-cookie&shipping=chilled&sort=price-desc",
  );
  expect(filteredResponse?.headers()["x-robots-tag"]).toBe("noindex,follow");
  const canonicals = page.locator('link[rel="canonical"]');
  await expect(canonicals).toHaveCount(1);
  await expect(canonicals).toHaveAttribute("href", \`\${frontendOrigin}/products\`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,follow",
  );`,
  1,
  "filtered collection crawl policy",
);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, source, "utf8");
console.log(`Generated ${outputPath} from the UTF-8 Phase 18 acceptance source.`);
