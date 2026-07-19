import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  MessageSquareText,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/context/AuthContext";
import { isValidIranianMobile, normalizeMobile } from "@/lib/auth";

interface LoginLocationState {
  from?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAuthenticated,
    isLoading: authLoading,
    mode,
    sendOtp,
    confirmOtp,
  } = useAuth();
  const [step, setStep] = useState<"mobile" | "code">("mobile");
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const destination = useMemo(() => {
    const state = location.state as LoginLocationState | null;
    return state?.from?.startsWith("/") ? state.from : "/account";
  }, [location.state]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate(destination, { replace: true });
  }, [authLoading, destination, isAuthenticated, navigate]);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = window.setTimeout(() => setCountdown((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const requestCode = async () => {
    const normalized = normalizeMobile(mobile);
    setMobile(normalized);
    setError(undefined);

    if (!isValidIranianMobile(normalized)) {
      setError("شماره موبایل را به‌صورت 09xxxxxxxxx وارد کنید.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await sendOtp(normalized);
      setChallengeId(result.challengeId);
      setDevCode(result.devCode);
      setCountdown(result.retryAfter || 60);
      setStep("code");
      setCode("");
      toast.success("کد تأیید ارسال شد");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "ارسال کد تأیید ناموفق بود.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const verifyCode = async () => {
    const normalizedCode = normalizeMobile(code).slice(0, 6);
    setCode(normalizedCode);
    setError(undefined);

    if (!/^\d{4,6}$/.test(normalizedCode)) {
      setError("کد تأیید ۴ تا ۶ رقمی را کامل وارد کنید.");
      return;
    }

    setSubmitting(true);
    try {
      await confirmOtp({
        mobile: normalizeMobile(mobile),
        challengeId,
        code: normalizedCode,
      });
      toast.success("ورود با موفقیت انجام شد");
      navigate(destination, { replace: true });
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "تأیید کد ناموفق بود.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const changeMobile = () => {
    setStep("mobile");
    setCode("");
    setChallengeId("");
    setDevCode(undefined);
    setCountdown(0);
    setError(undefined);
  };

  if (authLoading) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-md text-center" role="status">
          <Loader2 className="mx-auto mb-4 animate-spin text-primary" size={44} aria-hidden="true" />
          <p className="font-bold">در حال بررسی نشست کاربری…</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <SEO title="ورود به حساب کاربری" noIndex />
      <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
        <div className="container-custom mx-auto max-w-lg">
          <div className="rounded-3xl border border-border bg-card p-6 text-right shadow-card md:p-9">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck size={26} aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-foreground">ورود امن به حساب</h1>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  برای مشاهده سفارش‌ها و پرداخت مجدد، شماره موبایل خود را تأیید کنید.
                </p>
              </div>
            </div>

            {mode === "disabled" ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5" role="alert">
                <div className="flex items-start gap-3 text-destructive">
                  <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-bold">ورود کاربران هنوز فعال نیست</p>
                    <p className="mt-2 text-sm leading-7">
                      سرویس OTP باید از بک‌اند Laravel و با Cookie امن فعال شود. کلید سرویس پیامک نباید در فرانت‌اند قرار بگیرد.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {mode === "mock" && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950" role="alert">
                    <AlertTriangle size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <p className="text-sm leading-7">
                      حالت آزمایشی ورود فعال است و پیامک واقعی ارسال نمی‌شود. این حالت فقط برای توسعه است.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mb-5 rounded-xl bg-destructive/10 p-3 text-sm leading-7 text-destructive" role="alert">
                    {error}
                  </div>
                )}

                {step === "mobile" ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void requestCode();
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <label htmlFor="login-mobile" className="mb-2 block text-sm font-bold text-foreground">
                        شماره موبایل
                      </label>
                      <div className="relative">
                        <Phone
                          size={18}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <input
                          id="login-mobile"
                          type="tel"
                          value={mobile}
                          onChange={(event) => setMobile(normalizeMobile(event.target.value))}
                          placeholder="09xxxxxxxxx"
                          dir="ltr"
                          inputMode="numeric"
                          autoComplete="tel"
                          maxLength={11}
                          className="w-full rounded-xl border border-border bg-background px-11 py-3.5 text-left outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-primary-foreground shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <MessageSquareText size={18} aria-hidden="true" />}
                      {submitting ? "در حال ارسال…" : "ارسال کد تأیید"}
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void verifyCode();
                    }}
                    className="space-y-5"
                  >
                    <div className="rounded-xl bg-secondary/70 p-4 text-sm leading-7">
                      کد تأیید برای <strong dir="ltr">{mobile}</strong> ارسال شد.
                    </div>

                    {devCode && (
                      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-center text-amber-950">
                        <p className="text-xs font-bold">کد آزمایشی توسعه</p>
                        <strong className="mt-1 block text-2xl tracking-[0.35em]" dir="ltr">{devCode}</strong>
                      </div>
                    )}

                    <div>
                      <label htmlFor="login-code" className="mb-2 block text-sm font-bold">
                        کد تأیید
                      </label>
                      <div className="relative">
                        <KeyRound
                          size={18}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <input
                          id="login-code"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={code}
                          onChange={(event) => setCode(normalizeMobile(event.target.value).slice(0, 6))}
                          className="w-full rounded-xl border border-border bg-background px-11 py-3.5 text-center text-2xl font-black tracking-[0.35em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="------"
                          autoComplete="one-time-code"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-primary-foreground shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
                      {submitting ? "در حال تأیید…" : "تأیید و ورود"}
                    </button>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <button
                        type="button"
                        onClick={changeMobile}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <ArrowRight size={15} aria-hidden="true" />
                        تغییر شماره
                      </button>
                      {countdown > 0 ? (
                        <span className="text-muted-foreground">
                          ارسال مجدد تا {countdown.toLocaleString("fa-IR")} ثانیه
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => void requestCode()}
                          className="font-bold text-primary disabled:opacity-50"
                        >
                          ارسال مجدد کد
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
