import { useEffect, useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";

const getOnlineState = () =>
  typeof navigator === "undefined" ? true : navigator.onLine;

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(getOnlineState);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className="sticky top-0 z-[70] border-b border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="container-custom flex flex-col items-center justify-between gap-3 px-0 sm:flex-row">
        <div className="flex items-start gap-2 text-sm leading-7">
          <WifiOff className="mt-1 shrink-0" size={18} aria-hidden="true" />
          <span>
            اتصال اینترنت قطع است. صفحات و فایل‌های ذخیره‌شده ممکن است باز شوند، اما موجودی، ورود و پرداخت نیازمند اتصال دوباره هستند.
          </span>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-400 bg-white px-4 py-2 text-sm font-bold transition hover:bg-amber-100"
        >
          <RefreshCw size={16} aria-hidden="true" />
          تلاش دوباره
        </button>
      </div>
    </div>
  );
};
