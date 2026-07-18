const SESSION_KEY = "winimi_session_v1";

export interface WinimiSession {
  mobile: string;
  loginAt: number;
}

export const getSession = (): WinimiSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as WinimiSession;
    if (Date.now() - s.loginAt > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
};

export const setSession = (mobile: string) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ mobile, loginAt: Date.now() }));
};

export const clearSession = () => localStorage.removeItem(SESSION_KEY);
