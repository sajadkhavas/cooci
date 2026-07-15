import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, CreditCard, XCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/context/CartContext";
import { getLocalOrder, updateLocalOrderPaymentStatus } from "@/lib/orders";

const PaymentCallbackPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const status = params.get("status") === "failed" ? "failed" : "paid";
  const order = orderId ? updateLocalOrderPaymentStatus(orderId, status) ?? getLocalOrder(orderId) : undefined;
  const isPaid = status === "paid";

  return (
    <>
      <SEO
        title={isPaid ? "پرداخت موفق" : "پرداخت ناموفق"}
        description="نتیجه پرداخت سفارش وینیمی بیکری"
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
                  ? "سفارش شما با موفقیت ثبت شد. این صفحه برای اتصال نهایی به callback درگاه پرداخت آماده است."
                  : "پرداخت با موفقیت ثبت نشد. می‌توانید دوباره سفارش را بررسی کنید یا با پشتیبانی تماس بگیرید."}
              </p>
            </div>

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
                  در نسخه متصل به بک‌اند، وضعیت پرداخت از درگاه خوانده و با امضای معتبر در سرور تأیید می‌شود. این صفحه فقط ساختار فرانت callback را آماده کرده است.
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
