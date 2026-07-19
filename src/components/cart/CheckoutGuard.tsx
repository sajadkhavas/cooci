import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useCatalogProducts } from "@/hooks/useCatalog";

interface CheckoutGuardProps {
  children: ReactNode;
}

export const CheckoutGuard = ({ children }: CheckoutGuardProps) => {
  const { items, isReadyForCheckout, syncWithCatalog } = useCart();
  const { products, isLoading } = useCatalogProducts();
  const [catalogChecked, setCatalogChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (products.length > 0) syncWithCatalog(products);
    setCatalogChecked(true);
  }, [isLoading, products, syncWithCatalog]);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  if (!catalogChecked) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-soft" role="status">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="font-bold text-foreground">در حال بررسی قیمت و موجودی سبد...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!isReadyForCheckout) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center" role="alert">
            <AlertTriangle className="mx-auto mb-4 text-destructive" size={52} aria-hidden="true" />
            <h1 className="heading-2 mb-3 text-foreground">سبد خرید نیاز به اصلاح دارد</h1>
            <p className="mx-auto mb-7 max-w-lg leading-8 text-muted-foreground">
              قیمت یا موجودی بعضی محصولات تغییر کرده است. پیش از ثبت اطلاعات ارسال، سبد را بررسی و اصلاح کنید.
            </p>
            <Link
              to="/cart"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3"
            >
              <ShoppingCart size={18} aria-hidden="true" />
              بازگشت به سبد خرید
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return children;
};
