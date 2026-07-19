const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const BACKEND_ENABLED = import.meta.env.VITE_USE_BACKEND === "true";
const CONFIGURED_AUTH_MODE = import.meta.env.VITE_AUTH_MODE || "disabled";

const AUTH_SESSION_KEY = "winimi_auth_session_v2";
const MOCK_OTP_KEY = "winimi_mock_otp_v1";
const MOCK_PROFILE_KEY = "winimi_mock_profiles_v1";
const REQUEST_TIMEOUT_MS = 15_000;
const MOCK_SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export type AuthMode = "backend" | "mock" | "disabled";

export interface AuthUser {
  id: string;
  mobile: string;
  fullName?: string;
  createdAt?: string;
}

export interface AuthSession {
  user: AuthUser;
  authenticatedAt: number;
  expiresAt?: number;
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

interface MockOtpChallenge {
  challengeId: string;
  mobile: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const randomToken = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replaceAll("-", "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
};

export const normalizeMobile = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/\D/g, "")
    .slice(0, 11);

export const isValidIranianMobile = (value: string) => /^09\d{9}$/.test(normalizeMobile(value));

export const getAuthMode = (): AuthMode => {
  if (BACKEND_ENABLED) return "backend";
  if (CONFIGURED_AUTH_MODE === "mock") return "mock";
  return "disabled";
};

const requestJson = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  if (!API_BASE_URL) throw new Error("آدرس API احراز هویت تنظیم نشده است.");

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
    const payload = (await response.json().catch(() => null)) as
      | (T & { message?: string })
      | null;

    if (!response.ok) {
      throw new Error(payload?.message || "درخواست احراز هویت ناموفق بود.");
    }
    if (!payload) throw new Error("پاسخ معتبر از سرور دریافت نشد.");
    return payload;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("زمان پاسخ‌گویی سرویس ورود تمام شد؛ دوباره تلاش کنید.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
};

export const authenticatedRequest = requestJson;

const sanitizeUser = (value: unknown): AuthUser | null => {
  if (!isRecord(value) || typeof value.mobile !== "string") return null;
  const mobile = normalizeMobile(value.mobile);
  if (!isValidIranianMobile(mobile)) return null;

  return {
    id: typeof value.id === "string" ? value.id : `user-${mobile}`,
    mobile,
    fullName: typeof value.fullName === "string" ? value.fullName.trim() : undefined,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : undefined,
  };
};

export const readCachedSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    const user = sanitizeUser(parsed.user);
    if (!user || typeof parsed.authenticatedAt !== "number") return null;
    if (typeof parsed.expiresAt === "number" && Date.now() >= parsed.expiresAt) {
      window.sessionStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }
    return {
      user,
      authenticatedAt: parsed.authenticatedAt,
      expiresAt: typeof parsed.expiresAt === "number" ? parsed.expiresAt : undefined,
    };
  } catch {
    return null;
  }
};

export const cacheSession = (session: AuthSession | null) => {
  if (typeof window === "undefined") return;
  try {
    if (!session) window.sessionStorage.removeItem(AUTH_SESSION_KEY);
    else window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch {
    // The server cookie remains the source of truth in backend mode.
  }
};

const readMockProfiles = (): Record<string, AuthUser> => {
  try {
    const raw = window.localStorage.getItem(MOCK_PROFILE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed)
        .map(([mobile, value]) => [mobile, sanitizeUser(value)] as const)
        .filter((entry): entry is [string, AuthUser] => Boolean(entry[1])),
    );
  } catch {
    return {};
  }
};

const saveMockProfile = (user: AuthUser) => {
  const profiles = readMockProfiles();
  profiles[user.mobile] = user;
  window.localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(profiles));
};

const readMockChallenge = (): MockOtpChallenge | null => {
  try {
    const raw = window.sessionStorage.getItem(MOCK_OTP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MockOtpChallenge;
    if (!parsed || Date.now() >= parsed.expiresAt) {
      window.sessionStorage.removeItem(MOCK_OTP_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const bootstrapAuth = async (): Promise<AuthSession | null> => {
  const mode = getAuthMode();
  if (mode === "disabled") {
    cacheSession(null);
    return null;
  }

  if (mode === "mock") return readCachedSession();

  try {
    const payload = await requestJson<{ user: AuthUser }>("/api/auth/me", {
      method: "GET",
    });
    const user = sanitizeUser(payload.user);
    if (!user) throw new Error("پروفایل دریافت‌شده معتبر نیست.");
    const session = { user, authenticatedAt: Date.now() };
    cacheSession(session);
    return session;
  } catch {
    cacheSession(null);
    return null;
  }
};

export const requestOtp = async (mobileValue: string): Promise<OtpRequestResult> => {
  const mobile = normalizeMobile(mobileValue);
  if (!isValidIranianMobile(mobile)) throw new Error("شماره موبایل معتبر نیست.");
  const mode = getAuthMode();

  if (mode === "backend") {
    return requestJson<OtpRequestResult>("/api/auth/otp/request", {
      method: "POST",
      body: JSON.stringify({ mobile }),
    });
  }

  if (mode === "mock") {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const challenge: MockOtpChallenge = {
      challengeId: `OTP-${randomToken().slice(0, 18)}`,
      mobile,
      code,
      expiresAt: Date.now() + 120_000,
      attempts: 0,
    };
    window.sessionStorage.setItem(MOCK_OTP_KEY, JSON.stringify(challenge));
    return {
      challengeId: challenge.challengeId,
      expiresIn: 120,
      retryAfter: 60,
      devCode: code,
    };
  }

  throw new Error("ورود کاربران هنوز به بک‌اند متصل نشده است.");
};

export const verifyOtp = async ({
  mobile: mobileValue,
  challengeId,
  code,
}: VerifyOtpInput): Promise<AuthSession> => {
  const mobile = normalizeMobile(mobileValue);
  const normalizedCode = normalizeMobile(code).slice(0, 6);
  if (!isValidIranianMobile(mobile)) throw new Error("شماره موبایل معتبر نیست.");
  if (!/^\d{4,6}$/.test(normalizedCode)) throw new Error("کد تأیید معتبر نیست.");
  const mode = getAuthMode();

  if (mode === "backend") {
    const payload = await requestJson<{ user: AuthUser }>("/api/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ mobile, challengeId, code: normalizedCode }),
    });
    const user = sanitizeUser(payload.user);
    if (!user) throw new Error("اطلاعات حساب معتبر نیست.");
    const session = { user, authenticatedAt: Date.now() };
    cacheSession(session);
    return session;
  }

  if (mode === "mock") {
    const challenge = readMockChallenge();
    if (!challenge || challenge.challengeId !== challengeId || challenge.mobile !== mobile) {
      throw new Error("درخواست کد منقضی یا نامعتبر است.");
    }
    if (challenge.attempts >= 5) {
      window.sessionStorage.removeItem(MOCK_OTP_KEY);
      throw new Error("تعداد تلاش مجاز تمام شد؛ کد جدید دریافت کنید.");
    }
    if (challenge.code !== normalizedCode) {
      window.sessionStorage.setItem(
        MOCK_OTP_KEY,
        JSON.stringify({ ...challenge, attempts: challenge.attempts + 1 }),
      );
      throw new Error("کد واردشده صحیح نیست.");
    }

    window.sessionStorage.removeItem(MOCK_OTP_KEY);
    const profiles = readMockProfiles();
    const user = profiles[mobile] ?? {
      id: `mock-${mobile}`,
      mobile,
      createdAt: new Date().toISOString(),
    };
    saveMockProfile(user);
    const session = {
      user,
      authenticatedAt: Date.now(),
      expiresAt: Date.now() + MOCK_SESSION_DURATION_MS,
    };
    cacheSession(session);
    return session;
  }

  throw new Error("ورود کاربران فعال نیست.");
};

export const logoutAuth = async () => {
  if (getAuthMode() === "backend") {
    try {
      await requestJson<{ success: boolean }>("/api/auth/logout", { method: "POST" });
    } finally {
      cacheSession(null);
    }
    return;
  }
  cacheSession(null);
};

export const updateAuthProfile = async (fullNameValue: string): Promise<AuthUser> => {
  const fullName = fullNameValue.trim();
  if (fullName.length < 2 || fullName.length > 100) {
    throw new Error("نام باید بین ۲ تا ۱۰۰ کاراکتر باشد.");
  }
  const session = readCachedSession();
  if (!session) throw new Error("نشست کاربری معتبر نیست.");

  if (getAuthMode() === "backend") {
    const payload = await requestJson<{ user: AuthUser }>("/api/account/profile", {
      method: "PATCH",
      body: JSON.stringify({ fullName }),
    });
    const user = sanitizeUser(payload.user);
    if (!user) throw new Error("پروفایل به‌روزشده معتبر نیست.");
    cacheSession({ ...session, user });
    return user;
  }

  const user = { ...session.user, fullName };
  saveMockProfile(user);
  cacheSession({ ...session, user });
  return user;
};
