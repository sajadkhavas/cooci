import {
  ApiError,
  apiData,
  areDevelopmentMocksEnabled,
  getFrontendDataMode,
  type ApiRequestOptions,
} from "@/lib/api";
import type { BackendOtpChallenge, BackendUser } from "@/lib/backend-contract";

export type AuthMode = "backend" | "mock" | "disabled";

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

const readMockProfiles = (): Record<string, AuthUser> => {
  if (typeof window === "undefined") return {};
  try {
    const value = window.localStorage.getItem(MOCK_PROFILES_KEY);
    return value ? (JSON.parse(value) as Record<string, AuthUser>) : {};
  } catch {
    return {};
  }
};

const writeMockProfiles = (profiles: Record<string, AuthUser>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MOCK_PROFILES_KEY, JSON.stringify(profiles));
};

const readMockSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(MOCK_SESSION_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as AuthSession;
    return parsed?.user?.mobile ? parsed : null;
  } catch {
    return null;
  }
};

const writeMockSession = (session: AuthSession | null) => {
  if (typeof window === "undefined") return;
  if (session) {
    window.sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  } else {
    window.sessionStorage.removeItem(MOCK_SESSION_KEY);
  }
};

export const normalizeMobile = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/\D/g, "")
    .replace(/^98(?=9\d{9}$)/, "0")
    .slice(0, 11);

export const isValidIranianMobile = (value: string) => /^09\d{9}$/.test(value);

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
    const payload = await apiData<{ user: BackendUser }>("/api/auth/me");
    return { user: mapUser(payload.user) };
  } catch (error) {
    if (error instanceof ApiError && error.code === "authentication_required") {
      return null;
    }
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
      expiresIn: challenge.expiresIn,
      retryAfter: challenge.retryAfter,
      devCode: challenge.debugCode,
    };
  }

  assertMockAllowed();
  const challenge: MockChallenge = {
    challengeId: `DEV-${randomId().slice(0, 22)}`,
    mobile,
    code: String(Math.floor(100000 + Math.random() * 900000)),
    expiresAt: Date.now() + 2 * 60_000,
  };
  window.sessionStorage.setItem(MOCK_CHALLENGE_KEY, JSON.stringify(challenge));
  return {
    challengeId: challenge.challengeId,
    expiresIn: 120,
    retryAfter: 60,
    devCode: challenge.code,
  };
};

export const verifyOtp = async (input: VerifyOtpInput): Promise<AuthSession> => {
  const mobile = normalizeMobile(input.mobile);
  const code = normalizeMobile(input.code);
  const mode = getAuthMode();

  if (mode === "disabled") throw new Error("ورود کاربران فعال نیست.");
  if (mode === "backend") {
    const payload = await apiData<{ user: BackendUser }>("/api/auth/otp/verify", {
      method: "POST",
      body: {
        mobile,
        challengeId: input.challengeId,
        code,
      },
    });
    return { user: mapUser(payload.user) };
  }

  assertMockAllowed();
  const raw = window.sessionStorage.getItem(MOCK_CHALLENGE_KEY);
  const challenge = raw ? (JSON.parse(raw) as MockChallenge) : null;
  if (
    !challenge ||
    challenge.challengeId !== input.challengeId ||
    challenge.mobile !== mobile ||
    challenge.code !== code ||
    challenge.expiresAt < Date.now()
  ) {
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
  window.sessionStorage.removeItem(MOCK_CHALLENGE_KEY);
  return session;
};

export const logoutAuth = async (): Promise<void> => {
  const mode = getAuthMode();
  if (mode === "backend") {
    await apiData<null>("/api/auth/logout", { method: "POST" });
    return;
  }
  if (mode === "mock") {
    assertMockAllowed();
    writeMockSession(null);
  }
};

export const updateAuthProfile = async (
  fullName: string,
): Promise<AuthUser> => {
  const normalizedName = fullName.trim();
  if (normalizedName.length < 2) {
    throw new Error("نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد.");
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
