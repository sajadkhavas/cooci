const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export const formatPersianUtcDate = (value?: string | null) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return undefined;

  return [
    parsed.getUTCFullYear(),
    String(parsed.getUTCMonth() + 1).padStart(2, "0"),
    String(parsed.getUTCDate()).padStart(2, "0"),
  ]
    .join("/")
    .replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
};
