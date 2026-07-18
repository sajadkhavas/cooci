// TODO: Replace with real SMS API (Kavenegar) when backend is ready.
// SMS API key env: VITE_KAVENEGAR_API_KEY
const otpStore: Map<string, { code: string; expiresAt: number }> = new Map();

export const generateOTP = (mobile: string): string => {
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore.set(mobile, { code, expiresAt: Date.now() + 120000 });
  return code;
};

export const verifyOTP = (mobile: string, code: string): boolean => {
  const entry = otpStore.get(mobile);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(mobile);
    return false;
  }
  if (entry.code !== code) return false;
  otpStore.delete(mobile);
  return true;
};
