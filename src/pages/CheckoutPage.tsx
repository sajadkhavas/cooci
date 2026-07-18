import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Snowflake, Truck, MapPin } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useCart, PACKAGING_FEE } from "@/context/CartContext";
import { formatToman, brandConfig } from "@/config/brand";
import { saveOrder, generateOrderId, DeliveryMethod } from "@/lib/orders";
import { requestPayment } from "@/lib/zarinpal";

const schema = z.object({
  fullName: z.string().trim().min(2, "نام کامل الزامی است").max(100),
  mobile: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (09xxxxxxxxx)"),
  province: z.string().trim().min(2, "استان الزامی است").max(50),
  city: z.string().trim().min(2, "شهر الزامی است").max(50),
  address: z.string().trim().min(10, "آدرس حداقل ۱۰ کاراکتر").max(500),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد")
    .optional()
    .or(z.literal("")),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

const chilledCities = ["تهران", "کرج"];

const CheckoutPage = () => {
  const { items, subtotal, hasCoolingItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<DeliveryMethod>(
    hasCoolingItems ? "chilled" : "standard",
  );
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const city = watch("city") || "";
  const isChilledCity = chilledCities.some((c) => city.includes(c));

  const deliveryFee = delivery === "chilled" ? 150000 : delivery === "standard" ? 85000 : 0;
  const total = subtotal + PACKAGING_FEE + deliveryFee;

  const canStandard = !hasCoolingItems;
  const canChilled = hasCoolingItems && isChilledCity;

  const deliveryError = useMemo(() => {
    if (hasCoolingItems && delivery === "standard")
      return "محصولات یخچالی با پست سراسری قابل ارسال نیستند.";
    if (delivery === "chilled" && !isChilledCity)
      return "ارسال یخچالی فقط برای تهران و کرج امکان‌پذیر است.";
    return null;
  }, [hasCoolingItems, delivery, isChilledCity]);

  if (items.length === 0) {
    return (
      <section className="section-padding container-custom text-center">
        <SEO title="پرداخت" noIndex />
        <p className="mb-4">سبد شما خالی است.</p>
        <Link to="/products" className="btn-primary px-6 py-3 rounded-lg">
          مشاهده محصولات
        </Link>
      </section>
    );
  }

  const onSubmit = async (data: FormValues) => {
    if (deliveryError) {
      toast.error(deliveryError);
      return;
    }
    setSubmitting(true);
    const orderId = generateOrderId();
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: data.fullName,
        mobile: data.mobile,
        province: data.province,
        city: data.city,
        address: data.address,
        postalCode: data.postalCode || undefined,
        notes: data.notes,
      },
      items,
      subtotal,
      packagingFee: PACKAGING_FEE,
      deliveryMethod: delivery,
      deliveryFee,
      total,
      status: "awaiting_payment" as const,
      paymentStatus: "unpaid" as const,
    };
    saveOrder(order);

    const callbackUrl = `${window.location.origin}/payment/callback?order=${orderId}`;
    const result = await requestPayment({
      orderId,
      amountToman: total,
      description: `سفارش ${orderId} - ${brandConfig.brandName}`,
      mobile: data.mobile,
      callbackUrl,
    });

    if (result.success && result.paymentUrl) {
      if (result.authority) {
        saveOrder({ ...order, authority: result.authority });
      }
      clearCart();
      window.location.href = result.paymentUrl;
    } else {
      toast.error(result.error || "خطا در ایجاد تراکنش پرداخت");
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full border border-border bg-background rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <>
      <SEO title="پرداخت" noIndex />
      <section className="section-padding">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-right">تکمیل سفارش و پرداخت</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-right">
                <h2 className="text-xl font-bold">اطلاعات تماس و ارسال</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">نام و نام خانوادگی *</label>
                    <input {...register("fullName")} className={inputCls} />
                    {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">موبایل *</label>
                    <input {...register("mobile")} className={inputCls} placeholder="09xxxxxxxxx" dir="ltr" />
                    {errors.mobile && <p className="text-destructive text-xs mt-1">{errors.mobile.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">استان *</label>
                    <input {...register("province")} className={inputCls} />
                    {errors.province && <p className="text-destructive text-xs mt-1">{errors.province.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">شهر *</label>
                    <input {...register("city")} className={inputCls} />
                    {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1">آدرس کامل *</label>
                    <textarea {...register("address")} className={inputCls} rows={3} />
                    {errors.address && <p className="text-destructive text-xs mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">کد پستی</label>
                    <input {...register("postalCode")} className={inputCls} dir="ltr" />
                    {errors.postalCode && <p className="text-destructive text-xs mt-1">{errors.postalCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">یادداشت سفارش</label>
                    <input {...register("notes")} className={inputCls} />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-3 text-right">
                <h2 className="text-xl font-bold">روش ارسال</h2>

                <label
                  className={`flex gap-3 items-start p-4 rounded-xl border-2 cursor-pointer transition ${
                    delivery === "standard" ? "border-primary bg-primary/5" : "border-border"
                  } ${!canStandard ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={delivery === "standard"}
                    disabled={!canStandard}
                    onChange={() => setDelivery("standard")}
                    className="mt-1"
                  />
                  <Truck className="mt-0.5" size={20} />
                  <div className="flex-1">
                    <div className="font-bold">ارسال پستی سراسری</div>
                    <div className="text-sm text-muted-foreground">{formatToman(85000)} — فقط محصولات خشک</div>
                  </div>
                </label>

                <label
                  className={`flex gap-3 items-start p-4 rounded-xl border-2 cursor-pointer transition ${
                    delivery === "chilled" ? "border-primary bg-primary/5" : "border-border"
                  } ${!canChilled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={delivery === "chilled"}
                    disabled={!canChilled}
                    onChange={() => setDelivery("chilled")}
                    className="mt-1"
                  />
                  <Snowflake className="mt-0.5" size={20} />
                  <div className="flex-1">
                    <div className="font-bold">ارسال یخچالی (تهران، کرج)</div>
                    <div className="text-sm text-muted-foreground">{formatToman(150000)} — برای محصولات یخچالی</div>
                  </div>
                </label>

                <label
                  className={`flex gap-3 items-start p-4 rounded-xl border-2 cursor-pointer transition ${
                    delivery === "pickup" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={delivery === "pickup"}
                    onChange={() => setDelivery("pickup")}
                    className="mt-1"
                  />
                  <MapPin className="mt-0.5" size={20} />
                  <div className="flex-1">
                    <div className="font-bold">تحویل حضوری با هماهنگی</div>
                    <div className="text-sm text-muted-foreground">رایگان — با هماهنگی قبلی</div>
                  </div>
                </label>

                {deliveryError && (
                  <p className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">{deliveryError}</p>
                )}
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 space-y-3 sticky top-24 text-right">
                <h2 className="text-xl font-bold border-b border-border pb-3">خلاصه سفارش</h2>
                <div className="space-y-2 max-h-64 overflow-auto">
                  {items.map((i) => (
                    <div key={`${i.id}-${i.selectedVariant?.id ?? ""}`} className="flex justify-between text-sm">
                      <span className="line-clamp-1">
                        {i.name} × {i.quantity.toLocaleString("fa-IR")}
                      </span>
                      <span className="font-bold whitespace-nowrap mr-2">
                        {formatToman((i.selectedVariant?.priceToman ?? i.priceToman) * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span>جمع کل</span><span className="font-bold">{formatToman(subtotal)}</span></div>
                  <div className="flex justify-between"><span>بسته‌بندی</span><span className="font-bold">{formatToman(PACKAGING_FEE)}</span></div>
                  <div className="flex justify-between"><span>ارسال</span><span className="font-bold">{formatToman(deliveryFee)}</span></div>
                  <div className="flex justify-between text-lg pt-2 border-t border-border">
                    <span className="font-bold">مبلغ قابل پرداخت</span>
                    <span className="font-black text-primary">{formatToman(total)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting || !!deliveryError}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {submitting ? "در حال انتقال به درگاه…" : "پرداخت آنلاین"}
                </button>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;
