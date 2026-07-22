import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const packageRoot = resolve("node_modules/@react-router/dev");
const packageJson = resolve(packageRoot, "package.json");
const shimDirectory = resolve(packageRoot, "module-sync-enabled");
const indexModule = resolve(shimDirectory, "index.mjs");

if (!existsSync(packageJson)) {
  console.log("@react-router/dev is not installed; module-sync shim patch skipped.");
  process.exit(0);
}

mkdirSync(shimDirectory, { recursive: true });
if (!existsSync(resolve(shimDirectory, "false.cjs"))) {
  writeFileSync(resolve(shimDirectory, "false.cjs"), "exports.default = false;\n");
}
if (!existsSync(resolve(shimDirectory, "true.mjs"))) {
  writeFileSync(resolve(shimDirectory, "true.mjs"), "export default true;\n");
}
if (!existsSync(resolve(shimDirectory, "index.d.mts"))) {
  writeFileSync(
    resolve(shimDirectory, "index.d.mts"),
    "declare const moduleSyncEnabled: boolean;\nexport { moduleSyncEnabled };\n",
  );
}
if (!existsSync(indexModule)) {
  writeFileSync(
    indexModule,
    [
      'import { createRequire } from "node:module";',
      "const require = createRequire(import.meta.url);",
      'const moduleSyncEnabled = require("#module-sync-enabled").default;',
      "export { moduleSyncEnabled };",
      "",
    ].join("\n"),
  );
}

console.log("React Router development module-sync shim is present.");
