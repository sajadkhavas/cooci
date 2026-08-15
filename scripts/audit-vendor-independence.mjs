import {
  existsSync,
  readFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";

const forbidden = [
  ["lo", "vable"].join(""),
  ["gpt", "-engineer"].join(""),
].map((value) => value.toLowerCase());

const files = execFileSync(
  "git",
  [
    "ls-files",
    "-co",
    "--exclude-standard",
    "-z",
  ],
  {
    encoding: "utf8",
  },
)
  .split("\0")
  .filter(Boolean);

const findings = [];

for (const file of files) {
  if (!existsSync(file)) {
    continue;
  }

  const normalizedPath = file.toLowerCase();

  for (const token of forbidden) {
    if (normalizedPath.includes(token)) {
      findings.push(
        `${file}: forbidden vendor marker in path`,
      );
    }
  }

  let data;

  try {
    data = readFileSync(file);
  } catch {
    continue;
  }

  if (data.includes(0)) {
    continue;
  }

  const text = data
    .toString("utf8")
    .toLowerCase();

  for (const token of forbidden) {
    if (text.includes(token)) {
      findings.push(
        `${file}: forbidden vendor marker in content`,
      );
    }
  }
}

if (findings.length) {
  console.error(
    `Vendor independence audit failed with ${findings.length} finding(s):`,
  );

  for (const finding of findings) {
    console.error(`- ${finding}`);
  }

  process.exit(1);
}

console.log(
  "Vendor independence audit passed.",
);
