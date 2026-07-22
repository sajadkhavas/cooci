import { readFileSync, writeFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const cli = "node ./node_modules/@react-router/dev/dist/cli/index.js";
packageJson.scripts.dev = `${cli} dev --host 0.0.0.0 --port 8080`;
packageJson.scripts.typegen = `${cli} typegen`;
packageJson.scripts.build =
  `${cli} build && vite build --config vite.ssr-server.config.ts && node scripts/generate-service-worker.mjs`;
packageJson.scripts["build:dev"] =
  `${cli} build --mode development && vite build --mode development --config vite.ssr-server.config.ts`;
packageJson.scripts.typecheck =
  "npm run typegen && tsc --noEmit -p tsconfig.app.json && tsc --noEmit -p tsconfig.node.json";
packageJson.devDependencies.vite = "7.3.6";
writeFileSync("package.json", `${JSON.stringify(packageJson, null, 2)}\n`);
console.log("React Router CLI commands now use the locked local dependency graph.");
