export interface ApiUrlPolicy {
  development: boolean;
}

const INVALID_API_BASE = "آدرس API وینیمی معتبر نیست.";

export const normalizeApiBaseUrl = (
  rawValue: string,
  policy: ApiUrlPolicy,
): string => {
  const value = rawValue.trim();
  if (!value) return "";

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(INVALID_API_BASE);
  }

  if (
    !["http:", "https:"].includes(parsed.protocol) ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error(INVALID_API_BASE);
  }

  if (!policy.development && parsed.protocol !== "https:") {
    throw new Error("آدرس API در محیط Production باید HTTPS باشد.");
  }

  return parsed.origin;
};

export const resolveApiRequestUrl = (baseUrl: string, path: string): string => {
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    /[\\\u0000-\u001f\u007f]/.test(path)
  ) {
    throw new Error("مسیر درخواست API معتبر نیست.");
  }

  const base = new URL(baseUrl);
  const resolved = new URL(path, base);
  if (resolved.origin !== base.origin) {
    throw new Error("مسیر درخواست API از دامنه مجاز خارج شده است.");
  }

  return resolved.toString();
};
