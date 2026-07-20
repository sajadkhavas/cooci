import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, RefreshCcw, ShoppingCart, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { CheckoutSteps } from "@/components/cart/CheckoutSteps";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import { clearCheckoutDraft, getPaymentMode, retryOrderPayment, verifyPaymentResult, type PaymentResultState } from "@/lib/checkout";
import type { LocalOrder } from "@/lib/orders";

const PaymentCallbackPage = () => {
  const [params] = useSearchParams();
  const { clearCart } = useCart();
  const [state, setState] = useState<"loading" | PaymentResultState>("loading");
  const [order, setOrder] = useState<LocalOrder>();
  const [error, setError] = useState<string>();
  const [retrying, setRetrying] = useState(false);
  const providedOrderId = params.get("order") ?? "";
  const authority = params.get("Authority") ?? params.get("authority");
  const providerStatus = params.get("Status") ?? params.get("status");
  const attemptId = params.get("attempt");
  const mockToken = params.get("mock_token");
  const resolvedOrderId = order?.id || providedOrderId;

  const verify = useCallback(async () => {
    if (getPaymentMode() === "mock" && !providedOrderId) {
      setState("unknown");
      setError("شماره سفارش آزمایشی وجود ندارد.");
      return;
    }
    setState("loading");
    setError(undefined);
    const result = await verifyPaymentResult({ orderId: providedOrderId, authority, status: providerStatus, attemptId, mockToken });
    setOrder(result.order);
    setError(result.error);
    setState(result.state);
    if (result.state === "success") {
      clearCart();
      clearCheckoutDraft();
    }
  }, [attemptId, authority, clearCart, mockToken, providedOrderId, providerStatus]);

  useEffect(() => { void verify(); }, [verify]);

  const retry = async () => {
    if (!resolvedOrderId) return;
    setRetrying(true);
    const result = await retryOrderPayment(resolvedOrderId);
    if (result.success && result.paymentUrl) { window.location.assign(result.paymentUrl); return; }
    toast.error(result.error || "شروع دوباره پرداخت ناموفق بود.");
    setRetrying(false);
  };

  return (
    <>
      <SEO title="نتیجه پرداخت" noIndex />
      <section className="bg-gradient-to-b from-secondary/20 to-background section-padding">
        <div className="container-custom max-w-2xl">
          <CheckoutSteps current="payment" />
          {state === "loading" && <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-card" role="status"><Loader2 className="mx-auto mb-5 animate-spin text-primary" size={52} aria-hidden="true" /><h1 className="text-xl font-bold">در حال تأیید پرداخت</h1><p className="mt-3 leading-8 text-muted-foreground">پارامتر بازگشت فقط برای استعلام به سرور ارسال می‌شود و به‌تنهایی اثبات پرداخت نیست.</p></div>}
          {state === "success" && <div className="rounded-3xl border border-emerald-300 bg-card p-7 text-center shadow-card md:p-10"><div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 size={44} aria-hidden="true" /></div><h1 className="text-2xl font-black md:text-3xl">پرداخت از سمت سرور تأیید شد</h1><p className="mt-3 leading-8 text-muted-foreground">تنها پس از پاسخ تأییدشده بک‌اند، سبد خرید پاک شد.</p><div className="my-7 space-y-3 rounded-2xl bg-secondary/60 p-5 text-right">{resolvedOrderId && <div className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">شماره سفارش</span><strong dir="ltr">{order?.number || resolvedOrderId}</strong></div>}{order?.refId && <div className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">کد پیگیری پرداخت</span><strong dir="ltr">{order.refId}</strong></div>}{typeof order?.total === "number" && <div className="flex justify-between gap-3 border-t border-border pt-3 text-lg"><span className="font-bold">مبلغ پرداخت‌شده</span><strong className="text-primary">{formatToman(order.total)}</strong></div>}</div><div className="flex flex-col justify-center gap-3 sm:flex-row">{resolvedOrderId && <Link to={`/account/orders/${encodeURIComponent(resolvedOrderId)}`} className="btn-primary rounded-xl px-6 py-3">مشاهده سفارش</Link>}<Link to="/products" className="btn-secondary rounded-xl border border-border px-6 py-3">ادامه خرید</Link></div></div>}
          {(state === "failed" || state === "cancelled") && <div className="rounded-3xl border border-destructive/30 bg-card p-7 text-center shadow-card md:p-10"><div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive"><XCircle size={44} aria-hidden="true" /></div><h1 className="text-2xl font-black">{state === "cancelled" ? "پرداخت لغو شد" : "پرداخت تأیید نشد"}</h1><p className="mt-3 leading-8 text-muted-foreground">{error || "سفارش و سبد حفظ شده‌اند."}</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">{resolvedOrderId && <button type="button" onClick={retry} disabled={retrying} className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 disabled:opacity-50"><RefreshCcw size={18} className={retrying ? "animate-spin" : ""} aria-hidden="true" />{retrying ? "در حال ایجاد پرداخت…" : "تلاش مجدد"}</button>}<Link to="/cart" className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3"><ShoppingCart size={18} aria-hidden="true" />بازگشت به سبد</Link></div></div>}
          {state === "unknown" && <div className="rounded-3xl border border-amber-300 bg-card p-7 text-center shadow-card md:p-10"><div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-800"><AlertCircle size={44} aria-hidden="true" /></div><h1 className="text-2xl font-black">وضعیت پرداخت مشخص نیست</h1><p className="mt-3 leading-8 text-muted-foreground">{error || "هیچ وضعیت پرداختی در مرورگر معتبر فرض نشده است."}</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={() => void verify()} className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3"><RefreshCcw size={18} aria-hidden="true" />بررسی دوباره</button><Link to="/cart" className="btn-secondary rounded-xl border border-border px-6 py-3">بازگشت به سبد</Link></div></div>}
        </div>
      </section>
    </>
  );
};
export default PaymentCallbackPage;
