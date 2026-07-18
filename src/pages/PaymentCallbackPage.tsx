import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { getOrderById, updateOrderStatus } from "@/lib/orders";
import { verifyPayment, isSimulationMode } from "@/lib/zarinpal";
import { formatToman } from "@/config/brand";

type State = "loading" | "success" | "failed";

const PaymentCallbackPage = () => {
  const [params] = useSearchParams();
  const [state, setState] = useState<State>("loading");
  const [refId, setRefId] = useState<string | null>(null);
  const orderId = params.get("order") || "";
  const authority = params.get("Authority") || params.get("authority");
  const status = params.get("Status") || params.get("status");

  useEffect(() => {
    const run = async () => {
      const order = orderId ? getOrderById(orderId) : undefined;

      if (status === "paid") {
        if (order) updateOrderStatus(orderId, { status: "paid", paymentStatus: "paid" });
        setState("success");
        return;
      }
      if (status === "failed" || status === "NOK") {
        if (order) updateOrderStatus(orderId, { paymentStatus: "failed" });
        setState("failed");
        return;
      }

      if (status === "OK" && authority && order) {
        if (isSimulationMode()) {
          updateOrderStatus(orderId, { status: "paid", paymentStatus: "paid" });
          setState("success");
          return;
        }
        const v = await verifyPayment({ authority, amountToman: order.total });
        if (v.success) {
          updateOrderStatus(orderId, {
            status: "paid",
            paymentStatus: "paid",
            refId: v.refId,
          });
          if (v.refId) setRefId(v.refId);
          setState("success");
        } else {
          updateOrderStatus(orderId, { paymentStatus: "failed" });
          setState("failed");
        }
        return;
      }

      setState("failed");
    };
    run();
  }, [orderId, authority, status]);

  return (
    <>
      <SEO title="نتیجه پرداخت" noIndex />
      <section className="section-padding">
        <div className="container-custom max-w-xl mx-auto text-center">
          {state === "loading" && (
            <div className="bg-card border border-border rounded-2xl p-10">
              <Loader2 className="mx-auto mb-4 animate-spin text-primary" size={48} />
              <p>در حال بررسی وضعیت پرداخت…</p>
            </div>
          )}

          {state === "success" && (
            <div className="bg-card border border-border rounded-2xl p-10">
              <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
              <h1 className="text-2xl font-bold mb-2">پرداخت موفق بود</h1>
              <p className="text-muted-foreground mb-2">شماره سفارش: <strong>{orderId}</strong></p>
              {refId && <p className="text-muted-foreground mb-2">کد پیگیری: <strong>{refId}</strong></p>}
              {orderId && (() => {
                const o = getOrderById(orderId);
                return o ? (
                  <p className="text-muted-foreground mb-6">مبلغ پرداخت: <strong>{formatToman(o.total)}</strong></p>
                ) : null;
              })()}
              <div className="flex gap-3 justify-center flex-wrap">
                <Link to="/account" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold">
                  مشاهده جزئیات سفارش
                </Link>
                <Link to="/products" className="border border-border px-6 py-3 rounded-xl font-bold">
                  بازگشت به خرید
                </Link>
              </div>
            </div>
          )}

          {state === "failed" && (
            <div className="bg-card border border-border rounded-2xl p-10">
              <XCircle className="mx-auto mb-4 text-destructive" size={64} />
              <h1 className="text-2xl font-bold mb-2">پرداخت انجام نشد</h1>
              <p className="text-muted-foreground mb-6">
                در صورت کسر وجه، مبلغ ظرف ۷۲ ساعت به حساب شما بازگردانده می‌شود.
              </p>
              <Link to="/checkout" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold">
                تلاش مجدد
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PaymentCallbackPage;
