import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  Snowflake,
  Truck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { CheckoutSteps } from "@/components/cart/CheckoutSteps";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/config/brand";
import { useCart } from "@/context/CartContext";
import {
  clearCheckoutDraft,
  createCheckoutSession,
  createIdempotencyKey,
  getDeliveryFee,
  getPaymentMode,
  isChilledDeliveryCity,
  loadCheckoutDraft,
  normalizeEnglishDigits,
  saveCheckoutDraft,
  validateDeliveryMethod,
} from "@/lib/checkout";
import type { DeliveryMethod } from "@/lib/orders";

const requiredForDelivery = (value: string | undefined) => value?.trim() ?? "";

const schema = z
  .object({
    fullName: z.string().trim().min(2, "نام کامل الزامی است").max(100),
    mobile: z.preprocess(
      (value) =>
        typeof value === "string" ? normalizeEnglishDigits(value.trim()) : value,
      z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (09xxxxxxxxx)"),
    ),
    province: z.string().trim().max(50).optional().default(""),
    city: z.string().trim().max(50).optional().default(""),
    address: z.string().trim().max(500).optional().default(""),
    postalCode: z.preprocess(
      (value) =>
        typeof value === "string" ? normalizeEnglishDigits(value.trim()) : value,
      z
        .string()
        .regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد")
        .optional()
        .or(z.literal("")),
    ),
    notes: z.string().trim().max(500, "یادداشت حداکثر ۵۰۰ کاراکتر است").optional(),
    deliveryMethod: z.enum(["standard", "chilled", "pickup"]),
  })
  .superRefine((data, context) => {
    if (data.deliveryMethod === "pickup") return;

    if (requiredForDelivery(data.province).length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["province"],
        message: "استان الزامی است",
      });
    }
    if (requiredForDelivery(data.city).length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["city"],
        message: "شهر الزامی است",
      });
    }
    if (requiredForDelivery(data.address).length < 10) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "آدرس حداقل ۱۰ کاراکتر باشد",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const CheckoutPage = () => {
  const {
    items,
    subtotal,
    packagingFee,
    hasCoolingItems,
    isReadyForCheckout,
  } = useCart();
  const draft = useMemo(() => loadCheckoutDraft(), []);
  const initialDelivery: DeliveryMethod =
    draft?.deliveryMethod ?? (hasCoolingItems ? "chilled" : "standard");
  const paymentMode = getPaymentMode();
  const idempotencyKeyRef = useRef(createIdempotencyKey());
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: draft?.customer.fullName ?? "",
      mobile: draft?.customer.mobile ?? "",
      province: draft?.customer.province ?? "",
      city: draft?.customer.city ?? "",
      address: draft?.customer.address ?? "",
      postalCode: draft?.customer.postalCode ?? "",
      notes: draft?.customer.notes ?? "",
      deliveryMethod: initialDelivery,
    },
  });

  const city = watch("city") ?? "";
  const deliveryMethod = watch("deliveryMethod");
  const canUseChilled = isChilledDeliveryCity(city);
  const canUseStandard = !hasCoolingItems;
  const deliveryFee = getDeliveryFee(deliveryMethod);
  const total = subtotal + packagingFee + deliveryFee;
  const deliveryError = useMemo(
    () =>
      validateDeliveryMethod({
        method: deliveryMethod,
        city,
        hasCoolingItems,
      }),
    [city, deliveryMethod, hasCoolingItems],
  );

  useEffect(() => {
    const subscription = watch((values) => {
      saveCheckoutDraft({
        customer: {
          fullName: values.fullName,
          mobile: values.mobile,
          province: values.province,
          city: values.city,
          address: values.address,
          postalCode: values.postalCode,
          notes: values.notes,
        },
        deliveryMethod: values.deliveryMethod ?? initialDelivery,
      });
    });
    return () => subscription.unsubscribe();
  }, [initialDelivery, watch]);

  useEffect(() => {
    if (hasCoolingItems && deliveryMethod === "standard") {
      setValue("deliveryMethod", "chilled", { shouldValidate: true });
    }
  }, [deliveryMethod, hasCoolingItems, setValue]);

  const selectDelivery = (method: DeliveryMethod) => {
    setValue("deliveryMethod", method, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: FormValues) => {
    if (!isReadyForCheckout) {
      toast.error("قیمت یا موجودی سبد معتبر نیست؛ ابتدا به سبد خرید برگردید.");
      return;
    }

    const methodError = validateDeliveryMethod({
      method: data.deliveryMethod,
      city: data.city ?? "",
      hasCoolingItems,
    });
    if (methodError) {
      toast.error(methodError);
      return;
    }

    if (paymentMode === "disabled") {
      toast.error("پرداخت آنلاین هنوز به بک‌اند متصل نشده است.");
      return;
    }

    setSubmitting(true);
    const normalizedMobile = normalizeEnglishDigits(data.mobile);
    const normalizedPostalCode = data.postalCode
      ? normalizeEnglishDigits(data.postalCode)
      : undefined;
    const finalDeliveryFee = getDeliveryFee(data.deliveryMethod);
    const result = await createCheckoutSession({
      customer: {
        fullName: data.fullName.trim(),
        mobile: normalizedMobile,
        province:
          data.deliveryMethod === "pickup" ? "تحویل حضوری" : data.province?.trim() ?? "",
        city:
          data.deliveryMethod === "pickup" ? "تحویل حضوری" : data.city?.trim() ?? "",
        address:
          data.deliveryMethod === "pickup"
            ? "تحویل حضوری با هماهنگی"
            : data.address?.trim() ?? "",
        postalCode: normalizedPostalCode || undefined,
        notes: data.notes?.trim() || undefined,
      },
      deliveryMethod: data.deliveryMethod,
      items,
      subtotal,
      packagingFee,
      deliveryFee: finalDeliveryFee,
      total: subtotal + packagingFee + finalDeliveryFee,
      idempotencyKey: idempotencyKeyRef.current,
    });

    if (result.success && result.paymentUrl) {
      window.location.assign(result.paymentUrl);
      return;
    }

    toast.error(result.error || "ساخت سفارش یا انتقال به درگاه ناموفق بود.");
    setSubmitting(false);
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-right outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted";
  const fieldError = (message?: string) =>
    message ? <p className="mt-1 text-xs text-destructive">{message}</p> : null;

  return (
    <>
      <SEO title="تکمیل سفارش و پرداخت" noIndex />
      <section className="section-padding bg-gradient-to-b from-secondary/20 to-background">
        <div className="container-custom">
          <CheckoutSteps current="delivery" />

          <div className="mb-8 text-right">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              تکمیل اطلاعات سفارش
            </h1>
            <p className="mt-3 text-muted-foreground">
              اطلاعات را بررسی کنید؛ سبد خرید تا زمان تأیید نهایی پرداخت پاک نمی‌شود.
            </p>
          </div>

          {paymentMode === "mock" && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900" role="alert">
              <AlertTriangle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-bold">حالت آزمایشی پرداخت فعال است</p>
                <p className="mt-1 text-sm leading-7">
                  هیچ تراکنش بانکی واقعی انجام نمی‌شود. این حالت فقط برای توسعه و تست رابط کاربری است.
                </p>
              </div>
            </div>
          )}

          {paymentMode === "disabled" && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive" role="alert">
              <LockKeyhole size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-bold">پرداخت واقعی غیرفعال است</p>
                <p className="mt-1 text-sm leading-7">
                  برای دریافت مبلغ و اتصال به زرین‌پال، API امن بک‌اند باید فعال شود. اطلاعات محرمانه در فرانت نگهداری نمی‌شود.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="space-y-5 rounded-3xl border border-border bg-card p-5 text-right shadow-soft md:p-7" aria-labelledby="customer-info-title">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary" size={22} aria-hidden="true" />
                  <h2 id="customer-info-title" className="text-xl font-bold text-foreground">
                    اطلاعات تماس و گیرنده
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
                      نام و نام خانوادگی *
                    </label>
                    <input id="fullName" {...register("fullName")} className={inputClass} autoComplete="name" />
                    {fieldError(errors.fullName?.message)}
                  </div>
                  <div>
                    <label htmlFor="mobile" className="mb-1.5 block text-sm font-medium">
                      شماره موبایل *
                    </label>
                    <input
                      id="mobile"
                      {...register("mobile")}
                      className={inputClass}
                      placeholder="09xxxxxxxxx"
                      inputMode="numeric"
                      dir="ltr"
                      autoComplete="tel"
                    />
                    {fieldError(errors.mobile?.message)}
                  </div>
                  <div>
                    <label htmlFor="province" className="mb-1.5 block text-sm font-medium">
                      استان {deliveryMethod !== "pickup" && "*"}
                    </label>
                    <input
                      id="province"
                      {...register("province")}
                      className={inputClass}
                      disabled={deliveryMethod === "pickup"}
                      autoComplete="address-level1"
                    />
                    {fieldError(errors.province?.message)}
                  </div>
                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-sm font-medium">
                      شهر {deliveryMethod !== "pickup" && "*"}
                    </label>
                    <input
                      id="city"
                      {...register("city")}
                      className={inputClass}
                      disabled={deliveryMethod === "pickup"}
                      autoComplete="address-level2"
                    />
                    {fieldError(errors.city?.message)}
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="mb-1.5 block text-sm font-medium">
                      آدرس کامل {deliveryMethod !== "pickup" && "*"}
                    </label>
                    <textarea
                      id="address"
                      {...register("address")}
                      className={inputClass}
                      rows={4}
                      disabled={deliveryMethod === "pickup"}
                      autoComplete="street-address"
                    />
                    {fieldError(errors.address?.message)}
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="mb-1.5 block text-sm font-medium">
                      کد پستی
                    </label>
                    <input
                      id="postalCode"
                      {...register("postalCode")}
                      className={inputClass}
                      inputMode="numeric"
                      dir="ltr"
                      disabled={deliveryMethod === "pickup"}
                      autoComplete="postal-code"
                    />
                    {fieldError(errors.postalCode?.message)}
                  </div>
                  <div>
                    <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
                      یادداشت سفارش
                    </label>
                    <input id="notes" {...register("notes")} className={inputClass} />
                    {fieldError(errors.notes?.message)}
                  </div>
                </div>
              </section>

              <section className="space-y-3 rounded-3xl border border-border bg-card p-5 text-right shadow-soft md:p-7" aria-labelledby="delivery-title">
                <h2 id="delivery-title" className="mb-2 text-xl font-bold text-foreground">
                  روش تحویل
                </h2>

                <label className={`flex items-start gap-3 rounded-2xl border-2 p-4 transition ${deliveryMethod === "standard" ? "border-primary bg-primary/5" : "border-border"} ${!canUseStandard ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                  <input
                    type="radio"
                    value="standard"
                    checked={deliveryMethod === "standard"}
                    disabled={!canUseStandard}
                    onChange={() => selectDelivery("standard")}
                    className="mt-1"
                  />
                  <Truck size={21} className="mt-0.5 text-primary" aria-hidden="true" />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-bold">ارسال پستی سراسری</span>
                      <span className="font-bold text-primary">{formatToman(getDeliveryFee("standard"))}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">فقط برای محصولاتی که نیاز به زنجیره سرد ندارند.</p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 rounded-2xl border-2 p-4 transition ${deliveryMethod === "chilled" ? "border-primary bg-primary/5" : "border-border"} ${!canUseChilled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                  <input
                    type="radio"
                    value="chilled"
                    checked={deliveryMethod === "chilled"}
                    disabled={!canUseChilled}
                    onChange={() => selectDelivery("chilled")}
                    className="mt-1"
                  />
                  <Snowflake size={21} className="mt-0.5 text-sky-700" aria-hidden="true" />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-bold">ارسال یخچالی تهران و کرج</span>
                      <span className="font-bold text-primary">{formatToman(getDeliveryFee("chilled"))}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      پس از واردکردن تهران یا کرج در فیلد شهر فعال می‌شود.
                    </p>
                  </div>
                </label>

                <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <input
                    type="radio"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => selectDelivery("pickup")}
                    className="mt-1"
                  />
                  <MapPin size={21} className="mt-0.5 text-primary" aria-hidden="true" />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-bold">تحویل حضوری با هماهنگی</span>
                      <span className="font-bold text-emerald-700">رایگان</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">زمان و محل تحویل پس از ثبت سفارش هماهنگ می‌شود.</p>
                  </div>
                </label>

                {deliveryError && (
                  <p className="rounded-xl bg-destructive/10 p-3 text-sm leading-7 text-destructive" role="alert">
                    {deliveryError}
                  </p>
                )}
              </section>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-4 rounded-3xl border border-border bg-card p-6 text-right shadow-card">
                <h2 className="border-b border-border pb-4 text-xl font-bold">خلاصه سفارش</h2>
                <div className="max-h-64 space-y-3 overflow-y-auto pl-1">
                  {items.map((item) => {
                    const price = item.selectedVariant?.priceToman ?? item.priceToman;
                    return (
                      <div key={`${item.id}-${item.selectedVariant?.id ?? ""}`} className="flex justify-between gap-3 text-sm">
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.selectedVariant?.name ? `${item.selectedVariant.name} · ` : ""}
                            {item.quantity.toLocaleString("fa-IR")} عدد
                          </p>
                        </div>
                        <span className="shrink-0 font-bold">{formatToman(price * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">مبلغ محصولات</span>
                    <span className="font-bold">{formatToman(subtotal)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">بسته‌بندی محافظ</span>
                    <span className="font-bold">{formatToman(packagingFee)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">هزینه تحویل</span>
                    <span className="font-bold">{formatToman(deliveryFee)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-border pt-4 text-lg">
                    <span className="font-bold">مبلغ قابل پرداخت</span>
                    <span className="font-black text-primary">{formatToman(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || Boolean(deliveryError) || paymentMode === "disabled"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-primary-foreground shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                >
                  <LockKeyhole size={18} aria-hidden="true" />
                  {submitting ? "در حال ساخت سفارش امن…" : "ثبت سفارش و انتقال به درگاه"}
                </button>

                <p className="text-center text-xs leading-6 text-muted-foreground">
                  مبلغ واقعی و موجودی باید دوباره در بک‌اند محاسبه و تأیید شود.
                </p>

                <Link to="/cart" className="block text-center text-sm font-bold text-primary hover:underline">
                  بازگشت و ویرایش سبد
                </Link>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;
