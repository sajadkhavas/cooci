import { readFileSync, writeFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
packageJson.scripts.dev = "react-router dev --host 0.0.0.0 --port 8080";
packageJson.scripts.typegen = "react-router typegen";
packageJson.scripts.build =
  "react-router build && vite build --config vite.ssr-server.config.ts && node scripts/generate-service-worker.mjs";
packageJson.scripts["build:dev"] =
  "react-router build --mode development && vite build --mode development --config vite.ssr-server.config.ts";
packageJson.scripts.typecheck =
  "npm run typegen && tsc --noEmit -p tsconfig.app.json && tsc --noEmit -p tsconfig.node.json";
packageJson.scripts.postinstall =
  "node scripts/patch-react-router-dev-module-sync.mjs";
packageJson.dependencies["react-router"] = "7.18.1";
packageJson.dependencies["@react-router/express"] = "7.18.1";
packageJson.dependencies["@react-router/node"] = "7.18.1";
packageJson.dependencies.isbot = "5.2.1";
packageJson.devDependencies["@react-router/dev"] = "7.18.1";
packageJson.devDependencies.vite = "7.3.6";
writeFileSync("package.json", `${JSON.stringify(packageJson, null, 2)}\n`);
console.log(
  "React Router Framework Mode pinned to 7.18.1 with Node, Vite 7.3.6, isbot and a build-time shim repair.",
);
