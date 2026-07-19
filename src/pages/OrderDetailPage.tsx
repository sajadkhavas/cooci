import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  RefreshCcw,
  ShieldX,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/config/brand";
import { useAuth } from "@/context/AuthContext";
import { loadOwnedOrder } from "@/lib/account";
import { retryOrderPayment } from "@/lib/checkout";
import {
  paymentStatusLabels,
  statusLabels,
  type LocalOrder,
  type PaymentAttemptStatus,
} from "@/lib/orders";

const deliveryLabel = {
  standard: "ارسال پستی سراسری",
  chilled: "ارسال یخچالی تهران/کرج",
  pickup: "تحویل حضوری",
};

const attemptLabel: Record<PaymentAttemptStatus, string> = {
  created: "ایجاد شده",
  redirected: "انتقال به درگاه",
  verified: "تأیید شده",
  failed: "ناموفق",
  cancelled: "لغوشده",
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<LocalOrder | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!user || !orderId) {
      setOrder(null);
      return;
    }
    let cancelled = false;

    const load = async () => {
      setOrder(undefined);
      setLoadError(undefined);
      try {
        const result = await loadOwnedOrder(user, orderId);
        if (!cancelled) setOrder(result);
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "دریافت سفارش با مشکل روبه‌رو شد.",
          );
          setOrder(null);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [orderId, user]);

  const retryPayment = async () => {
    if (!order || !user) return;
    setRetrying(true);
    const result = await retryOrderPayment(order.id);
    if (result.success && result.paymentUrl) {
      window.location.assign(result.paymentUrl);
      return;
    }
    toast.error(result.error || "شروع پرداخت جدید ناموفق بود.");
    const refreshed = await loadOwnedOrder(user, order.id);
    setOrder(refreshed ?? order);
    setRetrying(false);
  };

  if (order === undefined) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-soft" role="status">
            <Loader2 className="mx-auto mb-4 animate-spin text-primary" size={46} aria-hidden="true" />
            <p className="font-bold">در حال بررسی سفارش و مالکیت آن…</p>
          </div>
        </div>
      </section>
    );
  }

  const canRetry =
    Boolean(order) &&
    order?.status === "awaiting_payment" &&
    order.paymentStatus !== "paid";

  return (
    <>
      <SEO title={`سفارش ${orderId ?? ""}`} noIndex />
      <section className="section-padding bg-gradient-to-b from-secondary/20 to-background">
        <div className="container-custom mx-auto max-w-4xl">
          <Link
            to="/account"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowRight size={16} aria-hidden="true" />
            بازگشت به حساب
          </Link>

          {!order ? (
            <div className="rounded-3xl border border-destructive/25 bg-card p-10 text-center shadow-soft">
              <ShieldX className="mx-auto mb-4 text-destructive" size={52} aria-hidden="true" />
              <h1 className="mb-3 text-2xl font-black text-foreground">
                سفارش در دسترس نیست
              </h1>
              <p className="mx-auto mb-6 max-w-lg leading-8 text-muted-foreground">
                {loadError || "این سفارش وجود ندارد یا متعلق به حساب فعلی نیست."}
              </p>
              <Link to="/account" className="btn-primary rounded-xl px-6 py-3">
                بازگشت به سفارش‌های من
              </Link>
            </div>
          ) : (
            <div className="space-y-6 text-right">
              <header className="flex flex-col justify-between gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft sm:flex-row sm:items-start">
                <div>
                  <p className="mb-1 text-xs font-bold text-primary">شماره سفارش</p>
                  <h1 className="text-2xl font-black" dir="ltr">{order.id}</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("fa-IR")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm sm:flex-col">
                  <span className="rounded-full bg-secondary px-3 py-1.5 font-bold">
                    وضعیت: {statusLabels[order.status]}
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1.5 font-bold">
                    پرداخت: {paymentStatusLabels[order.paymentStatus]}
                  </span>
                </div>
              </header>

              {order.lastPaymentError && order.paymentStatus !== "paid" && (
                <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive" role="alert">
                  <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-bold">آخرین تلاش پرداخت کامل نشد</p>
                    <p className="mt-1 text-sm leading-7">{order.lastPaymentError}</p>
                  </div>
                </div>
              )}

              {canRetry && (
                <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-bold">این سفارش هنوز پرداخت نشده است</p>
                    <p className="mt-1 text-sm leading-7">
                      یک تلاش پرداخت جدید برای همین سفارش ایجاد می‌شود و سفارش تکراری ساخته نخواهد شد.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void retryPayment()}
                    disabled={retrying}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:opacity-50"
                  >
                    <RefreshCcw size={18} className={retrying ? "animate-spin" : ""} aria-hidden="true" />
                    {retrying ? "در حال اتصال…" : "پرداخت سفارش"}
                  </button>
                </div>
              )}

              <section className="rounded-3xl border border-border bg-card p-6 shadow-soft" aria-labelledby="order-items-title">
                <h2 id="order-items-title" className="mb-4 text-lg font-bold">اقلام سفارش</h2>
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const price = item.selectedVariant?.priceToman ?? item.priceToman;
                    return (
                      <div
                        key={`${item.id}-${item.selectedVariant?.id ?? ""}`}
                        className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 rounded-xl object-cover"
                            loading="lazy"
                            width={128}
                            height={128}
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-3xl" aria-hidden="true">🍪</div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="line-clamp-1 font-bold">{item.name}</div>
                          {item.selectedVariant && (
                            <div className="text-xs text-primary">{item.selectedVariant.name}</div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {formatToman(price)} × {item.quantity.toLocaleString("fa-IR")}
                          </div>
                        </div>
                        <div className="shrink-0 font-bold text-primary">{formatToman(price * item.quantity)}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between"><span>مبلغ محصولات</span><span>{formatToman(order.subtotal)}</span></div>
                  <div className="flex justify-between"><span>بسته‌بندی</span><span>{formatToman(order.packagingFee)}</span></div>
                  <div className="flex justify-between"><span>{deliveryLabel[order.deliveryMethod]}</span><span>{formatToman(order.deliveryFee)}</span></div>
                  <div className="flex justify-between border-t border-border pt-3 text-lg">
                    <span className="font-bold">مبلغ کل</span>
                    <span className="font-black text-primary">{formatToman(order.total)}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-card p-6 shadow-soft" aria-labelledby="receiver-title">
                <h2 id="receiver-title" className="mb-3 text-lg font-bold">مشخصات گیرنده</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>نام: <span className="text-foreground">{order.customer.fullName}</span></p>
                  <p>موبایل: <span className="text-foreground" dir="ltr">{order.customer.mobile}</span></p>
                  <p>شهر: <span className="text-foreground">{order.customer.province}، {order.customer.city}</span></p>
                  <p>آدرس: <span className="text-foreground">{order.customer.address}</span></p>
                  {order.customer.postalCode && <p>کد پستی: <span className="text-foreground" dir="ltr">{order.customer.postalCode}</span></p>}
                  {order.customer.notes && <p>یادداشت: <span className="text-foreground">{order.customer.notes}</span></p>}
                </div>
              </section>

              {order.paymentAttempts.length > 0 && (
                <section className="rounded-3xl border border-border bg-card p-6 shadow-soft" aria-labelledby="attempts-title">
                  <h2 id="attempts-title" className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <CreditCard size={20} className="text-primary" aria-hidden="true" />
                    تاریخچه تلاش‌های پرداخت
                  </h2>
                  <div className="space-y-3">
                    {[...order.paymentAttempts].reverse().map((attempt) => (
                      <div key={attempt.id} className="flex flex-col justify-between gap-3 rounded-xl bg-secondary/60 p-4 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-sm font-bold" dir="ltr">{attempt.id}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(attempt.createdAt).toLocaleString("fa-IR")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold">
                          {attempt.status === "verified" ? (
                            <CheckCircle2 size={17} className="text-emerald-700" aria-hidden="true" />
                          ) : attempt.status === "failed" || attempt.status === "cancelled" ? (
                            <XCircle size={17} className="text-destructive" aria-hidden="true" />
                          ) : (
                            <CreditCard size={17} className="text-amber-700" aria-hidden="true" />
                          )}
                          {attemptLabel[attempt.status]}
                        </div>
                        {attempt.refId && <strong className="text-sm" dir="ltr">{attempt.refId}</strong>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {order.refId && (
                <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-sm text-emerald-900">
                  کد پیگیری پرداخت: <strong dir="ltr">{order.refId}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default OrderDetailPage;
