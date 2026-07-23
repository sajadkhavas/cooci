import { existsSync, readFileSync, writeFileSync } from "node:fs";

const requiredFiles = [
  "deploy/systemd/winimi-frontend.service",
  "deploy/systemd/frontend-runtime.env.example",
  "deploy/bin/deploy-production-frontend.sh",
  "deploy/bin/rollback-production-frontend.sh",
  "deploy/bin/preflight-frontend-server.sh",
  "deploy/bin/smoke-production-surfaces.sh",
  "deploy/nginx/winimi-frontend.conf.example",
  "deploy/nginx/winimi-security-headers.conf",
  "deploy/nginx/winimi-static-csp.conf",
  "docs/PHASE_19_PRODUCTION_DEPLOYMENT.md",
  "docs/SINGLE_SERVER_TOPOLOGY.md",
];

const failures = [];
for (const file of requiredFiles) {
  if (!existsSync(file)) failures.push(`missing required Phase 19 file: ${file}`);
}

const read = (file) => (existsSync(file) ? readFileSync(file, "utf8") : "");
const unit = read("deploy/systemd/winimi-frontend.service");
const runtimeEnv = read("deploy/systemd/frontend-runtime.env.example");
const deploy = read("deploy/bin/deploy-production-frontend.sh");
const rollback = read("deploy/bin/rollback-production-frontend.sh");
const preflight = read("deploy/bin/preflight-frontend-server.sh");
const smoke = read("deploy/bin/smoke-production-surfaces.sh");
const nginx = read("deploy/nginx/winimi-frontend.conf.example");
const roadmap = read("docs/FULL_LAUNCH_ROADMAP.md");
const runbook = read("docs/PHASE_19_PRODUCTION_DEPLOYMENT.md");

const requireText = (name, content, fragments) => {
  for (const fragment of fragments) {
    if (!content.includes(fragment)) failures.push(`${name} is missing: ${fragment}`);
  }
};

requireText("frontend systemd unit", unit, [
  "User=winimi",
  "Group=www-data",
  "EnvironmentFile=/etc/winimi/frontend-runtime.env",
  "ExecStart=/usr/bin/node /var/www/winimi/frontend/current/app/build/runtime/server.mjs",
  "Restart=on-failure",
  "NoNewPrivileges=true",
  "ProtectSystem=strict",
]);
requireText("frontend runtime env", runtimeEnv, [
  "HOST=127.0.0.1",
  "PORT=4173",
  "NODE_ENV=production",
  "WINIMI_API_ORIGIN=https://api.winimibakery.com",
]);
requireText("production deploy wrapper", deploy, [
  "deploy-frontend.sh",
  "systemctl restart",
  "__ssr_health",
  "systemctl is-active",
]);
requireText("production rollback wrapper", rollback, [
  "rollback-frontend.sh",
  "systemctl restart",
  "__ssr_health",
]);
requireText("server preflight", preflight, [
  "Node.js major must be 22",
  "nginx -t",
  "systemd-analyze verify",
  "HOST=127.0.0.1",
]);
requireText("production smoke", smoke, [
  "strict-transport-security",
  "/sitemap.xml",
  "/api/system/ready",
  "2026-07-20-phase-16",
]);
requireText("frontend nginx", nginx, [
  "proxy_pass http://winimi_ssr;",
  "max-age=31536000, immutable",
  "X-Forwarded-Proto https",
]);
requireText("Phase 19 runbook", runbook, [
  "production_server_package=ready",
  "production_deployed=ready",
  "Do not report",
  "rollback",
  "restore drill",
]);
requireText("roadmap", roadmap, [
  "Phase 19A — production deployment package",
  "production_server_package=ready",
  "Phase 19B — live server execution",
]);

for (const [name, content] of [
  ["frontend systemd unit", unit],
  ["frontend runtime env", runtimeEnv],
  ["frontend deployment scripts", `${deploy}\n${rollback}\n${preflight}\n${smoke}`],
]) {
  if (/ZARINPAL_MERCHANT_ID|KAVENEGAR_API_KEY|ENAMAD_BADGE_CODE|APP_KEY|DB_PASSWORD/.test(content)) {
    failures.push(`${name} contains a backend secret name`);
  }
}

const result = {
  phase: "19A",
  marker: failures.length ? "blocked" : "production_server_package=ready",
  checkedFiles: requiredFiles.length,
  failures,
};
writeFileSync("phase19-production-preparation-audit.json", `${JSON.stringify(result, null, 2)}\n`);

if (failures.length) {
  console.error(`Phase 19 production preparation audit failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 19 production deployment package audit passed.");
console.log("production_server_package=ready");
