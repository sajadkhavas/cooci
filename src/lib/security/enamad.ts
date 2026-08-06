export interface EnamadBadgeUrls {
  html: string;
  image: string;
  verification: string;
}

const ENAMAD_HOST = "trustseal.enamad.ir";
const MAX_BADGE_CODE_LENGTH = 20_000;
const ANCHOR_ATTRIBUTES = new Set(["href", "referrerpolicy", "target"]);
const IMAGE_ATTRIBUTES = new Set([
  "alt",
  "code",
  "referrerpolicy",
  "src",
  "style",
]);

const isOfficialEnamadUrl = (url: URL) =>
  url.protocol === "https:" &&
  url.hostname === ENAMAD_HOST &&
  !url.username &&
  !url.password;

const parseAttributes = (source: string): Map<string, string> | null => {
  const attributes = new Map<string, string>();
  const attributePattern =
    /([A-Za-z_:][A-Za-z0-9_.:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let cursor = 0;

  for (const match of source.matchAll(attributePattern)) {
    const index = match.index ?? 0;
    if (source.slice(cursor, index).trim()) return null;

    const name = match[1].toLowerCase();
    if (attributes.has(name)) return null;

    attributes.set(name, match[2] ?? match[3] ?? "");
    cursor = index + match[0].length;
  }

  if (source.slice(cursor).trim()) return null;
  return attributes;
};

const hasOnlyAllowedAttributes = (
  attributes: Map<string, string>,
  allowed: Set<string>,
) => [...attributes.keys()].every((name) => allowed.has(name));

const hasExactQuery = (url: URL, id: string, code: string) => {
  const entries = [...url.searchParams.entries()];
  if (entries.length !== 2) return false;

  return (
    url.searchParams.get("id") === id &&
    url.searchParams.get("Code") === code &&
    entries.every(([key]) => key === "id" || key === "Code")
  );
};

export const extractOfficialEnamadBadge = (
  code: string | null,
): EnamadBadgeUrls | null => {
  if (!code || code.length > MAX_BADGE_CODE_LENGTH) return null;

  const match = code.match(
    /^\s*<a\b([^>]*)>\s*<img\b([^>]*?)\/?\s*>\s*<\/a>\s*$/i,
  );
  if (!match) return null;

  const anchorAttributes = parseAttributes(match[1]);
  const imageAttributes = parseAttributes(match[2]);
  if (!anchorAttributes || !imageAttributes) return null;
  if (!hasOnlyAllowedAttributes(anchorAttributes, ANCHOR_ATTRIBUTES)) return null;
  if (!hasOnlyAllowedAttributes(imageAttributes, IMAGE_ATTRIBUTES)) return null;

  if (anchorAttributes.get("referrerpolicy")?.toLowerCase() !== "origin") {
    return null;
  }
  if (anchorAttributes.get("target") !== "_blank") return null;
  if (imageAttributes.get("referrerpolicy")?.toLowerCase() !== "origin") {
    return null;
  }

  const style = imageAttributes.get("style")?.replaceAll(/\s/g, "").toLowerCase();
  if (style !== "cursor:pointer") return null;

  const verificationValue = anchorAttributes.get("href");
  const imageValue = imageAttributes.get("src");
  const badgeCode = imageAttributes.get("code");
  if (!verificationValue || !imageValue || !badgeCode) return null;
  if (!/^[A-Za-z0-9]+$/.test(badgeCode)) return null;

  try {
    const verification = new URL(verificationValue);
    const image = new URL(imageValue);
    if (!isOfficialEnamadUrl(verification) || !isOfficialEnamadUrl(image)) {
      return null;
    }
    if (verification.pathname !== "/" || image.pathname !== "/logo.aspx") {
      return null;
    }

    const id = verification.searchParams.get("id");
    if (!id || !/^\d+$/.test(id)) return null;
    if (!hasExactQuery(verification, id, badgeCode)) return null;
    if (!hasExactQuery(image, id, badgeCode)) return null;

    return {
      html: code,
      image: image.toString(),
      verification: verification.toString(),
    };
  } catch {
    return null;
  }
};
