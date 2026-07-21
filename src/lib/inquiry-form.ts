const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export const normalizeInquiryMobile = (value: string) => {
  const digits = value
    .trim()
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
    .replace(/[\s()-]/g, "");
  if (digits.startsWith("+98")) return `0${digits.slice(3)}`;
  if (digits.startsWith("0098")) return `0${digits.slice(4)}`;
  if (digits.startsWith("98") && digits.length === 12) return `0${digits.slice(2)}`;
  return digits;
};

export const normalizeInquiryEmail = (value: string) =>
  value.trim().toLowerCase().slice(0, 190);

const sanitizeMetadataValue = (value: unknown, depth: number): unknown => {
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim().slice(0, 500);
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (depth >= 2) return null;
  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitizeMetadataValue(item, depth + 1));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .slice(0, 20)
        .map(([key, item]) => [
          key.trim().slice(0, 80),
          sanitizeMetadataValue(item, depth + 1),
        ])
        .filter(([key]) => Boolean(key)),
    );
  }
  return null;
};

export const sanitizeInquiryMetadata = (
  metadata: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined => {
  if (!metadata) return undefined;
  const sanitized = sanitizeMetadataValue(metadata, 0);
  if (!sanitized || Array.isArray(sanitized) || typeof sanitized !== "object") {
    return undefined;
  }
  const entries = Object.entries(sanitized as Record<string, unknown>);
  return entries.length ? Object.fromEntries(entries) : undefined;
};
