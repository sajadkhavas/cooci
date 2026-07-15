import { Link, useParams } from "react-router-dom";
import { CalendarClock, PackageCheck, Truck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/context/CartContext";
import { getLocalOrder } from "@/lib/orders";

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const order = getLocalOrder(orderId ?? null);

  if (!order) {
    return (
      <>
        <SEO title="سفارش پیدا نشد" description="سفارش موردنظر در وینیمی پیدا نشد." />
        <section className="section-padding">
          <div className="container-custom max-w-xl text-center bg-card border border-border rounded-3xl p-10 shadow-soft">
            <span className="text-6xl block mb-5">🔎</span>
            <h1 className="heading-2 text-foreground mb-4">سفارش پیدا نشد</h1>
            <p className="text-muted-foreground mb-6">شماره سفارش در حافظه مرورگر پیدا نشد.</p>
            <Link to="/products" className="btn-primary px-8 py-3 rounded-xl inline-block">
              مشاهده محصولات
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO title={`سفارش ${order.id}`} description="جزئیات سفارش ثبت‌شده در وینیمی بیکری" />
      <section className="bg-secondary/50 py-12">
        <div className="container-custom text-center">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
            <PackageCheck size={18} />
            {order.status === "paid" ? "پرداخت‌شده" : "در انتظار پرداخت"}
          </span>
          <h1 className="heading-1 text-foreground">سفارش {order.id}</h1>
          <p className="body-large text-muted-foreground mt-4 max-w-2xl mx-auto">
            این صفحه ساختار پیگیری سفارش را آماده می‌کند و در نسخه بک‌اند به وضعیت واقعی سفارش متصل می‌شود.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="space-y-4">
            {order.items.map((item) => (
              <article key={item.id} className="bg-card border border-border rounded-3xl p-4 shadow-soft flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                  {item.image ? <img src={item.image} alt={item.imageAlt ?? item.name} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-foreground line-clamp-1">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">{item.variantName ?? item.weight}</p>
                  <p className="text-sm text-muted-foreground">تعداد: {item.quantity.toLocaleString("fa-IR")}</p>
                </div>
                <strong className="text-primary">{formatToman(item.price * item.quantity)}</strong>
              </article>
            ))}
          </div>

          <aside className="bg-card border border-border rounded-3xl p-6 shadow-hover sticky top-28 space-y-5">
            <div className="flex items-start gap-3">
              <CalendarClock className="text-primary" size={22} />
              <div>
                <span className="text-sm text-muted-foreground block">تاریخ ثبت</span>
                <strong className="text-foreground">{new Date(order.createdAt).toLocaleString("fa-IR")}</strong>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="text-primary" size={22} />
              <div>
                <span className="text-sm text-muted-foreground block">روش ارسال</span>
                <strong className="text-foreground">{order.delivery.label}</strong>
              </div>
            </div>
            <div className="border-t border-border pt-5 space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>جمع محصولات</span>
                <strong className="text-foreground">{formatToman(order.subtotal)}</strong>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>ارسال</span>
                <strong className="text-foreground">{order.deliveryFee ? formatToman(order.deliveryFee) : "رایگان"}</strong>
              </div>
              <div className="flex justify-between text-lg font-black text-foreground border-t border-border pt-3">
                <span>مبلغ کل</span>
                <span>{formatToman(order.total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default OrderDetailPage;
