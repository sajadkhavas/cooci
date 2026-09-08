const STORE_ORIGIN = "https://winimibakery.com";
const allowedStatusCodes = new Set([301, 302, 307, 308]);

export interface StorefrontRedirectResolution {
  found: boolean;
  location: string | null;
  statusCode: number | null;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const containsControlCharacter = (value: string) =>
  [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });

const safelyDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
};

export const normalizeStorefrontRedirectLocation = (
  value: unknown,
): string | null => {
  if (typeof value !== "string") return null;
  const location = value.trim();
  if (
    !location ||
    location.length > 2_048 ||
    !location.startsWith("/") ||
    location.startsWith("//") ||
    location.includes("\\") ||
    containsControlCharacter(location)
  ) {
    return null;
  }

  const decoded = safelyDecode(location);
  if (
    decoded === null ||
    decoded.startsWith("//") ||
    decoded.includes("\\") ||
    containsControlCharacter(decoded)
  ) {
    return null;
  }

  try {
    const base = new URL(STORE_ORIGIN);
    const parsed = new URL(location, base);
    if (
      parsed.origin !== base.origin ||
      parsed.username ||
      parsed.password ||
      !parsed.pathname.startsWith("/") ||
      parsed.pathname.startsWith("//")
    ) {
      return null;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
};

export const parseStorefrontRedirectData = (
  value: unknown,
): StorefrontRedirectResolution | null => {
  if (!isRecord(value) || typeof value.found !== "boolean") return null;

  if (!value.found) {
    if (
      value.location !== null &&
      value.location !== undefined
    ) {
      return null;
    }
    if (
      value.statusCode !== null &&
      value.statusCode !== undefined
    ) {
      return null;
    }

    return {
      found: false,
      location: null,
      statusCode: null,
    };
  }

  const location = normalizeStorefrontRedirectLocation(value.location);
  const statusCode = value.statusCode;
  if (
    location === null ||
    typeof statusCode !== "number" ||
    !Number.isInteger(statusCode) ||
    !allowedStatusCodes.has(statusCode)
  ) {
    return null;
  }

  return {
    found: true,
    location,
    statusCode,
  };
};
