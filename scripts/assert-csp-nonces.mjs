import { readFileSync } from "node:fs";

const paths = process.argv.slice(2);
if (!paths.length) {
  throw new Error("Usage: node scripts/assert-csp-nonces.mjs <html-file> [...]");
}

for (const path of paths) {
  const html = readFileSync(path, "utf8");
  const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => !/\bsrc\s*=/i.test(match[1]));

  if (!inlineScripts.length) {
    throw new Error(`${path}: no inline SSR scripts were found.`);
  }

  const nonces = inlineScripts.map((match, index) => {
    const nonce = match[1].match(/\bnonce=["']([A-Za-z0-9_-]+)["']/i)?.[1];
    if (!nonce) {
      const preview = match[2].trim().slice(0, 90).replace(/\s+/g, " ");
      throw new Error(
        `${path}: inline script ${index + 1} is missing a CSP nonce (${preview}).`,
      );
    }
    return nonce;
  });

  const uniqueNonces = new Set(nonces);
  if (uniqueNonces.size !== 1) {
    throw new Error(
      `${path}: inline SSR scripts do not share one response nonce (${[
        ...uniqueNonces,
      ].join(", ")}).`,
    );
  }

  console.log(
    `${path}: ${inlineScripts.length} inline SSR script(s) share nonce ${nonces[0]}.`,
  );
}
