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

const schema = z
  .object({
    fullName: z.string().trim().min(2, "نام کامل الزامی است").max(100),
    mobile: z
      .string()
      .trim()
      .refine(
        (value) => /^09\d{9}$/.test(normalizeEnglishDigits(value)),
        "شماره موبایل معتبر نیست (09xxxxxxxxx)",
      ),
    province: z.string().trim().max(50),
    city: z.string().trim().max(50),
    address: z.string().trim().max(500),
    postalCode: z
      .string()
      .trim()
      .refine(
        (value) =>
          value.length === 0 || /^\d{10}$/.test(normalizeEnglishDigits(value)),
        "کد پستی باید ۱۰ رقم باشد",
      ),
    notes: z.string().trim().max(500, "یادداشت حداکثر ۵۰۰ کاراکتر است"),
    deliveryMethod: z.enum(["standard", "chilled", "pickup"]),
  })
  .superRefine((data, context) => {
    if (data.deliveryMethod === "pickup") return;

    if (data.province.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["province"],
        message: "استان الزامی است",
      });
    }
    if (data.city.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["city"],
        message: "شهر الزامی است",
      });
    }
    if (data.address.length < 10) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "آدرس حداقل ۱۰ کاراکتر باشد",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const fieldOrder: (keyof FormValues)[] = [
  "fullName",
  "mobile",
  "province",
  "city",
  "address",
  "postalCode",
  "notes",
  "deliveryMethod",
];

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
    setFocus,
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

  const city = watch("city");
  const deliveryMethod = watch("deliveryMethod");
  const canUseStandard = !hasCoolingItems;
  const canUseChilled = isChilledDeliveryCity(city);
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
      toast.error("قیمت یا موجودی سبد معتبر نیست؛ ابتدا سبد را اصلاح کنید.");
      return;
    }

    const methodError = validateDeliveryMethod({
      method: data.deliveryMethod,
      city: data.city,
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
        fullName: data.fullName,
        mobile: normalizedMobile,
        province:
          data.deliveryMethod === "pickup" ? "تحویل حضوری" : data.province,
        city: data.deliveryMethod === "pickup" ? "تحویل حضوری" : data.city,
        address:
          data.deliveryMethod === "pickup"
            ? "تحویل حضوری با هماهنگی"
            : data.address,
        postalCode: normalizedPostalCode || undefined,
        notes: data.notes || undefined,
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

  const onInvalid = (formErrors: typeof errors) => {
    const firstInvalidField = fieldOrder.find((field) => formErrors[field]);
    if (firstInvalidField) setFocus(firstInvalidField);
    toast.error("لطفاً فیلدهای مشخص‌شده را بررسی کنید.");
  };

  const inputClass = "input-field min-h-12 bg-background text-right";
  const errorClass = "mt-1.5 text-xs leading-6 text-destructive";

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
            <p className="mt-3 leading-7 text-muted-foreground">
              سبد خرید تا زمان تأیید نهایی پرداخت حفظ می‌شود. فیلدهای ستاره‌دار الزامی هستند.
            </p>
          </div>

          {paymentMode === "mock" && (
            <div
              className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900"
              role="alert"
            >
              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-bold">حالت آزمایشی پرداخت فعال است</p>
                <p className="mt-1 text-sm leading-7">
                  هیچ تراکنش بانکی واقعی انجام نمی‌شود؛ این حالت فقط برای توسعه است.
                </p>
              </div>
            </div>
          )}

          {paymentMode === "disabled" && (
            <div
              className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive"
              role="alert"
            >
              <LockKeyhole
                size={20}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-bold">پرداخت واقعی غیرفعال است</p>
                <p className="mt-1 text-sm leading-7">
                  API امن Laravel باید فعال شود. هیچ Merchant ID یا راز پرداختی در فرانت نگهداری نمی‌شود.
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="grid min-w-0 gap-8 lg:grid-cols-3"
            noValidate
            aria-busy={submitting}
          >
            <div className="min-w-0 space-y-6 lg:col-span-2">
              <section className="space-y-5 rounded-3xl border border-border bg-card p-4 text-right shadow-soft sm:p-5 md:p-7">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className="text-primary"
                    size={22}
                    aria-hidden="true"
                  />
                  <h2 className="text-xl font-bold">اطلاعات تماس و گیرنده</h2>
                </div>

                <div className="grid min-w-0 gap-4 md:grid-cols-2">
                  <div className="min-w-0">
                    <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
                      نام و نام خانوادگی <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="fullName"
                      {...register("fullName")}
                      className={inputClass}
                      autoComplete="name"
                      required
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    />
                    {errors.fullName && (
                      <p id="fullName-error" className={errorClass} role="alert">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="mobile" className="mb-1.5 block text-sm font-medium">
                      شماره موبایل <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="mobile"
                      {...register("mobile")}
                      className={`${inputClass} text-left`}
                      placeholder="09xxxxxxxxx"
                      inputMode="numeric"
                      dir="ltr"
                      autoComplete="tel"
                      required
                      aria-invalid={Boolean(errors.mobile)}
                      aria-describedby={errors.mobile ? "mobile-error" : undefined}
                    />
                    {errors.mobile && (
                      <p id="mobile-error" className={errorClass} role="alert">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="province" className="mb-1.5 block text-sm font-medium">
                      استان {deliveryMethod !== "pickup" && <span aria-hidden="true">*</span>}
                    </label>
                    <input
                      id="province"
                      {...register("province")}
                      className={inputClass}
                      disabled={deliveryMethod === "pickup"}
                      autoComplete="address-level1"
                      aria-invalid={Boolean(errors.province)}
                      aria-describedby={errors.province ? "province-error" : undefined}
                    />
                    {errors.province && (
                      <p id="province-error" className={errorClass} role="alert">
                        {errors.province.message}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="city" className="mb-1.5 block text-sm font-medium">
                      شهر {deliveryMethod !== "pickup" && <span aria-hidden="true">*</span>}
                    </label>
                    <input
                      id="city"
                      {...register("city")}
                      className={inputClass}
                      disabled={deliveryMethod === "pickup"}
                      autoComplete="address-level2"
                      aria-invalid={Boolean(errors.city)}
                      aria-describedby={errors.city ? "city-error" : undefined}
                    />
                    {errors.city && (
                      <p id="city-error" className={errorClass} role="alert">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0 md:col-span-2">
                    <label htmlFor="address" className="mb-1.5 block text-sm font-medium">
                      آدرس کامل {deliveryMethod !== "pickup" && <span aria-hidden="true">*</span>}
                    </label>
                    <textarea
                      id="address"
                      {...register("address")}
                      className={inputClass}
                      rows={4}
                      disabled={deliveryMethod === "pickup"}
                      autoComplete="street-address"
                      aria-invalid={Boolean(errors.address)}
                      aria-describedby={errors.address ? "address-error" : undefined}
                    />
                    {errors.address && (
                      <p id="address-error" className={errorClass} role="alert">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="postalCode" className="mb-1.5 block text-sm font-medium">
                      کد پستی
                    </label>
                    <input
                      id="postalCode"
                      {...register("postalCode")}
                      className={`${inputClass} text-left`}
                      inputMode="numeric"
                      dir="ltr"
                      disabled={deliveryMethod === "pickup"}
                      autoComplete="postal-code"
                      aria-invalid={Boolean(errors.postalCode)}
                      aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
                    />
                    {errors.postalCode && (
                      <p id="postalCode-error" className={errorClass} role="alert">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
                      یادداشت سفارش
                    </label>
                    <input
                      id="notes"
                      {...register("notes")}
                      className={inputClass}
                      aria-invalid={Boolean(errors.notes)}
                      aria-describedby={errors.notes ? "notes-error" : undefined}
                    />
                    {errors.notes && (
                      <p id="notes-error" className={errorClass} role="alert">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <fieldset
                className="space-y-3 rounded-3xl border border-border bg-card p-4 text-right shadow-soft sm:p-5 md:p-7"
                aria-describedby={deliveryError ? "delivery-error" : "delivery-help"}
              >
                <legend className="px-1 text-xl font-bold">روش تحویل</legend>
                <p id="delivery-help" className="text-sm leading-7 text-muted-foreground">
                  روش قابل‌انتخاب بر اساس نوع محصولات و شهر مقصد تعیین می‌شود.
                </p>

                <label
                  className={`flex min-w-0 items-start gap-3 rounded-2xl border-2 p-4 transition-colors ${
                    deliveryMethod === "standard"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  } ${canUseStandard ? "cursor-pointer" : "cursor-not-allowed opacity-55"}`}
                >
                  <input
                    type="radio"
                    {...register("deliveryMethod")}
                    value="standard"
                    checked={deliveryMethod === "standard"}
                    disabled={!canUseStandard}
                    onChange={() => selectDelivery("standard")}
                    className="mt-1 h-5 w-5 shrink-0 accent-primary"
                  />
                  <Truck size={21} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
                      <strong>ارسال پستی سراسری</strong>
                      <strong className="text-primary">
                        {formatToman(getDeliveryFee("standard"))}
                      </strong>
                    </span>
                    <span className="mt-1 block text-sm leading-7 text-muted-foreground">
                      برای محصولات خشک و بدون نیاز به زنجیره سرد.
                    </span>
                  </span>
                </label>

                <label
                  className={`flex min-w-0 items-start gap-3 rounded-2xl border-2 p-4 transition-colors ${
                    deliveryMethod === "chilled"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  } ${canUseChilled ? "cursor-pointer" : "cursor-not-allowed opacity-55"}`}
                >
                  <input
                    type="radio"
                    {...register("deliveryMethod")}
                    value="chilled"
                    checked={deliveryMethod === "chilled"}
                    disabled={!canUseChilled}
                    onChange={() => selectDelivery("chilled")}
                    className="mt-1 h-5 w-5 shrink-0 accent-primary"
                  />
                  <Snowflake size={21} className="mt-0.5 shrink-0 text-sky-700" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
                      <strong>ارسال یخچالی تهران و کرج</strong>
                      <strong className="text-primary">
                        {formatToman(getDeliveryFee("chilled"))}
                      </strong>
                    </span>
                    <span className="mt-1 block text-sm leading-7 text-muted-foreground">
                      پس از واردکردن تهران یا کرج در فیلد شهر فعال می‌شود.
                    </span>
                  </span>
                </label>

                <label
                  className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors ${
                    deliveryMethod === "pickup"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("deliveryMethod")}
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => selectDelivery("pickup")}
                    className="mt-1 h-5 w-5 shrink-0 accent-primary"
                  />
                  <MapPin size={21} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
                      <strong>تحویل حضوری با هماهنگی</strong>
                      <strong className="text-emerald-700">رایگان</strong>
                    </span>
                    <span className="mt-1 block text-sm leading-7 text-muted-foreground">
                      زمان و محل تحویل پس از ثبت سفارش هماهنگ می‌شود.
                    </span>
                  </span>
                </label>

                {deliveryError && (
                  <p
                    id="delivery-error"
                    className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm leading-7 text-destructive"
                    role="alert"
                  >
                    {deliveryError}
                  </p>
                )}
              </fieldset>
            </div>

            <aside className="min-w-0 lg:col-span-1" aria-label="خلاصه سفارش">
              <div className="space-y-4 rounded-3xl border border-border bg-card p-5 text-right shadow-card sm:p-6 lg:sticky lg:top-24">
                <h2 className="border-b border-border pb-4 text-xl font-bold">
                  خلاصه سفارش
                </h2>
                <ul className="max-h-64 space-y-3 overflow-y-auto overscroll-contain pl-1">
                  {items.map((item) => {
                    const price = item.selectedVariant?.priceToman ?? item.priceToman;
                    return (
                      <li
                        key={`${item.id}-${item.selectedVariant?.id ?? ""}`}
                        className="flex min-w-0 justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="line-clamp-2 font-medium">{item.name}</p>
                          <p className="text-xs leading-6 text-muted-foreground">
                            {item.selectedVariant?.name
                              ? `${item.selectedVariant.name} · `
                              : ""}
                            {item.quantity.toLocaleString("fa-IR")} عدد
                          </p>
                        </div>
                        <strong className="shrink-0 text-left">
                          {formatToman(price * item.quantity)}
                        </strong>
                      </li>
                    );
                  })}
                </ul>

                <div className="space-y-3 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">مبلغ محصولات</span>
                    <strong>{formatToman(subtotal)}</strong>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">بسته‌بندی</span>
                    <strong>{formatToman(packagingFee)}</strong>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">هزینه تحویل</span>
                    <strong>{formatToman(deliveryFee)}</strong>
                  </div>
                  <div
                    className="flex flex-col gap-1 border-t border-border pt-4 text-lg sm:flex-row sm:justify-between sm:gap-3"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <strong>مبلغ قابل پرداخت</strong>
                    <strong className="text-primary">{formatToman(total)}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    Boolean(deliveryError) ||
                    paymentMode === "disabled"
                  }
                  className="btn-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-bold shadow-lg"
                >
                  <LockKeyhole size={18} aria-hidden="true" />
                  {submitting
                    ? "در حال ساخت سفارش امن…"
                    : "ثبت سفارش و انتقال به درگاه"}
                </button>
                <p className="text-center text-xs leading-6 text-muted-foreground">
                  مبلغ و موجودی در بک‌اند دوباره محاسبه می‌شود.
                </p>
                <Link
                  to="/cart"
                  className="touch-target flex items-center justify-center rounded-lg text-center text-sm font-bold text-primary hover:underline"
                >
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
