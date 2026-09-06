import { useRef, useState, type FormEvent } from "react";
import { Loader2, Phone, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isValidIranianMobile, normalizeMobile } from "@/lib/auth";

export const MobileCompletionGate = () => {
  const { user, completeMobile } = useAuth();
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  if (!user || !user.requiresMobileCompletion) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const normalized = normalizeMobile(mobile);
    setMobile(normalized);
    setError(undefined);

    if (!isValidIranianMobile(normalized)) {
      setError("شماره موبایل را به‌صورت 09xxxxxxxxx وارد کنید.");
      inputRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await completeMobile(normalized);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "ثبت شماره موبایل ناموفق بود.",
      );
      inputRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
      <div className="container-custom max-w-lg">
        <div className="rounded-3xl border border-border bg-card p-6 text-right shadow-card sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck size={25} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">
                تکمیل شماره موبایل
              </h1>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                ورود با گوگل انجام شد. برای سفارش و مدیریت حساب، شماره موبایل ایران خود را ثبت کنید.
              </p>
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
            ثبت شماره به معنی تأیید آن نیست. تا فعال‌شدن OTP واقعی، وضعیت شماره شما تأییدنشده باقی می‌ماند.
          </div>

          {error && (
            <div
              className="mb-5 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-sm leading-7 text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5" noValidate>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">شماره موبایل</span>
              <div className="relative">
                <Phone
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  type="tel"
                  value={mobile}
                  onChange={(event) => {
                    setMobile(normalizeMobile(event.target.value));
                    setError(undefined);
                  }}
                  dir="ltr"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="09xxxxxxxxx"
                  maxLength={11}
                  required
                  className="input-field min-h-12 w-full bg-background px-11 py-3.5 text-left"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-bold disabled:opacity-50"
            >
              {submitting && (
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              )}
              {submitting ? "در حال ثبت…" : "ثبت شماره و ادامه"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
