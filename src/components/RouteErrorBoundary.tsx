import {
  Component,
  createRef,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { AlertTriangle, Home, RefreshCcw, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SEO } from "@/components/SEO";

interface BoundaryProps {
  children: ReactNode;
  resetKey: string;
}

interface BoundaryState {
  hasError: boolean;
}

class RouteBoundaryCore extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };
  private readonly headingRef = createRef<HTMLHeadingElement>();
  private focusFrame: number | undefined;

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Route rendering failed", error, info);
    }
  }

  componentDidUpdate(
    previousProps: BoundaryProps,
    previousState: BoundaryState,
  ) {
    if (
      this.state.hasError &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false });
      return;
    }

    if (!previousState.hasError && this.state.hasError) {
      this.focusFrame = window.requestAnimationFrame(() => {
        this.headingRef.current?.focus({ preventScroll: true });
      });
    }
  }

  componentWillUnmount() {
    if (this.focusFrame !== undefined) {
      window.cancelAnimationFrame(this.focusFrame);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <>
        <SEO
          title="خطا در نمایش صفحه"
          description="نمایش این صفحه با خطای موقت روبه‌رو شد."
          noIndex
        />
        <section className="section-padding flex min-h-[65vh] items-center bg-gradient-to-b from-destructive/5 to-background">
          <div className="container-custom">
            <div className="mx-auto max-w-2xl rounded-3xl border border-destructive/25 bg-card p-8 text-center shadow-card md:p-12" role="alert" aria-labelledby="route-error-title">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle size={42} aria-hidden="true" />
              </div>
              <h1
                ref={this.headingRef}
                id="route-error-title"
                tabIndex={-1}
                className="heading-2 mb-4 text-foreground outline-none"
              >
                نمایش صفحه با مشکل روبه‌رو شد
              </h1>
              <p className="mx-auto mb-8 max-w-lg leading-8 text-muted-foreground">
                اطلاعات سبد و حساب شما پاک نشده است. صفحه را دوباره بارگذاری کنید یا از مسیرهای اصلی سایت ادامه دهید.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3"
                >
                  <RefreshCcw size={18} aria-hidden="true" />
                  بارگذاری دوباره
                </button>
                <Link
                  to="/"
                  className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3"
                >
                  <Home size={18} aria-hidden="true" />
                  صفحه اصلی
                </Link>
                <Link
                  to="/products"
                  className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3"
                >
                  <ShoppingBag size={18} aria-hidden="true" />
                  محصولات
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export const RouteErrorBoundary = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return (
    <RouteBoundaryCore resetKey={`${location.pathname}${location.search}`}>
      {children}
    </RouteBoundaryCore>
  );
};
