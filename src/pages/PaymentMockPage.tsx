import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CreditCard, XCircle } from "lucide-react";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { CheckoutSteps } from "@/components/cart/CheckoutSteps";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/config/brand";
import { isMockCheckoutEnabled } from "@/lib/checkout";
import { getOrderById } from "@/lib/orders";

const PaymentMockPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState<"success" | "cancelled" | null>(null);
  const orderId = params.get("order") ?? "";
  const attemptId = params.get("attempt") ?? "";
  const token = params.get("token") ?? "";
  const order = useMemo(() => getOrderById(orderId), [orderId]);
  if (!isMockCheckoutEnabled()) return <Navigate to="/cart" replace />;
  const finish = (outcome: "success" | "cancelled") => {
    if (!orderId || !attemptId || !token) return;
    setProcessing(outcome);
    const callbackParams = new URLSearchParams({ order: orderId, attempt: attemptId, mock_token: token, status: outcome === "success" ? "OK" : "NOK" });
    navigate(`/payment/callback?${callbackParams.toString()}`, { replace: true });
  };
  return <><SEO title="درگاه آزمایشی پرداخت" noIndex /><section className="bg-gradient-to-b from-secondary/20 to-background section-padding"><div className="container-custom max-w-2xl"><CheckoutSteps current="payment" /><div className="rounded-3xl border border-amber-300 bg-card p-6 text-center shadow-card md:p-10"><div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-800"><CreditCard size={38} aria-hidden="true" /></div><h1 className="text-2xl font-black md:text-3xl">شبیه‌ساز پرداخت توسعه</h1><div className="mx-auto mt-5 flex max-w-xl items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-right text-amber-900" role="alert"><AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" /><p className="text-sm leading-7">این مسیر فقط با پرچم صریح DEV قابل اجراست و هیچ پولی جابه‌جا نمی‌کند.</p></div>{order ? <div className="my-7 space-y-3 rounded-2xl bg-secondary/60 p-5 text-right"><div className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">شماره سفارش</span><strong dir="ltr">{order.id}</strong></div><div className="flex justify-between gap-3 border-t border-border pt-3 text-lg"><span className="font-bold">مبلغ آزمایشی</span><strong className="text-primary">{formatToman(order.total)}</strong></div></div> : <p className="my-7 rounded-xl bg-destructive/10 p-4 text-destructive">سفارش آزمایشی پیدا نشد.</p>}<div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => finish("success")} disabled={!order || Boolean(processing)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 font-bold text-white disabled:opacity-50"><CheckCircle2 size={19} aria-hidden="true" />{processing === "success" ? "در حال انتقال…" : "شبیه‌سازی موفق"}</button><button type="button" onClick={() => finish("cancelled")} disabled={!order || Boolean(processing)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-destructive/30 px-6 py-3.5 font-bold text-destructive disabled:opacity-50"><XCircle size={19} aria-hidden="true" />{processing === "cancelled" ? "در حال انتقال…" : "شبیه‌سازی لغو"}</button></div></div></div></section></>;
};
export default PaymentMockPage;
