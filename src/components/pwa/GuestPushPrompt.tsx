import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  enableGuestWebPush,
  isBrowserWebPushSupported,
} from "@/lib/web-push";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";

const DISMISSED_KEY = "winimi.push.prompt-dismissed.v1";

export const GuestPushPrompt = () => {
  const { isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const { content } = useStorefrontSettings();

  useEffect(() => {
    if (
      isAuthenticated ||
      !isBrowserWebPushSupported() ||
      Notification.permission === "denied"
    ) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(
      () => setVisible(localStorage.getItem(DISMISSED_KEY) !== "true"),
      12000,
    );
    return () => window.clearTimeout(timer);
  }, [isAuthenticated]);

  if (!visible) return null;

  return (
    <aside
      className="fixed bottom-24 left-3 z-[63] max-w-sm rounded-2xl border border-[#91b33f]/35 bg-white p-4 text-black shadow-xl md:bottom-5"
      aria-label="فعال‌سازی اعلان‌های وینیمی"
    >
      <button
        type="button"
        className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
        aria-label="بستن"
        onClick={() => {
          localStorage.setItem(DISMISSED_KEY, "true");
          setVisible(false);
        }}
      >
        <X size={17} aria-hidden="true" />
      </button>
      <div className="pl-8">
        <strong className="flex items-center gap-2 text-sm font-black">
          <Bell size={18} aria-hidden="true" />
          {content.appUi.pushTitle}
        </strong>
        <p className="mt-2 text-xs leading-6 text-black/65">
          {content.appUi.pushDescription}
        </p>
        <button
          type="button"
          disabled={busy}
          className="mt-3 min-h-11 rounded-xl bg-[#d0e596] px-4 text-sm font-black disabled:opacity-50"
          onClick={() =>
            void (async () => {
              setBusy(true);
              try {
                await enableGuestWebPush();
                toast.success("اعلان‌ها فعال شد");
                setVisible(false);
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "فعال‌سازی اعلان ناموفق بود",
                );
              } finally {
                setBusy(false);
              }
            })()
          }
        >
          {busy ? "در حال فعال‌سازی…" : content.appUi.pushAction}
        </button>
      </div>
    </aside>
  );
};
