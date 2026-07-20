const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export const normalizeDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));

export const normalizeIranianMobile = (value: string) => {
  const digits = normalizeDigits(value).replace(/\D/g, "");
  const normalizedCountryCode = digits
    .replace(/^0098(?=9\d{9}$)/, "0")
    .replace(/^98(?=9\d{9}$)/, "0");

  return normalizedCountryCode.slice(0, 11);
};

export const isValidIranianMobileNumber = (value: string) =>
  /^09\d{9}$/.test(value);

export const normalizeOtpCode = (value: string, maxLength = 6) =>
  normalizeDigits(value).replace(/\D/g, "").slice(0, maxLength);
