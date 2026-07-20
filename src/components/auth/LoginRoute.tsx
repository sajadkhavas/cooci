import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { sanitizeInternalReturnPath } from "@/lib/security/navigation";

interface LoginLocationState {
  from?: unknown;
}

export const LoginRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const state = location.state as LoginLocationState | null;

  if (state?.from !== undefined) {
    const safeDestination = sanitizeInternalReturnPath(state.from);
    if (state.from !== safeDestination) {
      return (
        <Navigate
          to="/account/login"
          replace
          state={{ from: safeDestination }}
        />
      );
    }
  }

  return children;
};
