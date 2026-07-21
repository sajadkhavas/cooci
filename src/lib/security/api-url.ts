export interface ApiUrlPolicy {
  development: boolean;
  allowInsecureLoopback?: boolean;
}

const INVALID_API_BASE = "آدرس API وینیمی معتبر نیست.";
const LOOPBACK_HOSTNAMES = new Set(["127.0.0.1", "localhost", "[::1]"]);

const containsUnsafePathCharacters = (value: string) =>
  [...value].some((character) => {
    const code = character.charCodeAt(0);
    return character === "\\" || code <= 31 || code === 127;
  });

const isLoopbackHostname = (hostname: string) =>
  LOOPBACK_HOSTNAMES.has(hostname.toLowerCase());

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

  const insecureLoopbackAllowed =
    policy.allowInsecureLoopback === true &&
    parsed.protocol === "http:" &&
    isLoopbackHostname(parsed.hostname);

  if (
    !policy.development &&
    parsed.protocol !== "https:" &&
    !insecureLoopbackAllowed
  ) {
    throw new Error("آدرس API در محیط Production باید HTTPS باشد.");
  }

  return parsed.origin;
};

export const resolveApiRequestUrl = (baseUrl: string, path: string): string => {
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    containsUnsafePathCharacters(path)
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
