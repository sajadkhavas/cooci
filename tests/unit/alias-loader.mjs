import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) {
    return nextResolve(specifier, context);
  }

  const relative = specifier.slice(2);
  const candidates = [
    path.join(projectRoot, "src", `${relative}.ts`),
    path.join(projectRoot, "src", `${relative}.tsx`),
    path.join(projectRoot, "src", relative, "index.ts"),
    path.join(projectRoot, "src", relative, "index.tsx"),
  ];
  const match = candidates.find((candidate) => fs.existsSync(candidate));
  if (!match) {
    throw new Error(`Unit-test alias loader could not resolve ${specifier}`);
  }

  return {
    url: pathToFileURL(match).href,
    shortCircuit: true,
  };
}
