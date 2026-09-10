import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_COMMIT = "6e553e33489a8f9dfaccc76860a2e3f3c1e66de7";
const EXPECTED_GIT_BLOB_SHA = "a501289a85595158570b0c2badcb4608b042e748";
const EXPECTED_BYTES = 111_152;
const SOURCE_URL = `https://raw.githubusercontent.com/rastikerdar/vazirmatn/${SOURCE_COMMIT}/fonts/webfonts/Vazirmatn%5Bwght%5D.woff2`;
const TARGET = path.join(
  process.cwd(),
  "public",
  "fonts",
  "Vazirmatn-Variable.woff2",
);

const gitBlobSha = (buffer) =>
  createHash("sha1")
    .update(`blob ${buffer.length}\0`)
    .update(buffer)
    .digest("hex");

const isExpectedFont = (buffer) =>
  buffer.length === EXPECTED_BYTES && gitBlobSha(buffer) === EXPECTED_GIT_BLOB_SHA;

const readExisting = async () => {
  try {
    return await readFile(TARGET);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
};

const existing = await readExisting();
if (existing && isExpectedFont(existing)) {
  console.log("Vazirmatn font already present and verified.");
  process.exit(0);
}

const response = await fetch(SOURCE_URL, {
  headers: {
    "user-agent": "winimi-build/1.0",
  },
  redirect: "follow",
});

if (!response.ok) {
  throw new Error(`Unable to fetch pinned Vazirmatn font: HTTP ${response.status}`);
}

const font = Buffer.from(await response.arrayBuffer());
if (!isExpectedFont(font)) {
  throw new Error(
    `Pinned Vazirmatn font integrity mismatch: bytes=${font.length} gitBlobSha=${gitBlobSha(font)}`,
  );
}

await mkdir(path.dirname(TARGET), { recursive: true });
await writeFile(TARGET, font, { mode: 0o644 });
console.log(`Vazirmatn font fetched and verified (${font.length} bytes).`);
