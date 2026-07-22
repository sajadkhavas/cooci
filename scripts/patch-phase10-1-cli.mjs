import { readFileSync, writeFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
packageJson.scripts.dev = "npx @react-router/dev dev --host 0.0.0.0 --port 8080";
packageJson.scripts.typegen = "npx @react-router/dev typegen";
packageJson.scripts.build =
  "npx @react-router/dev build && vite build --config vite.ssr-server.config.ts && node scripts/generate-service-worker.mjs";
packageJson.scripts["build:dev"] =
  "npx @react-router/dev build --mode development && vite build --mode development --config vite.ssr-server.config.ts";
packageJson.scripts.typecheck =
  "npm run typegen && tsc --noEmit -p tsconfig.app.json && tsc --noEmit -p tsconfig.node.json";
packageJson.devDependencies.vite = "7.3.6";
writeFileSync("package.json", `${JSON.stringify(packageJson, null, 2)}\n`);
console.log("React Router CLI commands and Vite compatibility pin applied.");
