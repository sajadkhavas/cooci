import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  MessageSquarePlus,
  RefreshCcw,
  ShieldX,
  Star,
  Trash2,
  Truck,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/config/brand";
import { useAuth } from "@/context/AuthContext";
import {
  cancelOwnedOrder,
  loadOwnedOrder,
  submitOrderReview,
} from "@/lib/account";
import { retryOrderPayment } from "@/lib/checkout";
import {
  paymentStatusLabels,
  statusLabels,
  type LocalOrder,
  type PaymentAttemptStatus,
} from "@/lib/orders";

const deliveryLabel = {
  standard: "ارسال استاندارد",
  chilled: "ارسال سرد",
  pickup: "تحویل حضوری",
};

const attemptLabel: Record<PaymentAttemptStatus, string> = {
  initiated: "ایجادشده",
  pending: "در انتظار نتیجه",
  verified: "تأییدشده",
  failed: "ناموفق",
  cancelled: "لغوشده",
  expired: "منقضی‌شده",
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<LocalOrder | null>();
  const [loadError, setLoadError] = useState<string>();
  const [retrying, setRetrying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reviewItemId, setReviewItemId] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const refresh = useCallback(async () => {
    if (!user || !orderId) {
      setOrder(null);
      return;
    }
    setLoadError(undefined);
    try {
      setOrder(await loadOwnedOrder(user, orderId));
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "دریافت سفارش با مشکل روبه‌رو شد.",
      );
      setOrder(null);
    }
  }, [orderId, user]);

  useEffect(() => {
    setOrder(undefined);
    void refresh();
  }, [refresh]);

  const reviewableItems = useMemo(
    () => order?.items.filter((item) => Boolean(item.orderItemId)) ?? [],
    [order?.items],
  );

  useEffect(() => {
    if (!reviewItemId && reviewableItems[0]?.orderItemId) {
      setReviewItemId(reviewableItems[0].orderItemId);
    }
  }, [reviewItemId, reviewableItems]);

  const retryPayment = async () => {
    if (!order) return;
    setRetrying(true);
    const result = await retryOrderPayment(order.id);
    if (result.success && result.paymentUrl) {
      window.location.assign(result.paymentUrl);
      return;
    }
    toast.error(result.error || "شروع پرداخت جدید ناموفق بود.");
    await refresh();
    setRetrying(false);
  };

  const cancelOrder = async () => {
    if (!order?.canCancel) return;
    setCancelling(true);
    try {
      const cancelledOrder = await cancelOwnedOrder(order.id);
      setOrder(cancelledOrder);
      toast.success("سفارش لغو شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "لغو سفارش ناموفق بود.");
    } finally {
      setCancelling(false);
    }
  };

  const submitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!order || !reviewItemId) return;
    if (!reviewTitle.trim() && !reviewBody.trim()) {
      toast.error("عنوان یا متن نظر را وارد کنید.");
      return;
    }
    setSubmittingReview(true);
    try {
      await submitOrderReview({
        orderId: order.id,
        orderItemId: reviewItemId,
        rating,
        title: reviewTitle.trim() || undefined,
        body: reviewBody.trim() || undefined,
      });
      setReviewSubmitted(true);
      toast.success("نظر ثبت شد و پس از بررسی منتشر می‌شود.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ثبت نظر ناموفق بود.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (order === undefined) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-3xl rounded-3xl border border-border bg-card p-12 text-center shadow-soft" role="status">
          <Loader2 className="mx-auto mb-4 animate-spin text-primary" size={46} aria-hidden="true" />
          <p className="font-bold">در حال بررسی سفارش و مالکیت آن…</p>
        </div>
      </section>
    );
  }

  const canRetry = Boolean(order) && order?.status === "awaiting_payment" && order.paymentStatus !== "paid";

  return (
    <>
      <SEO title={`سفارش ${order?.number || orderId || ""}`} noIndex />
      <section className="bg-gradient-to-b from-secondary/20 to-background section-padding">
        <div className="container-custom mx-auto max-w-4xl">
          <Link to="/account" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowRight size={16} aria-hidden="true" /> بازگشت به حساب
          </Link>

          {!order ? (
            <div className="rounded-3xl border border-destructive/25 bg-card p-10 text-center shadow-soft">
              <ShieldX className="mx-auto mb-4 text-destructive" size={52} aria-hidden="true" />
              <h1 className="mb-3 text-2xl font-black">سفارش در دسترس نیست</h1>
              <p className="mx-auto mb-6 max-w-lg leading-8 text-muted-foreground">
                {loadError || "این سفارش وجود ندارد یا متعلق به حساب فعلی نیست."}
              </p>
              <Link to="/account" className="btn-primary rounded-xl px-6 py-3">بازگشت به سفارش‌های من</Link>
            </div>
          ) : (
            <div className="space-y-6 text-right">
              <header className="flex flex-col justify-between gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft sm:flex-row sm:items-start">
                <div>
                  <p className="mb-1 text-xs font-bold text-primary">شماره سفارش</p>
                  <h1 className="text-2xl font-black" dir="ltr">{order.number || order.id}</h1>
                  <p className="mt-2 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString("fa-IR")}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm sm:flex-col">
                  <span className="rounded-full bg-secondary px-3 py-1.5 font-bold">وضعیت: {order.statusLabel || statusLabels[order.status]}</span>
                  <span className="rounded-full bg-secondary px-3 py-1.5 font-bold">پرداخت: {order.paymentStatusLabel || paymentStatusLabels[order.paymentStatus]}</span>
                </div>
              </header>

              {order.lastPaymentError && order.paymentStatus !== "paid" && (
                <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive" role="alert">
                  <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <div><p className="font-bold">آخرین تلاش پرداخت کامل نشد</p><p className="mt-1 text-sm leading-7">{order.lastPaymentError}</p></div>
                </div>
              )}

              {(canRetry || order.canCancel) && (
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950 sm:flex-row sm:items-center">
                  <div><p className="font-bold">عملیات قابل انجام</p><p className="mt-1 text-sm leading-7">پرداخت مجدد روی همین سفارش انجام می‌شود و لغو فقط تا زمانی که سرور اجازه دهد فعال است.</p></div>
                  <div className="flex flex-wrap gap-2">
                    {canRetry && <button type="button" onClick={() => void retryPayment()} disabled={retrying} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:opacity-50"><RefreshCcw size={18} className={retrying ? "animate-spin" : ""} aria-hidden="true" />{retrying ? "در حال اتصال…" : "پرداخت سفارش"}</button>}
                    {order.canCancel && <button type="button" onClick={() => void cancelOrder()} disabled={cancelling} className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-white px-5 py-3 font-bold text-destructive disabled:opacity-50"><Trash2 size={18} aria-hidden="true" />{cancelling ? "در حال لغو…" : "لغو سفارش"}</button>}
                  </div>
                </div>
              )}

              <section className="rounded-3xl border border-border bg-card p-6 shadow-soft" aria-labelledby="order-items-title">
                <h2 id="order-items-title" className="mb-4 text-lg font-bold">اقلام سفارش</h2>
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const price = item.selectedVariant?.priceToman ?? item.priceToman;
                    return <div key={item.orderItemId || `${item.id}-${item.selectedVariant?.id || ""}`} className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0"><div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-3xl" aria-hidden="true">🍪</div><div className="min-w-0 flex-1"><div className="line-clamp-1 font-bold">{item.name}</div>{item.selectedVariant && <div className="text-xs text-primary">{item.selectedVariant.name}</div>}<div className="text-xs text-muted-foreground">{formatToman(price)} × {item.quantity.toLocaleString("fa-IR")}</div></div><div className="shrink-0 font-bold text-primary">{formatToman(price * item.quantity)}</div></div>;
                  })}
                </div>
                <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between"><span>مبلغ محصولات</span><span>{formatToman(order.subtotal)}</span></div>
                  {order.discount > 0 && <div className="flex justify-between text-emerald-700"><span>تخفیف</span><span>- {formatToman(order.discount)}</span></div>}
                  <div className="flex justify-between"><span>بسته‌بندی</span><span>{formatToman(order.packagingFee)}</span></div>
                  <div className="flex justify-between"><span>{deliveryLabel[order.deliveryMethod]}</span><span>{formatToman(order.deliveryFee)}</span></div>
                  <div className="flex justify-between border-t border-border pt-3 text-lg"><span className="font-bold">مبلغ کل</span><span className="font-black text-primary">{formatToman(order.total)}</span></div>
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <h2 className="mb-3 text-lg font-bold">گیرنده و تحویل</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>نام: <span className="text-foreground">{order.customer.fullName}</span></p>
                  <p>موبایل: <span className="text-foreground" dir="ltr">{order.customer.mobile}</span></p>
                  {order.deliveryMethod !== "pickup" && <><p>شهر: <span className="text-foreground">{order.customer.province}، {order.customer.city}</span></p><p>آدرس: <span className="text-foreground">{order.customer.address}</span></p></>}
                  {order.customer.postalCode && <p>کد پستی: <span className="text-foreground" dir="ltr">{order.customer.postalCode}</span></p>}
                  {order.customer.notes && <p>یادداشت: <span className="text-foreground">{order.customer.notes}</span></p>}
                  {order.trackingCode && <p className="flex items-center gap-2 text-foreground"><Truck size={16} aria-hidden="true" /> کد رهگیری: <strong dir="ltr">{order.trackingCode}</strong></p>}
                </div>
              </section>

              {order.timeline && order.timeline.length > 0 && <section className="rounded-3xl border border-border bg-card p-6 shadow-soft"><h2 className="mb-4 text-lg font-bold">روند سفارش</h2><ol className="space-y-3">{order.timeline.map((entry, index) => <li key={`${entry.to}-${entry.createdAt || index}`} className="flex gap-3"><span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" /><div><p className="font-bold">{entry.label}</p>{entry.createdAt && <p className="mt-1 text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleString("fa-IR")}</p>}</div></li>)}</ol></section>}

              {order.paymentAttempts.length > 0 && <section className="rounded-3xl border border-border bg-card p-6 shadow-soft"><h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><CreditCard size={20} className="text-primary" aria-hidden="true" />تاریخچه پرداخت</h2><div className="space-y-3">{[...order.paymentAttempts].reverse().map((attempt) => <div key={attempt.id} className="flex flex-col justify-between gap-3 rounded-xl bg-secondary/60 p-4 sm:flex-row sm:items-center"><div><p className="text-sm font-bold" dir="ltr">{attempt.id}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(attempt.createdAt).toLocaleString("fa-IR")}</p></div><div className="flex items-center gap-2 text-sm font-bold">{attempt.status === "verified" ? <CheckCircle2 size={17} className="text-emerald-700" aria-hidden="true" /> : ["failed", "cancelled", "expired"].includes(attempt.status) ? <XCircle size={17} className="text-destructive" aria-hidden="true" /> : <CreditCard size={17} className="text-amber-700" aria-hidden="true" />}{attempt.statusLabel || attemptLabel[attempt.status]}</div>{attempt.refId && <strong className="text-sm" dir="ltr">{attempt.refId}</strong>}</div>)}</div></section>}

              {order.status === "delivered" && reviewableItems.length > 0 && (
                <section className="rounded-3xl border border-primary/25 bg-card p-6 shadow-soft" aria-labelledby="review-title">
                  <h2 id="review-title" className="mb-2 flex items-center gap-2 text-lg font-bold"><MessageSquarePlus size={20} className="text-primary" aria-hidden="true" />ثبت نظر خرید تأییدشده</h2>
                  <p className="mb-5 text-sm leading-7 text-muted-foreground">نظر پس از بررسی مدیریت منتشر می‌شود و به قلم واقعی این سفارش متصل خواهد بود.</p>
                  {reviewSubmitted ? <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-950" role="status">نظر شما ثبت شد و در انتظار بررسی است.</div> : <form onSubmit={submitReview} className="grid gap-4">
                    <label><span className="mb-1.5 block text-sm font-bold">محصول</span><select value={reviewItemId} onChange={(event) => setReviewItemId(event.target.value)} className="input-field w-full bg-background">{reviewableItems.map((item) => <option key={item.orderItemId} value={item.orderItemId}>{item.name}{item.selectedVariant ? ` - ${item.selectedVariant.name}` : ""}</option>)}</select></label>
                    <label><span className="mb-1.5 block text-sm font-bold">امتیاز</span><div className="flex gap-2" dir="ltr">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} از ۵ ستاره`} aria-pressed={rating === value} className={`flex h-10 w-10 items-center justify-center rounded-full ${value <= rating ? "bg-gold/20 text-gold" : "bg-secondary text-muted-foreground"}`}><Star size={20} fill={value <= rating ? "currentColor" : "none"} aria-hidden="true" /></button>)}</div></label>
                    <label><span className="mb-1.5 block text-sm font-bold">عنوان نظر</span><input value={reviewTitle} onChange={(event) => setReviewTitle(event.target.value)} className="input-field w-full bg-background" maxLength={160} /></label>
                    <label><span className="mb-1.5 block text-sm font-bold">متن نظر</span><textarea value={reviewBody} onChange={(event) => setReviewBody(event.target.value)} className="input-field min-h-28 w-full resize-y bg-background" maxLength={2000} /></label>
                    <button type="submit" disabled={submittingReview} className="btn-primary inline-flex w-fit items-center gap-2 rounded-xl px-6 py-3 disabled:opacity-50">{submittingReview && <Loader2 size={17} className="animate-spin" aria-hidden="true" />}{submittingReview ? "در حال ثبت…" : "ثبت نظر"}</button>
                  </form>}
                </section>
              )}

              {order.refId && <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-sm text-emerald-900">کد پیگیری پرداخت: <strong dir="ltr">{order.refId}</strong></div>}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default OrderDetailPage;
