import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { sanitizeInternalReturnPath } from "../../src/lib/security/navigation.ts";

const read = (relativePath: string) =>
  readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8");

const auth = read("src/lib/auth.ts");
const authContext = read("src/context/AuthContext.tsx");
const login = read("src/pages/LoginPage.tsx");
const protectedRoute = read("src/components/auth/ProtectedRoute.tsx");
const mobileGate = read("src/components/auth/MobileCompletionGate.tsx");
const accountSecurity = read("src/components/account/GoogleAccountSecurityPanel.tsx");
const backendContract = read("src/lib/backend-contract.ts");
const envExample = read(".env.example");

test("F29 google navigation stays on fixed backend OAuth routes", () => {
  assert.match(auth, /GOOGLE_LOGIN_PATH = "\/auth\/google\/redirect"/);
  assert.match(auth, /GOOGLE_LINK_PATH = "\/auth\/google\/link"/);
  assert.match(auth, /sanitizeInternalReturnPath\(value\)/);
  assert.match(auth, /window\.location\.assign\(resolveBackendWebUrl\(GOOGLE_LOGIN_PATH\)\)/);
  assert.match(auth, /window\.location\.assign\(resolveBackendWebUrl\(GOOGLE_LINK_PATH\)\)/);
  assert.equal(auth.includes("VITE_GOOGLE_"), false);
});

test("F29 return paths remain internal across the Google round trip", () => {
  assert.equal(
    sanitizeInternalReturnPath("/account/orders/01TEST?tab=payment"),
    "/account/orders/01TEST?tab=payment",
  );
  assert.equal(sanitizeInternalReturnPath("//evil.example/steal"), "/account");
  assert.equal(sanitizeInternalReturnPath("https://evil.example"), "/account");
  assert.match(auth, /GOOGLE_RETURN_PATH_KEY/);
  assert.match(login, /consumeGoogleReturnPath\(\)/);
});

test("F29 auth capabilities are backend-authoritative and fail closed", () => {
  assert.match(auth, /\/api\/auth\/capabilities/);
  assert.match(auth, /return \{ googleEnabled: false, otpEnabled: false \}/);
  assert.match(authContext, /loadAuthCapabilities/);
  assert.match(login, /capabilities\.googleEnabled/);
  assert.match(login, /capabilities\.otpEnabled/);
});

test("F29 Google-created customers cannot bypass mobile completion", () => {
  assert.match(backendContract, /mobile: string \| null/);
  assert.match(backendContract, /requiresMobileCompletion: boolean/);
  assert.match(protectedRoute, /user\?\.requiresMobileCompletion/);
  assert.match(protectedRoute, /<MobileCompletionGate \/>/);
  assert.match(mobileGate, /completeMobile\(normalized\)/);
  assert.match(mobileGate, /ثبت شماره به معنی تأیید آن نیست/);
});

test("F29 explicit account linking is authenticated UI, not email auto-link UX", () => {
  assert.match(accountSecurity, /user\.googleLinked/);
  assert.match(accountSecurity, /startGoogleLink\(\)/);
  assert.match(accountSecurity, /تطبیق خودکار ایمیل برای اتصال استفاده نمی‌شود/);
  assert.match(login, /account_link_required/);
});

test("frontend environment never receives Google OAuth credentials", () => {
  assert.equal(envExample.includes("GOOGLE_CLIENT_SECRET"), false);
  assert.equal(envExample.includes("GOOGLE_CLIENT_ID"), false);
  assert.equal(envExample.includes("VITE_GOOGLE"), false);

  const viteKeys = [...envExample.matchAll(/^\s*(VITE_[A-Z0-9_]+)=/gm)].map(
    (match) => match[1],
  );
  assert.equal(
    viteKeys.some((key) => /(GOOGLE|SECRET|CLIENT_ID|CLIENT_SECRET)/.test(key)),
    false,
  );
  assert.match(envExample, /other secret through VITE_\* variables/i);
});
