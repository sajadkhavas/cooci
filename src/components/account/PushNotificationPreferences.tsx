import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  disableWebPush,
  enableWebPush,
  getPushPreferences,
  isBrowserWebPushSupported,
  type PushPreferences,
} from "@/lib/web-push";

export const PushNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<PushPreferences>();
  const [browserSupported, setBrowserSupported] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supported = isBrowserWebPushSupported();
    setBrowserSupported(supported);
    if (!supported) return undefined;

    let active = true;
    getPushPreferences()
      .then((value) => active && setPreferences(value))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  if (!browserSupported || !preferences?.supported) return null;

  const run = async (action: () => Promise<PushPreferences>, message: string) => {
    setBusy(true);
    try {
      setPreferences(await action());
      toast.success(message);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "تغییر تنظیمات اعلان ناموفق بود.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      className="mb-8 rounded-3xl border border-primary/20 bg-card p-6 shadow-soft"
      aria-labelledby="push-title"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {preferences.subscribed ? (
              <Bell size={21} aria-hidden="true" />
            ) : (
              <BellOff size={21} aria-hidden="true" />
            )}
          </div>
          <div>
            <h2 id="push-title" className="text-lg font-black">
              اعلان‌های وینیمی
            </h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              با انتخاب شما، اعلان‌های سفارش، خبرها و پیام‌های مدیر روی همین مرورگر و دستگاه فعال می‌شوند؛ نصب وب‌اپ شرط این قابلیت نیست.
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void run(
              preferences.subscribed ? disableWebPush : enableWebPush,
              preferences.subscribed
                ? "اعلان مرورگر غیرفعال شد"
                : "اعلان‌های وینیمی فعال شد",
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {preferences.subscribed ? "غیرفعال‌کردن" : "فعال‌کردن اعلان"}
        </button>
      </div>
    </section>
  );
};
