import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { getSession } from "@/lib/session";
import { getOrderById, statusLabels, paymentStatusLabels, LocalOrder } from "@/lib/orders";
import { formatToman } from "@/config/brand";

const deliveryLabel = {
  standard: "ارسال پستی سراسری",
  chilled: "ارسال یخچالی (تهران/کرج)",
  pickup: "تحویل حضوری",
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<LocalOrder | null | undefined>(undefined);

  useEffect(() => {
    if (!getSession()) {
      navigate("/account/login", { replace: true });
      return;
    }
    setOrder(orderId ? getOrderById(orderId) ?? null : null);
  }, [orderId, navigate]);

  if (order === undefined) return null;

  return (
    <>
      <SEO title={`سفارش ${orderId}`} noIndex />
      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          <Link
            to="/account"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-primary"
          >
            <ArrowRight size={16} /> بازگشت به حساب
          </Link>

          {!order ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center">
              <p className="mb-4">سفارش پیدا نشد</p>
              <Link to="/account" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold">
                بازگشت
              </Link>
            </div>
          ) : (
            <div className="space-y-6 text-right">
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-wrap justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold">{order.id}</h1>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("fa-IR")}
                  </p>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <span className="bg-secondary rounded-full px-3 py-1">
                    وضعیت: {statusLabels[order.status]}
                  </span>
                  <span className="bg-secondary rounded-full px-3 py-1">
                    پرداخت: {paymentStatusLabels[order.paymentStatus]}
                  </span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold mb-4">اقلام سفارش</h2>
                <div className="space-y-3">
                  {order.items.map((i) => {
                    const price = i.selectedVariant?.priceToman ?? i.priceToman;
                    return (
                      <div
                        key={`${i.id}-${i.selectedVariant?.id ?? ""}`}
                        className="flex gap-3 items-center border-b border-border pb-3 last:border-0"
                      >
                        <img src={i.image} alt={i.name} className="w-14 h-14 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="font-bold text-sm">{i.name}</div>
                          {i.selectedVariant && (
                            <div className="text-xs text-muted-foreground">{i.selectedVariant.name}</div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {formatToman(price)} × {i.quantity.toLocaleString("fa-IR")}
                          </div>
                        </div>
                        <div className="font-bold text-primary">{formatToman(price * i.quantity)}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-border mt-4 pt-4 space-y-1 text-sm">
                  <div className="flex justify-between"><span>جمع کل</span><span>{formatToman(order.subtotal)}</span></div>
                  <div className="flex justify-between"><span>بسته‌بندی</span><span>{formatToman(order.packagingFee)}</span></div>
                  <div className="flex justify-between"><span>{deliveryLabel[order.deliveryMethod]}</span><span>{formatToman(order.deliveryFee)}</span></div>
                  <div className="flex justify-between text-lg pt-2 border-t border-border">
                    <span className="font-bold">مبلغ کل</span>
                    <span className="font-black text-primary">{formatToman(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold mb-3">مشخصات گیرنده</h2>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>نام: <span className="text-foreground">{order.customer.fullName}</span></p>
                  <p>موبایل: <span className="text-foreground" dir="ltr">{order.customer.mobile}</span></p>
                  <p>شهر: <span className="text-foreground">{order.customer.province}، {order.customer.city}</span></p>
                  <p>آدرس: <span className="text-foreground">{order.customer.address}</span></p>
                  {order.customer.postalCode && <p>کد پستی: <span className="text-foreground" dir="ltr">{order.customer.postalCode}</span></p>}
                  {order.customer.notes && <p>یادداشت: <span className="text-foreground">{order.customer.notes}</span></p>}
                </div>
              </div>

              {order.refId && (
                <div className="bg-card border border-border rounded-2xl p-6 text-sm">
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
