import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-soft" role="status">
            <Loader2 className="mx-auto mb-4 animate-spin text-primary" size={44} aria-hidden="true" />
            <p className="font-bold text-foreground">در حال بررسی نشست کاربری…</p>
          </div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/account/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
};
