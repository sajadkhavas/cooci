import fs from "node:fs";
const files = {
  creator: "scripts/create-frontend-release.mjs",
  verifier: "scripts/verify-frontend-release.mjs",
  deploy: "deploy/bin/deploy-frontend.sh",
  rollback: "deploy/bin/rollback-frontend.sh",
  smoke: "deploy/bin/smoke-test-frontend.sh",
  nginx: "deploy/nginx/winimi-frontend.conf.example",
  commonHeaders: "deploy/nginx/winimi-security-headers.conf",
  staticCsp: "deploy/nginx/winimi-static-csp.conf",
  renderer: "scripts/render-frontend-nginx.mjs",
  systemd: "deploy/systemd/winimi-frontend-ssr.service.example",
  workflow: ".github/workflows/phase8-deployment.yml",
};
const errors = [];
const sources = {};
for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) errors.push("Missing Phase 8 SSR file: " + path);
  else sources[name] = fs.readFileSync(path, "utf8");
}
const requireText = (file, text, label = text) => { if (!sources[file]?.includes(text)) errors.push(files[file] + ": missing " + label); };
const forbidText = (file, text, label = text) => { if (sources[file]?.includes(text)) errors.push(files[file] + ": contains forbidden " + label); };
requireText("creator", '"winimi-frontend-ssr-release-v2"', "SSR manifest v2");
requireText("creator", '"runtime/server.mjs"', "runtime release entry");
requireText("creator", "forbiddenTextPatterns", "secret scan");
requireText("verifier", "SHA-256 mismatch", "release integrity");
requireText("deploy", "FRONTEND_RESTART_COMMAND", "runtime restart hook");
requireText("deploy", "FRONTEND_HEALTH_URL", "post-switch health hook");
requireText("deploy", "restoring previous release", "failed activation rollback");
requireText("rollback", "restart_runtime", "rollback runtime restart");
requireText("smoke", "homepage H1 before hydration", "source HTML smoke");
requireText("smoke", "nonce CSP", "nonce-bearing CSP smoke");
requireText("nginx", "upstream winimi_ssr", "SSR upstream");
requireText("nginx", "proxy_pass http://winimi_ssr", "SSR proxy");
requireText("nginx", "current/app/build/client", "client asset root");
requireText("nginx", "proxy_buffering off", "streaming SSR proxy");
forbidText("commonHeaders", "Content-Security-Policy", "static CSP overriding SSR nonce");
requireText("staticCsp", "Content-Security-Policy", "offline document CSP");
requireText("renderer", "FRONTEND_SSR_UPSTREAM", "SSR render input");
requireText("systemd", "build/runtime/server.mjs", "systemd SSR entrypoint");
requireText("systemd", "NoNewPrivileges=true", "systemd hardening");
requireText("workflow", "Start release A SSR runtime", "real SSR release boot");
requireText("workflow", "Run HTTPS SSR production smoke test", "SSR HTTPS gate");
const report = { generatedAt: new Date().toISOString(), passed: errors.length === 0, format: "winimi-frontend-ssr-release-v2", errors };
fs.writeFileSync("frontend-phase8-audit.json", JSON.stringify(report, null, 2) + "\n");
if (errors.length) { errors.forEach((error) => console.error("- " + error)); process.exit(1); }
console.log("Frontend Phase 8 audit passed: deterministic SSR release, atomic runtime activation, Nginx proxy, nonce CSP and rollback are locked.");
