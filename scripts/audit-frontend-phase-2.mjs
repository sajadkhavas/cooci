import fs from "node:fs";

const files = {
  api: "src/lib/api.ts",
  auth: "src/lib/auth.ts",
  authContext: "src/context/AuthContext.tsx",
  login: "src/pages/LoginPage.tsx",
  loginRoute: "src/components/auth/LoginRoute.tsx",
  app: "src/App.tsx",
  navigation: "src/lib/security/navigation.ts",
  normalization: "src/lib/security/normalization.ts",
  apiUrl: "src/lib/security/api-url.ts",
  unit: "tests/unit/security.test.ts",
  e2e: "e2e/phase18.spec.mjs",
  package: "package.json",
};

const errors = [];
const sources = {};

for (const [name, path] of Object.entries(files)) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing Phase 2 file: ${path}`);
    continue;
  }
  sources[name] = fs.readFileSync(path, "utf8");
}

const requireText = (file, text, label = text) => {
  if (!sources[file]?.includes(text)) {
    errors.push(`${files[file]}: missing ${label}`);
  }
};

const forbidText = (file, text, label = text) => {
  if (sources[file]?.includes(text)) {
    errors.push(`${files[file]}: contains forbidden ${label}`);
  }
};

requireText("api", "normalizeApiBaseUrl", "validated API base URL");
requireText("api", "resolveApiRequestUrl", "same-origin API path resolver");
requireText("api", "AUTH_SESSION_EXPIRED_EVENT", "session-expiry event");
requireText("api", "retryAfterSeconds?: number", "Retry-After metadata");
requireText("api", 'code: "network_error"', "normalized network errors");
requireText("api", 'code: "request_aborted"', "external abort distinction");
requireText("api", "suppressAuthExpiryEvent", "bootstrap/logout expiry suppression");
requireText("api", "error.status === 419", "single CSRF refresh retry");
forbidText("api", "`${API_BASE_URL}${path}`", "raw API URL concatenation");

requireText("auth", "normalizeOtpCode", "OTP-specific normalization");
requireText(
  "auth",
  "import.meta.env.DEV || exposeLoopbackAcceptanceOtpCode",
  "development or exact-loopback acceptance debug code",
);
requireText(
  "auth",
  'import.meta.env.VITE_E2E_ACCEPTANCE === "true"',
  "explicit acceptance diagnostics flag",
);
requireText("auth", "error.status === 401", "status-based unauthenticated bootstrap");
requireText("auth", "suppressAuthExpiryEvent: true", "safe auth bootstrap/logout behavior");
forbidText("auth", "devCode: challenge.debugCode,", "unconditional OTP debug code");

requireText("authContext", "AUTH_SESSION_EXPIRED_EVENT", "global session expiry listener");
requireText("login", "sanitizeInternalReturnPath", "defense-in-depth return path sanitizer");
requireText("login", "normalizeOtpCode", "OTP input normalizer");
requireText("login", "expiryCountdown", "OTP expiry state");
requireText("login", 'error.code === "rate_limited"', "rate limit feedback");
forbidText("login", 'state?.from?.startsWith("/")', "weak startsWith-only redirect check");

requireText("loginRoute", "sanitizeInternalReturnPath", "pre-render login return guard");
requireText("app", "<LoginRoute>", "login route security wrapper");
requireText("navigation", 'candidate.startsWith("//")', "protocol-relative redirect rejection");
requireText("navigation", 'parsed.pathname === "/account/login"', "login-loop rejection");
requireText("normalization", "normalizeIranianMobile", "mobile normalization");
requireText("normalization", "replace(/^0098", "0098 mobile normalization");
requireText("normalization", "normalizeOtpCode", "OTP normalization");
requireText("apiUrl", 'parsed.protocol !== "https:"', "production HTTPS enforcement");
requireText("apiUrl", "resolved.origin !== base.origin", "API origin escape prevention");

requireText("unit", "return paths stay inside", "return path unit test");
requireText("unit", "Persian and Arabic digits", "digit normalization unit test");
requireText("unit", "production API origins require HTTPS", "API base unit test");
requireText("e2e", "protocol-relative login return state", "hostile return-state browser test");
requireText("e2e", "protected API 401 invalidates stale React auth state", "expired-session browser test");
requireText("package", '"test:unit"', "unit test command");
requireText("package", '"audit:phase2"', "Phase 2 audit command");

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
};
fs.writeFileSync("frontend-phase2-audit.json", `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Frontend Phase 2 audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  "Frontend Phase 2 audit passed: API origin/path validation, network and rate-limit errors, CSRF retry, session expiry, same-origin login redirects, OTP normalization and exact-loopback diagnostics are locked.",
);
