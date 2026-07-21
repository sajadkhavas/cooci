import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const sourcePath = resolve(process.cwd(), "e2e/phase18.spec.mjs");
const outputPath = resolve(process.cwd(), "e2e/phase18.generated.spec.mjs");

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

writeFileSync(outputPath, source, "utf8");
console.log(`Generated ${outputPath} from the UTF-8 Phase 18 acceptance source.`);
