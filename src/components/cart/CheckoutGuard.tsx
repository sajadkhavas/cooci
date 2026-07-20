import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueries } from "@tanstack/react-query";
import { AlertTriangle, RefreshCcw, ShoppingCart } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { products as staticProducts } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { areDevelopmentMocksEnabled, isBackendEnabled } from "@/lib/api";
import { fetchCatalogProduct } from "@/lib/catalog-api";

export const CheckoutGuard = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { items, isReadyForCheckout, syncWithCatalog } = useCart();
  const [catalogChecked, setCatalogChecked] = useState(false);
  const slugs = useMemo(
    () => [...new Set(items.map((item) => item.slug).filter(Boolean))].sort(),
    [items],
  );
  const slugsKey = slugs.join("|");
  const productQueries = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: ["checkout", "catalog-product", slug],
      queryFn: () => fetchCatalogProduct(slug),
      enabled: isBackendEnabled && Boolean(user),
      staleTime: 0,
      retry: 1,
    })),
  });

  const loadingCatalog = isBackendEnabled
    ? productQueries.some((query) => query.isLoading || query.isFetching)
    : false;
  const catalogError = isBackendEnabled
    ? productQueries.find((query) => query.error)?.error
    : undefined;
  const backendProducts = productQueries
    .map((query) => query.data)
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
  const mockProducts = areDevelopmentMocksEnabled
    ? staticProducts.filter((product) => slugs.includes(product.slug))
    : [];
  const reconciledProducts = isBackendEnabled ? backendProducts : mockProducts;

  useEffect(() => {
    setCatalogChecked(false);
  }, [slugsKey]);

  useEffect(() => {
    if (authLoading || !user || items.length === 0 || loadingCatalog || catalogError) return;
    if (reconciledProducts.length !== slugs.length) return;
    syncWithCatalog(reconciledProducts);
    setCatalogChecked(true);
  }, [
    authLoading,
    catalogError,
    items.length,
    loadingCatalog,
    reconciledProducts,
    slugs.length,
    syncWithCatalog,
    user,
  ]);

  if (authLoading) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-xl text-center" role="status">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="font-bold">در حال بررسی نشست کاربری…</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/account/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (items.length === 0) return <Navigate to="/cart" replace />;

  if (!isBackendEnabled && !areDevelopmentMocksEnabled) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-2xl rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center" role="alert">
          <AlertTriangle className="mx-auto mb-4 text-destructive" size={52} aria-hidden="true" />
          <h1 className="heading-2 mb-3">Checkout فعال نیست</h1>
          <p className="leading-8 text-muted-foreground">اتصال امن بک‌اند برای ثبت سفارش لازم است.</p>
        </div>
      </section>
    );
  }

  if (catalogError) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-2xl rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center" role="alert">
          <AlertTriangle className="mx-auto mb-4 text-destructive" size={52} aria-hidden="true" />
          <h1 className="heading-2 mb-3">بررسی سبد ناموفق بود</h1>
          <p className="mb-7 leading-8 text-muted-foreground">
            {catalogError instanceof Error
              ? catalogError.message
              : "قیمت و موجودی سبد از سرور دریافت نشد."}
          </p>
          <button
            type="button"
            onClick={() => productQueries.forEach((query) => void query.refetch())}
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3"
          >
            <RefreshCcw size={18} aria-hidden="true" />
            تلاش دوباره
          </button>
        </div>
      </section>
    );
  }

  if (loadingCatalog || !catalogChecked) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-soft" role="status">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="font-bold">در حال تطبیق Variant، قیمت و موجودی سبد با سرور…</p>
        </div>
      </section>
    );
  }

  if (!isReadyForCheckout) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-2xl rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center" role="alert">
          <AlertTriangle className="mx-auto mb-4 text-destructive" size={52} aria-hidden="true" />
          <h1 className="heading-2 mb-3">سبد خرید نیاز به اصلاح دارد</h1>
          <p className="mx-auto mb-7 max-w-lg leading-8 text-muted-foreground">
            موجودی، Variant یا قیمت یکی از اقلام تغییر کرده است. سبد را بررسی کنید.
          </p>
          <Link to="/cart" className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3">
            <ShoppingCart size={18} aria-hidden="true" />
            بازگشت به سبد خرید
          </Link>
        </div>
      </section>
    );
  }

  return children;
};
