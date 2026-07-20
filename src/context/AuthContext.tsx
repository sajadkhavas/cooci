import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  bootstrapAuth,
  getAuthMode,
  logoutAuth,
  requestOtp,
  updateAuthProfile,
  verifyOtp,
  type AuthMode,
  type AuthUser,
  type OtpRequestResult,
  type VerifyOtpInput,
} from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  mode: AuthMode;
  sendOtp: (mobile: string) => Promise<OtpRequestResult>;
  confirmOtp: (input: VerifyOtpInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updateProfile: (fullName: string) => Promise<AuthUser>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mode = getAuthMode();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await bootstrapAuth();
      setUser(session?.user ?? null);
    } catch (refreshError) {
      setUser(null);
      setError(
        refreshError instanceof Error
          ? refreshError
          : new Error("بررسی نشست کاربری ناموفق بود."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const sendOtp = useCallback((mobile: string) => requestOtp(mobile), []);

  const confirmOtp = useCallback(async (input: VerifyOtpInput) => {
    const session = await verifyOtp(input);
    setUser(session.user);
    setError(null);
    return session.user;
  }, []);

  const logout = useCallback(async () => {
    await logoutAuth();
    setUser(null);
    setError(null);
  }, []);

  const updateProfile = useCallback(async (fullName: string) => {
    const updatedUser = await updateAuthProfile(fullName);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      mode,
      sendOtp,
      confirmOtp,
      logout,
      updateProfile,
      refresh,
    }),
    [
      confirmOtp,
      error,
      isLoading,
      logout,
      mode,
      refresh,
      sendOtp,
      updateProfile,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
