import { type ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { sanitizeInternalReturnPath } from "@/lib/security/navigation";

interface LoginLocationState {
  from?: unknown;
}

export const LoginRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LoginLocationState | null;

  useEffect(() => {
    if (state?.from === undefined) return;

    const safeDestination = sanitizeInternalReturnPath(state.from);
    if (state.from !== safeDestination) {
      navigate("/account/login", {
        replace: true,
        state: { from: safeDestination },
      });
    }
  }, [navigate, state?.from]);

  return children;
};
