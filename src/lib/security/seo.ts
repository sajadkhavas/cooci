const hasUnsafeCharacters = (value: string) =>
  [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127 || character === "\\";
  });

const parseOrigin = (origin: string) => {
  const parsed = new URL(origin);
  if (parsed.username || parsed.password) throw new Error("Unsafe storefront origin");
  return parsed;
};

export const resolveCanonicalUrl = (value: string, storefrontOrigin: string) => {
  const origin = parseOrigin(storefrontOrigin);
  const candidate = value.trim();
  if (!candidate || hasUnsafeCharacters(candidate) || candidate.startsWith("//")) {
    return `${origin.origin}/`;
  }
  try {
    const parsed = new URL(candidate, origin);
    if (parsed.origin !== origin.origin || parsed.username || parsed.password) {
      return `${origin.origin}/`;
    }
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return `${origin.origin}/`;
  }
};

export const resolvePublicMediaUrl = (
  value: string,
  storefrontOrigin: string,
) => {
  const origin = parseOrigin(storefrontOrigin);
  const candidate = value.trim();
  if (!candidate || hasUnsafeCharacters(candidate) || candidate.startsWith("//")) {
    return `${origin.origin}/`;
  }
  try {
    const parsed = new URL(candidate, origin);
    const isSameOrigin = parsed.origin === origin.origin;
    if (
      parsed.username ||
      parsed.password ||
      (!isSameOrigin && parsed.protocol !== "https:")
    ) {
      return `${origin.origin}/`;
    }
    return parsed.toString();
  } catch {
    return `${origin.origin}/`;
  }
};

export const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value)
    .replaceAll("&", "\\u0026")
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
