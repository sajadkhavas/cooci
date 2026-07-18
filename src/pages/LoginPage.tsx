import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { generateOTP, verifyOTP } from "@/lib/otp";
import { getSession, setSession } from "@/lib/session";
import { isSimulationMode } from "@/lib/zarinpal";

const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const isSim = isSimulationMode(); // reuse env presence pattern

  useEffect(() => {
    if (getSession()) navigate("/account", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const sendCode = () => {
    if (!/^09\d{9}$/.test(mobile)) {
      toast.error("شماره موبایل معتبر نیست");
      return;
    }
    const c = generateOTP(mobile);
    // Simulation mode: reveal the code so the user can log in without SMS gateway.
    toast.success(`کد آزمایشی شما: ${c}`, { duration: 8000 });
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
        <div className="container-custom max-w-md mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 text-right">
            <h1 className="text-2xl font-bold mb-2">ورود به حساب</h1>
            <p className="text-muted-foreground text-sm mb-6">
              با شماره موبایل خود وارد شوید تا سفارش‌هایتان را مشاهده کنید.
            </p>

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">شماره موبایل</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="09xxxxxxxxx"
                    dir="ltr"
                    className="w-full border border-border bg-background rounded-xl px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={sendCode}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold"
                >
                  ارسال کد تایید
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
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-border bg-background rounded-xl px-4 py-3 text-center tracking-[0.5em] text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="----"
                />
                <button
                  onClick={verify}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold"
                >
                  تایید و ورود
                </button>
                <div className="flex justify-between items-center text-sm">
                  <button
                    onClick={() => setStep(1)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    تغییر شماره
                  </button>
                  {countdown > 0 ? (
                    <span className="text-muted-foreground">
                      ارسال مجدد تا {countdown} ثانیه
                    </span>
                  ) : (
                    <button onClick={sendCode} className="text-primary font-bold">
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
