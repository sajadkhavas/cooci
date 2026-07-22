import { useDeferredValue, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Loader2, LockKeyhole, MapPin, Snowflake, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { CheckoutSteps } from "@/components/cart/CheckoutSteps";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/config/brand";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { loadAccountAddresses } from "@/lib/account";
import type { BackendAddress, BackendDeliveryOptions } from "@/lib/backend-contract";
import {
  createCheckoutSession,
  createIdempotencyKey,
  getPaymentMode,
  loadCheckoutDraft,
  loadDeliveryOptions,
  normalizeEnglishDigits,
  saveCheckoutDraft,
  type CheckoutCustomerInput,
} from "@/lib/checkout";
import type { DeliveryMethod } from "@/lib/orders";

interface ManualRecipient extends CheckoutCustomerInput {}

const emptyRecipient = (fullName: string, mobile: string): ManualRecipient => ({
  fullName,
  mobile,
  province: "",
  city: "",
  address: "",
  postalCode: "",
  notes: "",
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, hasCoolingItems, isReadyForCheckout } = useCart();
  const draft = useMemo(() => loadCheckoutDraft(), []);
  const paymentMode = getPaymentMode();
  const idempotencyKeyRef = useRef(createIdempotencyKey("CHK"));
  const [addressMode, setAddressMode] = useState<"saved" | "manual">(
    draft?.addressId ? "saved" : "manual",
  );
  const [selectedAddressId, setSelectedAddressId] = useState(draft?.addressId || "");
  const [recipient, setRecipient] = useState<ManualRecipient>(() => ({
    ...emptyRecipient(user?.fullName || "", user?.mobile || ""),
    ...draft?.customer,
  }));
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    draft?.deliveryMethod || (hasCoolingItems ? "chilled" : "standard"),
  );
  const [submitting, setSubmitting] = useState(false);

  const addressesQuery = useQuery({
    queryKey: ["account", "addresses", "checkout"],
    queryFn: loadAccountAddresses,
    enabled: paymentMode === "backend",
    staleTime: 30_000,
  });
  const addresses = addressesQuery.data ?? [];
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId);

  useEffect(() => {
    if (addresses.length === 0 || selectedAddressId) return;
    const preferred = addresses.find((address) => address.isDefault) || addresses[0];
    setSelectedAddressId(preferred.id);
    setAddressMode("saved");
  }, [addresses, selectedAddressId]);

  const destination = useMemo(() => {
    if (addressMode === "saved" && selectedAddress) {
      return { province: selectedAddress.province, city: selectedAddress.city };
    }
    return { province: recipient.province, city: recipient.city };
  }, [addressMode, recipient.city, recipient.province, selectedAddress]);
  const deferredProvince = useDeferredValue(destination.province);
  const deferredCity = useDeferredValue(destination.city);

  const deliveryQuery = useQuery({
    queryKey: [
      "delivery-options",
      deferredProvince,
      deferredCity,
      subtotal,
      hasCoolingItems,
    ],
    queryFn: () =>
      loadDeliveryOptions({
        province: deferredProvince,
        city: deferredCity,
        subtotalToman: subtotal,
        requiresCooling: hasCoolingItems,
      }),
    enabled: paymentMode === "backend",
    staleTime: 15_000,
  });

  const developmentOptions: BackendDeliveryOptions = {
    zone: null,
    methods: [
      { method: "standard", label: "ارسال استاندارد", enabled: !hasCoolingItems, feeToman: 0 },
      { method: "chilled", label: "ارسال سرد", enabled: true, feeToman: 0 },
      { method: "pickup", label: "تحویل حضوری", enabled: true, feeToman: 0 },
    ],
  };
  const deliveryOptions = paymentMode === "mock" ? developmentOptions : deliveryQuery.data;
  const methods = deliveryOptions?.methods ?? [];
  const selectedMethod = methods.find((method) => method.method === deliveryMethod);
  const packagingFee = deliveryOptions?.zone?.packagingFeeToman ?? 0;
  const deliveryFee = selectedMethod?.feeToman ?? 0;
  const estimatedTotal = subtotal + packagingFee + deliveryFee;

  useEffect(() => {
    if (methods.length === 0) return;
    if (selectedMethod?.enabled) return;
    const preferred = methods.find(
      (method) => method.enabled && (hasCoolingItems ? method.method === "chilled" : method.method === "standard"),
    );
    const fallback = preferred || methods.find((method) => method.enabled);
    if (fallback) setDeliveryMethod(fallback.method);
  }, [hasCoolingItems, methods, selectedMethod?.enabled]);

  useEffect(() => {
    saveCheckoutDraft({
      addressId: addressMode === "saved" ? selectedAddressId || undefined : undefined,
      customer: recipient,
      deliveryMethod,
    });
  }, [addressMode, deliveryMethod, recipient, selectedAddressId]);

  const updateRecipient = (field: keyof ManualRecipient, value: string) => {
    setRecipient((current) => ({ ...current, [field]: value }));
  };

  const validateRecipient = (): string | null => {
    if (deliveryMethod === "pickup") return null;
    if (addressMode === "saved") {
      return selectedAddress ? null : "یک آدرس ذخیره‌شده معتبر انتخاب کنید.";
    }
    if (recipient.fullName.trim().length < 2) return "نام کامل گیرنده را وارد کنید.";
    if (!/^09\d{9}$/.test(normalizeEnglishDigits(recipient.mobile))) return "شماره موبایل گیرنده معتبر نیست.";
    if (recipient.province.trim().length < 2) return "استان را وارد کنید.";
    if (recipient.city.trim().length < 2) return "شهر را وارد کنید.";
    if (recipient.address.trim().length < 10) return "نشانی کامل باید حداقل ۱۰ کاراکتر باشد.";
    if (recipient.postalCode && !/^\d{10}$/.test(normalizeEnglishDigits(recipient.postalCode))) {
      return "کد پستی باید ۱۰ رقم باشد.";
    }
    return null;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !isReadyForCheckout) {
      toast.error("نشست یا موجودی سبد معتبر نیست.");
      return;
    }
    const recipientError = validateRecipient();
    if (recipientError) {
      toast.error(recipientError);
      return;
    }
    if (!selectedMethod?.enabled) {
      toast.error("روش تحویل انتخاب‌شده از طرف سرور فعال نیست.");
      return;
    }

    setSubmitting(true);
    const normalizedRecipient: CheckoutCustomerInput = {
      fullName:
        addressMode === "saved" && selectedAddress
          ? selectedAddress.recipientName
          : recipient.fullName || user.fullName || "مشتری وینیمی",
      mobile:
        addressMode === "saved" && selectedAddress
          ? selectedAddress.mobile
          : normalizeEnglishDigits(recipient.mobile || user.mobile),
      province:
        deliveryMethod === "pickup"
          ? ""
          : addressMode === "saved" && selectedAddress
            ? selectedAddress.province
            : recipient.province,
      city:
        deliveryMethod === "pickup"
          ? ""
          : addressMode === "saved" && selectedAddress
            ? selectedAddress.city
            : recipient.city,
      address:
        deliveryMethod === "pickup"
          ? ""
          : addressMode === "saved" && selectedAddress
            ? selectedAddress.address
            : recipient.address,
      postalCode:
        deliveryMethod === "pickup"
          ? undefined
          : addressMode === "saved" && selectedAddress
            ? selectedAddress.postalCode || undefined
            : recipient.postalCode
              ? normalizeEnglishDigits(recipient.postalCode)
              : undefined,
      notes: recipient.notes.trim() || undefined,
    };

    const result = await createCheckoutSession({
      addressId:
        deliveryMethod !== "pickup" && addressMode === "saved"
          ? selectedAddressId
          : undefined,
      customer: normalizedRecipient,
      deliveryMethod,
      items,
      idempotencyKey: idempotencyKeyRef.current,
    });

    if (result.success && result.paymentUrl) {
      window.location.assign(result.paymentUrl);
      return;
    }
    if (result.success && result.order) {
      toast.success(
        result.paymentAvailable === false
          ? "سفارش ثبت شد؛ پرداخت هنوز از سمت سرور فعال نیست."
          : "سفارش ثبت شد.",
      );
      navigate(`/account/orders/${encodeURIComponent(result.order.id)}`, { replace: true });
      return;
    }

    toast.error(result.error || "ثبت سفارش ناموفق بود.");
    setSubmitting(false);
  };

  const fieldClass = "input-field min-h-12 w-full bg-background";

  return (
    <>
      <SEO title="تکمیل سفارش و پرداخت" noIndex />
      <section className="bg-gradient-to-b from-secondary/20 to-background section-padding">
        <div className="container-custom">
          <CheckoutSteps current="delivery" />
          <div className="mb-8 text-right">
            <h1 className="text-3xl font-black text-foreground md:text-4xl">تکمیل سفارش</h1>
            <p className="mt-3 leading-8 text-muted-foreground">
              قیمت، موجودی، محدوده ارسال و مبلغ نهایی هنگام ثبت سفارش دوباره توسط سرور محاسبه می‌شوند.
            </p>
          </div>

          {paymentMode === "mock" && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950" role="alert">
              <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              حالت آزمایشی فقط در محیط توسعه فعال است و تراکنش بانکی واقعی انجام نمی‌دهد.
            </div>
          )}
          {paymentMode === "disabled" && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive" role="alert">
              <LockKeyhole size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              ثبت سفارش به اتصال بک‌اند نیاز دارد.
            </div>
          )}

          <form onSubmit={submit} className="grid min-w-0 gap-8 lg:grid-cols-3" aria-busy={submitting}>
            <div className="min-w-0 space-y-6 lg:col-span-2">
              <section className="rounded-3xl border border-border bg-card p-5 shadow-soft md:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <MapPin className="text-primary" size={22} aria-hidden="true" />
                  <h2 className="text-xl font-black">گیرنده و مقصد</h2>
                </div>

                {addressesQuery.isLoading ? (
                  <div className="py-7 text-center" role="status"><Loader2 className="mx-auto mb-2 animate-spin text-primary" aria-hidden="true" />در حال دریافت آدرس‌ها…</div>
                ) : addresses.length > 0 ? (
                  <div className="mb-5 grid gap-3 sm:grid-cols-2">
                    {addresses.map((address: BackendAddress) => (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => {
                          setAddressMode("saved");
                          setSelectedAddressId(address.id);
                        }}
                        aria-pressed={addressMode === "saved" && selectedAddressId === address.id}
                        className={`rounded-2xl border p-4 text-right transition ${addressMode === "saved" && selectedAddressId === address.id ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"}`}
                      >
                        <span className="font-black">{address.title}</span>
                        {address.isDefault && <span className="mr-2 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">پیش‌فرض</span>}
                        <span className="mt-2 block text-sm text-muted-foreground">{address.recipientName} · {address.province}، {address.city}</span>
                        <span className="mt-1 line-clamp-2 block text-xs leading-6 text-muted-foreground">{address.address}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="mb-5 flex flex-wrap gap-2">
                  {addresses.length > 0 && (
                    <button type="button" onClick={() => setAddressMode("saved")} className={`rounded-full px-4 py-2 text-sm font-bold ${addressMode === "saved" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>آدرس ذخیره‌شده</button>
                  )}
                  <button type="button" onClick={() => setAddressMode("manual")} className={`rounded-full px-4 py-2 text-sm font-bold ${addressMode === "manual" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>گیرنده یا آدرس جدید</button>
                  <Link to="/account" className="rounded-full border border-border px-4 py-2 text-sm font-bold text-primary">مدیریت آدرس‌ها</Link>
                </div>

                {addressMode === "manual" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <label><span className="mb-1.5 block text-sm font-bold">نام گیرنده</span><input value={recipient.fullName} onChange={(event) => updateRecipient("fullName", event.target.value)} className={fieldClass} autoComplete="name" /></label>
                    <label><span className="mb-1.5 block text-sm font-bold">موبایل گیرنده</span><input value={recipient.mobile} onChange={(event) => updateRecipient("mobile", event.target.value)} className={`${fieldClass} text-left`} dir="ltr" inputMode="tel" autoComplete="tel" /></label>
                    <label><span className="mb-1.5 block text-sm font-bold">استان</span><input value={recipient.province} onChange={(event) => updateRecipient("province", event.target.value)} className={fieldClass} /></label>
                    <label><span className="mb-1.5 block text-sm font-bold">شهر</span><input value={recipient.city} onChange={(event) => updateRecipient("city", event.target.value)} className={fieldClass} /></label>
                    <label className="md:col-span-2"><span className="mb-1.5 block text-sm font-bold">نشانی کامل</span><textarea value={recipient.address} onChange={(event) => updateRecipient("address", event.target.value)} className="input-field min-h-28 w-full resize-y bg-background" /></label>
                    <label><span className="mb-1.5 block text-sm font-bold">کد پستی</span><input value={recipient.postalCode || ""} onChange={(event) => updateRecipient("postalCode", event.target.value)} className={`${fieldClass} text-left`} dir="ltr" inputMode="numeric" /></label>
                  </div>
                )}

                <label className="mt-4 block"><span className="mb-1.5 block text-sm font-bold">یادداشت سفارش</span><textarea value={recipient.notes || ""} onChange={(event) => updateRecipient("notes", event.target.value)} className="input-field min-h-24 w-full resize-y bg-background" maxLength={1000} /></label>
              </section>

              <section className="rounded-3xl border border-border bg-card p-5 shadow-soft md:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <Truck className="text-primary" size={22} aria-hidden="true" />
                  <h2 className="text-xl font-black">روش تحویل فعال برای این مقصد</h2>
                </div>
                {deliveryQuery.isFetching && paymentMode === "backend" && <p className="mb-4 text-sm text-muted-foreground" role="status">در حال محاسبه روش‌ها و هزینه از سرور…</p>}
                {deliveryQuery.error && <div className="mb-4 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive" role="alert">{deliveryQuery.error instanceof Error ? deliveryQuery.error.message : "دریافت گزینه‌های تحویل ناموفق بود."}</div>}
                <div className="grid gap-3 md:grid-cols-3">
                  {methods.map((method) => {
                    const Icon = method.method === "chilled" ? Snowflake : method.method === "pickup" ? MapPin : Truck;
                    return (
                      <button
                        key={method.method}
                        type="button"
                        disabled={!method.enabled}
                        onClick={() => setDeliveryMethod(method.method)}
                        aria-pressed={deliveryMethod === method.method}
                        className={`rounded-2xl border p-4 text-right transition disabled:cursor-not-allowed disabled:opacity-45 ${deliveryMethod === method.method ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"}`}
                      >
                        <Icon className="mb-3 text-primary" size={22} aria-hidden="true" />
                        <span className="block font-black">{method.label}</span>
                        <span className="mt-2 block text-sm text-muted-foreground">{method.enabled ? formatToman(method.feeToman) : "برای این مقصد غیرفعال"}</span>
                      </button>
                    );
                  })}
                </div>
                {methods.length === 0 && !deliveryQuery.isFetching && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-950">هیچ روش تحویلی از سرور دریافت نشد.</p>}
                {deliveryOptions?.zone && <div className="mt-4 rounded-xl bg-secondary/60 p-4 text-sm leading-7 text-muted-foreground">منطقه: <strong className="text-foreground">{deliveryOptions.zone.name}</strong> · زمان آماده‌سازی تخمینی: {deliveryOptions.zone.preparation.minDays.toLocaleString("fa-IR")} تا {deliveryOptions.zone.preparation.maxDays.toLocaleString("fa-IR")} روز</div>}
              </section>
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-28 md:p-6">
              <CheckCircle2 className="mb-3 text-primary" size={24} aria-hidden="true" />
              <h2 className="mb-5 text-xl font-black">برآورد سرور</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">محصولات</span><strong>{formatToman(subtotal)}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">بسته‌بندی</span><strong>{formatToman(packagingFee)}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">تحویل</span><strong>{formatToman(deliveryFee)}</strong></div>
                <div className="flex justify-between gap-3 border-t border-border pt-4 text-lg"><span className="font-black">جمع تخمینی</span><strong className="text-primary">{formatToman(estimatedTotal)}</strong></div>
              </div>
              <p className="mt-4 text-xs leading-6 text-muted-foreground">عدد قطعی از پاسخ ثبت سفارش می‌آید؛ هیچ مبلغی از مرورگر برای بک‌اند معتبر نیست.</p>
              <button type="submit" disabled={submitting || paymentMode === "disabled" || !selectedMethod?.enabled || deliveryQuery.isFetching} className="btn-primary mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-black disabled:cursor-not-allowed disabled:opacity-50">
                {submitting && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
                {submitting ? "در حال ثبت امن سفارش…" : "ثبت سفارش و ادامه پرداخت"}
              </button>
              <Link to="/cart" className="mt-3 block text-center text-sm font-bold text-muted-foreground hover:text-primary">بازگشت به سبد</Link>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;
