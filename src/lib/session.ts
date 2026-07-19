import {
  cacheSession,
  logoutAuth,
  readCachedSession,
  type AuthSession,
} from "@/lib/auth";

export interface WinimiSession {
  mobile: string;
  loginAt: number;
}

export const getSession = (): WinimiSession | null => {
  const session = readCachedSession();
  if (!session) return null;
  return {
    mobile: session.user.mobile,
    loginAt: session.authenticatedAt,
  };
};

export const setSession = (mobile: string) => {
  const session: AuthSession = {
    user: {
      id: `legacy-${mobile}`,
      mobile,
    },
    authenticatedAt: Date.now(),
  };
  cacheSession(session);
};

export const clearSession = () => {
  cacheSession(null);
  void logoutAuth();
};
