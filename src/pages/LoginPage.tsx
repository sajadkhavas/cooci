import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { generateOTP, verifyOTP } from "@/lib/otp";
import { clearSession, getSession, setSession } from "@/lib/session";

const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (getSession()) navigate("/account", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = window.setTimeout(() => setCountdown((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const sendCode = () => {
    if (!/^09\d{9}$/.test(mobile)) {
      toast.error("شماره موبایل معتبر نیست");
      return;
    }
    const generatedCode = generateOTP(mobile);
    toast.success(`کد آزمایشی شما: ${generatedCode}`, { duration: 8000 });
    setStep(2);
    setCountdown(120);
  };

  const verify = () => {
    if (!/^\d{4}$/.test(code)) {
      toast.error("کد ۴ رقمی را وارد کنید");
      return;
    }
    if (verifyOTP(mobile, code)) {
      setSession(mobile);
      toast.success("ورود موفق");
      navigate("/account", { replace: true });
    } else {
      toast.error("کد وارد شده اشتباه یا منقضی شده است");
    }
  };

  return (
    <>
      <SEO title="ورود به حساب کاربری" />
      <section className="section-padding">
        <div className="container-custom mx-auto max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 text-right">
            <h1 className="mb-2 text-2xl font-bold">ورود به حساب</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              با شماره موبایل خود وارد شوید تا سفارش‌هایتان را مشاهده کنید.
            </p>

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="login-mobile" className="mb-1 block text-sm">
                    شماره موبایل
                  </label>
                  <input
                    id="login-mobile"
                    type="tel"
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value.replace(/\D/g, ""))}
                    placeholder="09xxxxxxxxx"
                    dir="ltr"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-left outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={sendCode}
                  className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground"
                >
                  ارسال کد تأیید
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm">
                  کد ۴ رقمی ارسال شد به: <strong dir="ltr">{mobile}</strong>
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:ring-2 focus:ring-primary"
                  placeholder="----"
                  aria-label="کد تأیید چهار رقمی"
                />
                <button
                  type="button"
                  onClick={verify}
                  className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground"
                >
                  تأیید و ورود
                </button>
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setCode("");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    تغییر شماره
                  </button>
                  {countdown > 0 ? (
                    <span className="text-muted-foreground">
                      ارسال مجدد تا {countdown.toLocaleString("fa-IR")} ثانیه
                    </span>
                  ) : (
                    <button type="button" onClick={sendCode} className="font-bold text-primary">
                      ارسال مجدد کد
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
