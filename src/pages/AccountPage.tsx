import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Edit3,
  Loader2,
  LogOut,
  Package,
  ReceiptText,
  Save,
  ShoppingBag,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { formatToman } from "@/config/brand";
import { useAuth } from "@/context/AuthContext";
import { loadAccountOrders } from "@/lib/account";
import {
  paymentStatusLabels,
  statusLabels,
  type LocalOrder,
  type OrderStatus,
} from "@/lib/orders";

type OrderFilter = "all" | "active" | "paid" | "cancelled";

const statusColor: Record<OrderStatus, string> = {
  awaiting_payment: "bg-amber-100 text-amber-900",
  paid: "bg-emerald-100 text-emerald-900",
  processing: "bg-blue-100 text-blue-900",
  shipped: "bg-indigo-100 text-indigo-900",
  delivered: "bg-green-100 text-green-900",
  cancelled: "bg-red-100 text-red-900",
};

const filters: { value: OrderFilter; label: string }[] = [
  { value: "all", label: "همه سفارش‌ها" },
  { value: "active", label: "در حال انجام" },
  { value: "paid", label: "پرداخت‌شده" },
  { value: "cancelled", label: "لغوشده" },
];

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, mode, logout, updateProfile } = useAuth();
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | undefined>();
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [editingProfile, setEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setFullName(user?.fullName ?? "");
  }, [user?.fullName]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const load = async () => {
      setLoadingOrders(true);
      setOrdersError(undefined);
      try {
        const result = await loadAccountOrders(user);
        if (!cancelled) setOrders(result.orders);
      } catch (error) {
        if (!cancelled) {
          setOrdersError(
            error instanceof Error
              ? error.message
              : "دریافت سفارش‌ها با مشکل روبه‌رو شد.",
          );
        }
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const filteredOrders = useMemo(() => {
    switch (filter) {
      case "active":
        return orders.filter((order) =>
          ["awaiting_payment", "paid", "processing", "shipped"].includes(order.status),
        );
      case "paid":
        return orders.filter((order) => order.paymentStatus === "paid");
      case "cancelled":
        return orders.filter(
          (order) => order.status === "cancelled" || order.paymentStatus === "cancelled",
        );
      default:
        return orders;
    }
  }, [filter, orders]);

  const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
  const totalSpent = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter((order) =>
    ["awaiting_payment", "paid", "processing", "shipped"].includes(order.status),
  ).length;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("از حساب کاربری خارج شدید");
      navigate("/account/login", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خروج از حساب ناموفق بود.");
      setLoggingOut(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfile(fullName);
      setEditingProfile(false);
      toast.success("پروفایل به‌روزرسانی شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ذخیره پروفایل ناموفق بود.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <SEO title="حساب کاربری" noIndex />
      <section className="section-padding bg-gradient-to-b from-secondary/20 to-background">
        <div className="container-custom">
          <header className="mb-8 flex flex-col justify-between gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft md:flex-row md:items-center">
            <div className="flex items-center gap-4 text-right">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserRound size={28} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">خوش آمدید</p>
                <h1 className="text-2xl font-black text-foreground">
                  {user.fullName || "مشتری وینیمی"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground" dir="ltr">
                  {user.mobile}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setEditingProfile((value) => !value)}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"
              >
                <Edit3 size={16} aria-hidden="true" />
                ویرایش پروفایل
              </button>
              <button
                type="button"
                onClick={() => void handleLogout()}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-4 py-2.5 text-sm font-bold text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
              >
                {loggingOut ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <LogOut size={16} aria-hidden="true" />}
                {loggingOut ? "در حال خروج…" : "خروج"}
              </button>
            </div>
          </header>

          {mode === "mock" && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950" role="status">
              <AlertCircle size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
              حساب و سفارش‌های نمایش‌داده‌شده در حالت آزمایشی داخل مرورگر نگهداری می‌شوند و حساب واقعی سرور نیستند.
            </div>
          )}

          {editingProfile && (
            <section className="mb-8 rounded-3xl border border-primary/25 bg-card p-6 shadow-soft" aria-labelledby="profile-edit-title">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 id="profile-edit-title" className="text-xl font-bold text-foreground">ویرایش مشخصات</h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(false);
                    setFullName(user.fullName ?? "");
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="بستن فرم ویرایش"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <div>
                  <label htmlFor="account-full-name" className="mb-2 block text-sm font-bold">نام و نام خانوادگی</label>
                  <input
                    id="account-full-name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    maxLength={100}
                    autoComplete="name"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void handleSaveProfile()}
                  disabled={savingProfile}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground disabled:opacity-50"
                >
                  {savingProfile ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <Save size={17} aria-hidden="true" />}
                  {savingProfile ? "در حال ذخیره…" : "ذخیره تغییرات"}
                </button>
              </div>
            </section>
          )}

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ReceiptText size={20} aria-hidden="true" /></div>
              <p className="text-sm text-muted-foreground">همه سفارش‌ها</p>
              <strong className="mt-1 block text-2xl text-foreground">{orders.length.toLocaleString("fa-IR")}</strong>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800"><Clock3 size={20} aria-hidden="true" /></div>
              <p className="text-sm text-muted-foreground">سفارش فعال</p>
              <strong className="mt-1 block text-2xl text-foreground">{activeOrders.toLocaleString("fa-IR")}</strong>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800"><CheckCircle2 size={20} aria-hidden="true" /></div>
              <p className="text-sm text-muted-foreground">پرداخت موفق</p>
              <strong className="mt-1 block text-2xl text-foreground">{paidOrders.length.toLocaleString("fa-IR")}</strong>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800"><WalletCards size={20} aria-hidden="true" /></div>
              <p className="text-sm text-muted-foreground">مجموع خرید موفق</p>
              <strong className="mt-1 block text-lg text-primary">{formatToman(totalSpent)}</strong>
            </div>
          </div>

          <section aria-labelledby="account-orders-title">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h2 id="account-orders-title" className="text-2xl font-black text-foreground">سفارش‌های من</h2>
              <div className="flex flex-wrap gap-2" aria-label="فیلتر سفارش‌ها">
                {filters.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    aria-pressed={filter === item.value}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      filter === item.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground shadow-soft hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingOrders ? (
              <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-soft" role="status">
                <Loader2 className="mx-auto mb-4 animate-spin text-primary" size={42} aria-hidden="true" />
                <p className="font-bold">در حال دریافت سفارش‌ها…</p>
              </div>
            ) : ordersError ? (
              <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center" role="alert">
                <AlertCircle className="mx-auto mb-4 text-destructive" size={46} aria-hidden="true" />
                <h3 className="text-xl font-bold text-foreground">دریافت سفارش‌ها ناموفق بود</h3>
                <p className="mt-2 text-muted-foreground">{ordersError}</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-soft">
                <Package className="mx-auto mb-4 text-muted-foreground" size={52} aria-hidden="true" />
                <h3 className="text-xl font-bold text-foreground">
                  {orders.length === 0 ? "هنوز سفارشی ثبت نکرده‌اید" : "سفارشی با این وضعیت وجود ندارد"}
                </h3>
                <p className="mx-auto mt-2 max-w-lg leading-8 text-muted-foreground">
                  {orders.length === 0
                    ? "پس از ثبت سفارش، وضعیت پرداخت و ارسال آن را از همین صفحه دنبال می‌کنید."
                    : "فیلتر دیگری را انتخاب کنید تا سفارش‌های مرتبط نمایش داده شوند."}
                </p>
                {orders.length === 0 && (
                  <Link
                    to="/products"
                    className="btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3"
                  >
                    <ShoppingBag size={18} aria-hidden="true" />
                    مشاهده محصولات
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/account/orders/${encodeURIComponent(order.id)}`}
                    className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-card"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div className="text-right">
                        <p className="text-xs font-bold text-primary">شماره سفارش</p>
                        <strong className="mt-1 block text-base" dir="ltr">{order.id}</strong>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString("fa-IR")}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusColor[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                        <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-foreground">
                          {paymentStatusLabels[order.paymentStatus]}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-5 md:block md:text-left">
                        <span className="text-xs text-muted-foreground">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString("fa-IR")} قلم
                        </span>
                        <strong className="block text-lg text-primary">{formatToman(order.total)}</strong>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </>
  );
};

export default AccountPage;
