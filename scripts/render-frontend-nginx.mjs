import fs from "node:fs";
import path from "node:path";

const templatePath = path.resolve(
  process.cwd(),
  process.argv[2] || "deploy/nginx/winimi-frontend.conf.example",
);
const outputPath = path.resolve(
  process.cwd(),
  process.argv[3] || "deploy/nginx/winimi-frontend.conf",
);

const values = {
  __HTTP_PORT__: process.env.FRONTEND_HTTP_PORT || "80",
  __HTTPS_PORT__: process.env.FRONTEND_HTTPS_PORT || "443",
  __HTTPS_REDIRECT_PORT__: process.env.FRONTEND_HTTPS_REDIRECT_PORT ?? "",
  __SERVER_NAMES__: process.env.FRONTEND_SERVER_NAMES || "winimibakery.com www.winimibakery.com",
  __CANONICAL_HOST__: process.env.FRONTEND_CANONICAL_HOST || "winimibakery.com",
  __FRONTEND_ROOT__: process.env.FRONTEND_DEPLOY_ROOT || "/var/www/winimi/frontend",
  __ACME_ROOT__: process.env.FRONTEND_ACME_ROOT || "/var/www/letsencrypt",
  __TLS_CERTIFICATE__:
    process.env.FRONTEND_TLS_CERTIFICATE ||
    "/etc/letsencrypt/live/winimibakery.com/fullchain.pem",
  __TLS_CERTIFICATE_KEY__:
    process.env.FRONTEND_TLS_CERTIFICATE_KEY ||
    "/etc/letsencrypt/live/winimibakery.com/privkey.pem",
  __SECURITY_HEADERS_INCLUDE__:
    process.env.FRONTEND_SECURITY_HEADERS_INCLUDE ||
    "/etc/nginx/snippets/winimi-security-headers.conf",
};

for (const [name, value] of Object.entries(values)) {
  const mayBeEmpty = name === "__HTTPS_REDIRECT_PORT__";
  if ((!mayBeEmpty && !value) || /[\r\n;]/.test(value)) {
    throw new Error(`Unsafe or empty Nginx value: ${name}`);
  }
  if (["__HTTP_PORT__", "__HTTPS_PORT__"].includes(name) && !/^\d{2,5}$/.test(value)) {
    throw new Error(`Invalid Nginx port: ${name}=${value}`);
  }
  if (name === "__HTTPS_REDIRECT_PORT__" && value && !/^:\d{2,5}$/.test(value)) {
    throw new Error(`Invalid HTTPS redirect port suffix: ${value}`);
  }
}

let config = fs.readFileSync(templatePath, "utf8");
for (const [name, value] of Object.entries(values)) {
  config = config.split(name).join(value);
}

const unresolved = config.match(/__[A-Z0-9_]+__/g);
if (unresolved) throw new Error(`Unresolved Nginx placeholders: ${[...new Set(unresolved)].join(", ")}`);
if (/Content-Security-Policy-Report-Only/i.test(config)) {
  throw new Error("Phase 8 requires an enforced Content-Security-Policy.");
}
if (/script-src[^;]*(?:\*|'unsafe-eval')/i.test(config)) {
  throw new Error("Unsafe script execution is forbidden in production CSP.");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, config);
console.log(`Rendered production Nginx config: ${outputPath}`);
