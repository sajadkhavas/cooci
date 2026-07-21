import {
  ApiError,
  apiData,
  areDevelopmentMocksEnabled,
  getFrontendDataMode,
  type ApiRequestOptions,
} from "@/lib/api";
import type { BackendOtpChallenge, BackendUser } from "@/lib/backend-contract";
import {
  isValidIranianMobileNumber,
  normalizeIranianMobile,
  normalizeOtpCode,
} from "@/lib/security/normalization";

export type AuthMode = "backend" | "mock" | "disabled";

const exposeLoopbackAcceptanceOtpCode =
  import.meta.env.VITE_E2E_ACCEPTANCE === "true" &&
  import.meta.env.VITE_SITE_ORIGIN === "https://127.0.0.1:4443" &&
  import.meta.env.VITE_API_BASE_URL === "https://127.0.0.1:8443";

export interface AuthUser {
  id: string;
  mobile: string;
  fullName?: string;
  email?: string;
  mobileVerified: boolean;
  marketingConsent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  user: AuthUser;
}

export interface OtpRequestResult {
  challengeId: string;
  expiresIn: number;
  retryAfter: number;
  devCode?: string;
}

export interface VerifyOtpInput {
  mobile: string;
  challengeId: string;
  code: string;
}

interface MockChallenge {
  challengeId: string;
  mobile: string;
  code: string;
  expiresAt: number;
}

const MOCK_SESSION_KEY = "winimi_dev_auth_session_v1";
const MOCK_PROFILES_KEY = "winimi_dev_auth_profiles_v1";
const MOCK_CHALLENGE_KEY = "winimi_dev_auth_challenge_v1";

const mapUser = (user: BackendUser): AuthUser => ({
  id: user.id,
  mobile: user.mobile,
  fullName: user.fullName || undefined,
  email: user.email || undefined,
  mobileVerified: user.mobileVerified,
  marketingConsent: user.marketingConsent,
  createdAt: user.createdAt || undefined,
  updatedAt: user.updatedAt || undefined,
});

const assertMockAllowed = () => {
  if (!areDevelopmentMocksEnabled) {
    throw new Error("حالت آزمایشی ورود فقط در محیط توسعه قابل استفاده است.");
  }
};

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replaceAll("-", "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
};

const randomOtpCode = () => {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const value = crypto.getRandomValues(new Uint32Array(1))[0] % 900_000;
    return String(100_000 + value);
  }
  return String(Math.floor(100_000 + Math.random() * 900_000));
};

const readStorageJson = <T>(
  storage: Storage,
  key: string,
  fallback: T,
): T => {
  try {
    const value = storage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorageJson = (storage: Storage, key: string, value: unknown) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Development-only storage can be unavailable in restricted browsers.
  }
};

const removeStorageValue = (storage: Storage, key: string) => {
  try {
    storage.removeItem(key);
  } catch {
    // Development-only storage can be unavailable in restricted browsers.
  }
};

const readMockProfiles = (): Record<string, AuthUser> => {
  if (typeof window === "undefined") return {};
  return readStorageJson(window.localStorage, MOCK_PROFILES_KEY, {});
};

const writeMockProfiles = (profiles: Record<string, AuthUser>) => {
  if (typeof window === "undefined") return;
  writeStorageJson(window.localStorage, MOCK_PROFILES_KEY, profiles);
};

const readMockSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  const session = readStorageJson<AuthSession | null>(
    window.sessionStorage,
    MOCK_SESSION_KEY,
    null,
  );
  return session?.user?.mobile ? session : null;
};

const writeMockSession = (session: AuthSession | null) => {
  if (typeof window === "undefined") return;
  if (session) {
    writeStorageJson(window.sessionStorage, MOCK_SESSION_KEY, session);
  } else {
    removeStorageValue(window.sessionStorage, MOCK_SESSION_KEY);
  }
};

export const normalizeMobile = normalizeIranianMobile;
export const isValidIranianMobile = isValidIranianMobileNumber;
export { normalizeOtpCode };

export const getAuthMode = (): AuthMode => getFrontendDataMode();

export const authenticatedRequest = <T>(
  path: string,
  options: ApiRequestOptions = {},
) => apiData<T>(path, options);

export const bootstrapAuth = async (): Promise<AuthSession | null> => {
  const mode = getAuthMode();
  if (mode === "disabled") return null;
  if (mode === "mock") {
    assertMockAllowed();
    return readMockSession();
  }

  try {
    const payload = await apiData<{ user: BackendUser }>("/api/auth/me", {
      suppressAuthExpiryEvent: true,
    });
    return { user: mapUser(payload.user) };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
};

export const requestOtp = async (rawMobile: string): Promise<OtpRequestResult> => {
  const mobile = normalizeMobile(rawMobile);
  if (!isValidIranianMobile(mobile)) {
    throw new Error("شماره موبایل را به‌صورت 09xxxxxxxxx وارد کنید.");
  }

  const mode = getAuthMode();
  if (mode === "disabled") {
    throw new Error("ورود کاربران در حال حاضر فعال نیست.");
  }
  if (mode === "backend") {
    const challenge = await apiData<BackendOtpChallenge>("/api/auth/otp/request", {
      method: "POST",
      body: { mobile },
    });
    return {
      challengeId: challenge.challengeId,
      expiresIn: Math.max(0, challenge.expiresIn),
      retryAfter: Math.max(0, challenge.retryAfter),
      devCode:
        import.meta.env.DEV || exposeLoopbackAcceptanceOtpCode
          ? challenge.debugCode
          : undefined,
    };
  }

  assertMockAllowed();
  const challenge: MockChallenge = {
    challengeId: `DEV-${randomId().slice(0, 22)}`,
    mobile,
    code: randomOtpCode(),
    expiresAt: Date.now() + 2 * 60_000,
  };
  writeStorageJson(window.sessionStorage, MOCK_CHALLENGE_KEY, challenge);
  return {
    challengeId: challenge.challengeId,
    expiresIn: 120,
    retryAfter: 60,
    devCode: challenge.code,
  };
};

export const verifyOtp = async (input: VerifyOtpInput): Promise<AuthSession> => {
  const mobile = normalizeMobile(input.mobile);
  const challengeId = input.challengeId.trim();
  const code = normalizeOtpCode(input.code);
  const mode = getAuthMode();

  if (!isValidIranianMobile(mobile)) {
    throw new Error("شماره موبایل ورود معتبر نیست.");
  }
  if (!challengeId || challengeId.length > 160) {
    throw new Error("شناسه درخواست کد معتبر نیست؛ کد را دوباره ارسال کنید.");
  }
  if (!/^\d{4,6}$/.test(code)) {
    throw new Error("کد تأیید ۴ تا ۶ رقمی را کامل وارد کنید.");
  }

  if (mode === "disabled") throw new Error("ورود کاربران فعال نیست.");
  if (mode === "backend") {
    const payload = await apiData<{ user: BackendUser }>("/api/auth/otp/verify", {
      method: "POST",
      body: { mobile, challengeId, code },
    });
    return { user: mapUser(payload.user) };
  }

  assertMockAllowed();
  const challenge = readStorageJson<MockChallenge | null>(
    window.sessionStorage,
    MOCK_CHALLENGE_KEY,
    null,
  );
  if (
    !challenge ||
    challenge.challengeId !== challengeId ||
    challenge.mobile !== mobile ||
    challenge.code !== code ||
    challenge.expiresAt < Date.now()
  ) {
    removeStorageValue(window.sessionStorage, MOCK_CHALLENGE_KEY);
    throw new Error("کد ورود معتبر نیست یا منقضی شده است.");
  }

  const profiles = readMockProfiles();
  const now = new Date().toISOString();
  const user: AuthUser = profiles[mobile] || {
    id: `dev-${randomId().slice(0, 20)}`,
    mobile,
    mobileVerified: true,
    marketingConsent: false,
    createdAt: now,
    updatedAt: now,
  };
  profiles[mobile] = user;
  writeMockProfiles(profiles);
  const session = { user };
  writeMockSession(session);
  removeStorageValue(window.sessionStorage, MOCK_CHALLENGE_KEY);
  return session;
};

export const logoutAuth = async (): Promise<void> => {
  const mode = getAuthMode();
  if (mode === "backend") {
    try {
      await apiData<null>("/api/auth/logout", {
        method: "POST",
        suppressAuthExpiryEvent: true,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return;
      throw error;
    }
    return;
  }
  if (mode === "mock") {
    assertMockAllowed();
    writeMockSession(null);
    removeStorageValue(window.sessionStorage, MOCK_CHALLENGE_KEY);
  }
};

export const updateAuthProfile = async (
  fullName: string,
): Promise<AuthUser> => {
  const normalizedName = fullName.trim();
  if (normalizedName.length < 2 || normalizedName.length > 120) {
    throw new Error("نام و نام خانوادگی باید بین ۲ تا ۱۲۰ کاراکتر باشد.");
  }

  const mode = getAuthMode();
  if (mode === "backend") {
    const payload = await apiData<{ user: BackendUser }>("/api/account/profile", {
      method: "PATCH",
      body: { fullName: normalizedName },
    });
    return mapUser(payload.user);
  }
  if (mode === "disabled") throw new Error("حساب کاربری فعال نیست.");

  assertMockAllowed();
  const session = readMockSession();
  if (!session) throw new Error("نشست آزمایشی پیدا نشد.");
  const user = {
    ...session.user,
    fullName: normalizedName,
    updatedAt: new Date().toISOString(),
  };
  const profiles = readMockProfiles();
  profiles[user.mobile] = user;
  writeMockProfiles(profiles);
  writeMockSession({ user });
  return user;
};
