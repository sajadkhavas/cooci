import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Link2, Loader2, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const describeLinkError = (code: string | null) => {
  switch (code) {
    case "access_denied":
      return "اتصال حساب گوگل لغو شد.";
    case "invalid_state":
    case "link_session_invalid":
      return "نشست اتصال گوگل معتبر نبود. دوباره تلاش کنید.";
    case "identity_taken":
      return "این حساب گوگل قبلاً به حساب دیگری در وینیمی متصل شده است.";
    case "provider_already_linked":
      return "یک حساب گوگل دیگر قبلاً به این حساب متصل شده است.";
    case "unverified_identity":
      return "حساب گوگل باید ایمیل تأییدشده معتبر داشته باشد.";
    default:
      return "اتصال حساب گوگل کامل نشد.";
  }
};

export const GoogleAccountSecurityPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, mode, capabilities, startGoogleLink } = useAuth();
  const [linking, setLinking] = useState(false);
  const handledResult = useRef(false);

  useEffect(() => {
    if (handledResult.current) return;
    const params = new URLSearchParams(location.search);
    const result = params.get("google");
    if (!result) return;

    handledResult.current = true;
    if (result === "linked") {
      toast.success("حساب Google با موفقیت متصل شد");
    } else if (result === "error") {
      toast.error(describeLinkError(params.get("code")));
    }
    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.search, navigate]);

  if (mode !== "backend" || !user) return null;

  const beginLink = () => {
    if (linking) return;
    setLinking(true);
    try {
      startGoogleLink();
    } catch (error) {
      setLinking(false);
      toast.error(
        error instanceof Error ? error.message : "شروع اتصال گوگل ناموفق بود.",
      );
    }
  };

  return (
    <section
      className="mb-8 rounded-3xl border border-border bg-card p-6 shadow-soft"
      aria-labelledby="account-security-title"
    >
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3 text-right">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id="account-security-title" className="font-black text-foreground">
              امنیت و روش ورود
            </h2>
            {user.googleLinked ? (
              <p className="mt-1 flex items-center gap-2 text-sm leading-7 text-emerald-700">
                <CheckCircle2 size={16} aria-hidden="true" />
                حساب Google به‌صورت امن متصل است.
              </p>
            ) : (
              <p className="mt-1 text-sm leading-7 text-muted-foreground">
                اتصال فقط بعد از ورود به همین حساب انجام می‌شود؛ تطبیق خودکار ایمیل برای اتصال استفاده نمی‌شود.
              </p>
            )}
          </div>
        </div>

        {!user.googleLinked && capabilities.googleEnabled && (
          <button
            type="button"
            onClick={beginLink}
            disabled={linking}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold transition hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {linking ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Link2 size={16} aria-hidden="true" />
            )}
            {linking ? "در حال انتقال…" : "اتصال حساب Google"}
          </button>
        )}
      </div>
    </section>
  );
};
