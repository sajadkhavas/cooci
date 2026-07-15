import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, CreditCard, PackageCheck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/context/CartContext";
import { getLocalOrder } from "@/lib/orders";

const OrderSuccessPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const order = getLocalOrder(orderId);

  return (
    <>
      <SEO
        title="ثبت سفارش"
        description="نتیجه ثبت سفارش در وینیمی بیکری و آماده‌سازی برای اتصال به درگاه پرداخت."
      />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-hover text-center space-y-7">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
              <CheckCircle2 size={48} />
            </div>

            <div>
              <h1 className="heading-1 text-foreground mb-4">سفارش ثبت شد</h1>
              <p className="body-large text-muted-foreground leading-8">
                سفارش شما در فرانت به‌صورت پیش‌نویس ثبت شد. بعد از اتصال بک‌اند و درگاه، همین مرحله به پرداخت بانکی واقعی منتقل می‌شود.
              </p>
            </div>

            {order ? (
              <div className="grid md:grid-cols-3 gap-4 text-right">
                <div className="rounded-2xl bg-secondary/60 border border-border p-4">
                  <span className="text-xs text-muted-foreground block mb-1">شماره سفارش</span>
                  <strong className="text-foreground">{order.id}</strong>
                </div>
                <div className="rounded-2xl bg-secondary/60 border border-border p-4">
                  <span className="text-xs text-muted-foreground block mb-1">تعداد آیتم</span>
                  <strong className="text-foreground">{order.items.length.toLocaleString("fa-IR")}</strong>
                </div>
                <div className="rounded-2xl bg-secondary/60 border border-border p-4">
                  <span className="text-xs text-muted-foreground block mb-1">جمع سفارش</span>
                  <strong className="text-primary">{formatToman(order.total)}</strong>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-secondary/60 border border-border p-5 text-muted-foreground">
                شماره سفارش در آدرس صفحه پیدا نشد، اما مسیر ثبت سفارش آماده است.
              </div>
            )}

            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5 text-right text-primary leading-8">
              <div className="flex items-start gap-3">
                <CreditCard size={22} className="mt-1 flex-shrink-0" />
                <p>
                  وضعیت پرداخت: آماده اتصال به درگاه. در نسخه نهایی، بعد از ثبت سفارش کاربر مستقیم به درگاه پرداخت منتقل می‌شود و نتیجه پرداخت به بک‌اند برگشت داده می‌شود.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border p-5 text-right text-muted-foreground leading-8">
              <div className="flex items-start gap-3">
                <PackageCheck size={22} className="mt-1 flex-shrink-0 text-primary" />
                <p>
                  سفارش‌های یخچالی فقط در تهران، کرج و محدوده‌های قابل ارسال سرد پذیرفته می‌شوند. هزینه ارسال در مرحله اتصال بک‌اند و درگاه نهایی می‌شود.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/products" className="btn-primary px-8 py-3 rounded-xl font-bold">
                ادامه خرید
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

export default OrderSuccessPage;
