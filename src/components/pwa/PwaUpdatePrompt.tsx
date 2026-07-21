import { useEffect, useRef, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { SERVICE_WORKER_UPDATE_EVENT } from "@/lib/registerServiceWorker";

export const PwaUpdatePrompt = () => {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const updateRequestedRef = useRef(false);

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<ServiceWorkerRegistration>;
      setRegistration(customEvent.detail);
    };

    window.addEventListener(SERVICE_WORKER_UPDATE_EVENT, handleUpdate);
    return () =>
      window.removeEventListener(SERVICE_WORKER_UPDATE_EVENT, handleUpdate);
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleControllerChange = () => {
      if (updateRequestedRef.current) window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );

    return () =>
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
  }, []);

  if (!registration?.waiting) return null;

  const applyUpdate = () => {
    const waitingWorker = registration.waiting;
    if (!waitingWorker) return;

    updateRequestedRef.current = true;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  };

  return (
    <div
      className="fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-xl rounded-2xl border border-primary/20 bg-card p-4 shadow-2xl"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <RefreshCw size={19} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">نسخه جدید سایت آماده است</p>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            برای دریافت آخرین اصلاحات و فایل‌های بهینه‌شده، سایت را به‌روزرسانی کنید.
          </p>
          <button
            type="button"
            onClick={applyUpdate}
            className="btn-primary mt-3 min-h-10 rounded-xl px-4 py-2 text-sm font-bold"
          >
            به‌روزرسانی سایت
          </button>
        </div>
        <button
          type="button"
          onClick={() => setRegistration(null)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="بستن پیام به‌روزرسانی"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
