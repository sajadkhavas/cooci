export interface EnamadBadgeUrls {
  image: string;
  verification: string;
}

const ENAMAD_HOST = "trustseal.enamad.ir";
const MAX_BADGE_CODE_LENGTH = 20_000;

const isOfficialEnamadUrl = (url: URL) =>
  url.protocol === "https:" &&
  url.hostname === ENAMAD_HOST &&
  !url.username &&
  !url.password;

export const extractOfficialEnamadBadge = (
  code: string | null,
): EnamadBadgeUrls | null => {
  if (!code || code.length > MAX_BADGE_CODE_LENGTH) return null;
  const matches = code.match(/https:\/\/trustseal\.enamad\.ir\/[^"'\s<>]+/g) ?? [];
  const officialUrls = matches
    .map((value) => value.replaceAll("&amp;", "&"))
    .map((value) => {
      try {
        const parsed = new URL(value);
        return isOfficialEnamadUrl(parsed) ? parsed : null;
      } catch {
        return null;
      }
    })
    .filter((value): value is URL => Boolean(value));

  const image = officialUrls.find(
    (value) => value.pathname.toLowerCase().endsWith("/logo.aspx"),
  );
  const verification = officialUrls.find(
    (value) => !value.pathname.toLowerCase().endsWith("/logo.aspx"),
  );

  if (!image || !verification) return null;
  return {
    image: image.toString(),
    verification: verification.toString(),
  };
};
