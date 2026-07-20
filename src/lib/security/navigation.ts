const INTERNAL_ORIGIN = "https://winimi.internal";
const DEFAULT_RETURN_PATH = "/account";
const MAX_RETURN_PATH_LENGTH = 2_048;

const containsUnsafePathCharacters = (value: string) =>
  /[\\\u0000-\u001f\u007f]/.test(value);

export const sanitizeInternalReturnPath = (
  value: unknown,
  fallback = DEFAULT_RETURN_PATH,
): string => {
  if (typeof value !== "string") return fallback;

  const candidate = value.trim();
  if (
    candidate.length === 0 ||
    candidate.length > MAX_RETURN_PATH_LENGTH ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    containsUnsafePathCharacters(candidate)
  ) {
    return fallback;
  }

  try {
    const parsed = new URL(candidate, INTERNAL_ORIGIN);
    if (parsed.origin !== INTERNAL_ORIGIN) return fallback;
    if (parsed.pathname === "/account/login") return fallback;

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
};
