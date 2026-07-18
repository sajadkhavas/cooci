import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Package } from "lucide-react";
import { SEO } from "@/components/SEO";
import { getSession, clearSession } from "@/lib/session";
import { getOrdersByMobile, statusLabels, LocalOrder } from "@/lib/orders";
import { formatToman } from "@/config/brand";

const statusColor: Record<string, string> = {
  awaiting_payment: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AccountPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate("/account/login", { replace: true });
      return;
    }
    setMobile(s.mobile);
    setOrders(getOrdersByMobile(s.mobile));
  }, [navigate]);

  const logout = () => {
    clearSession();
    navigate("/account/login", { replace: true });
  };

  return (
    <>
      <SEO title="حساب کاربری" noIndex />
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div className="text-right">
              <h1 className="text-2xl font-bold">سلام،</h1>
              <p className="text-muted-foreground" dir="ltr">{mobile}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm border border-border px-4 py-2 rounded-xl hover:bg-secondary"
            >
              <LogOut size={16} /> خروج
            </button>
          </div>

          <h2 className="text-xl font-bold mb-4 text-right">سفارش‌های من</h2>

          {orders.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center">
              <Package className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="mb-4">هنوز سفارشی ثبت نکرده‌اید.</p>
              <Link
                to="/products"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold"
              >
                مشاهده محصولات
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <Link
                  key={o.id}
                  to={`/account/orders/${o.id}`}
                  className="block bg-card border border-border rounded-2xl p-4 hover:border-primary transition"
                >
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold">{o.id}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString("fa-IR")}
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${statusColor[o.status] ?? ""}`}>
                      {statusLabels[o.status]}
                    </span>
                    <div className="font-bold text-primary">{formatToman(o.total)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AccountPage;
