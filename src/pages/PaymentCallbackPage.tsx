import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, CreditCard, XCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/context/CartContext";
import { API_BASE_URL, apiClient } from "@/lib/api-client";
import { getLocalOrder, type LocalOrder, updateLocalOrderPaymentStatus } from "@/lib/orders";

const useBackendPaymentVerify = Boolean(API_BASE_URL) && import.meta.env.VITE_USE_BACKEND === "true";

const PaymentCallbackPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const authority = params.get("authority") || params.get("Authority") || params.get("token") || "";
  const status = params.get("status") === "failed" ? "failed" : "paid";
  const isPaid = status === "paid";
  const [order, setOrder] = useState<LocalOrder | undefined>(() => getLocalOrder(orderId));
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    if (useBackendPaymentVerify && authority) {
      setIsVerifying(true);
      apiClient.payments
        .verify({ orderId, authority, status })
        .then(() => {
          setOrder(getLocalOrder(orderId));
        })
        .catch((error) => {
          setVerificationError(error instanceof Error ? error.message : "تأیید پرداخت انجام نشد. لطفاً برای پیگیری با پشتیبانی تماس بگیرید.");
        })
        .finally(() => setIsVerifying(false));
      return;
    }

    setOrder(updateLocalOrderPaymentStatus(orderId, status) ?? getLocalOrder(orderId));
  }, [authority, orderId, status]);

  return (
    <>
      <SEO
        title={isPaid ? "پرداخت موفق" : "پرداخت ناموفق"}
        description="نتیجه پرداخت سفارش وینیمی بیکری"
        noIndex
      />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-hover text-center space-y-7">
            <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center ${isPaid ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
              {isPaid ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
            </div>

            <div>
              <h1 className="heading-1 text-foreground mb-4">{isPaid ? "پرداخت موفق بود" : "پرداخت انجام نشد"}</h1>
              <p className="body-large text-muted-foreground leading-8">
                {isPaid
                  ? "سفارش شما ثبت شد و برای آماده‌سازی وارد مرحله بررسی می‌شود."
                  : "پرداخت با موفقیت ثبت نشد. می‌توانید سفارش را دوباره بررسی کنید یا با پشتیبانی تماس بگیرید."}
              </p>
            </div>

            {isVerifying && (
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-primary text-sm font-bold">
                در حال بررسی نتیجه پرداخت...
              </div>
            )}

            {verificationError && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive text-sm font-bold">
                {verificationError}
              </div>
            )}

            {order && (
              <div className="grid md:grid-cols-3 gap-4 text-right">
                <div className="rounded-2xl bg-secondary/60 border border-border p-4">
                  <span className="text-xs text-muted-foreground block mb-1">شماره سفارش</span>
                  <strong className="text-foreground">{order.id}</strong>
                </div>
                <div className="rounded-2xl bg-secondary/60 border border-border p-4">
                  <span className="text-xs text-muted-foreground block mb-1">روش ارسال</span>
                  <strong className="text-foreground">{order.delivery.label}</strong>
                </div>
                <div className="rounded-2xl bg-secondary/60 border border-border p-4">
                  <span className="text-xs text-muted-foreground block mb-1">مبلغ کل</span>
                  <strong className="text-primary">{formatToman(order.total)}</strong>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5 text-right text-primary leading-8">
              <div className="flex items-start gap-3">
                <CreditCard size={22} className="mt-1 flex-shrink-0" />
                <p>
                  نتیجه سفارش در همین صفحه نمایش داده می‌شود. برای پیگیری، شماره سفارش را نگه دارید.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={order ? `/orders/${order.id}` : "/products"} className="btn-primary px-8 py-3 rounded-xl font-bold">
                {order ? "مشاهده سفارش" : "مشاهده محصولات"}
              </Link>
              <Link to="/" className="px-8 py-3 rounded-xl font-bold border border-border hover:bg-secondary transition-colors">
                بازگشت به خانه
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentCallbackPage;
