import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  disableWebPush,
  enableWebPush,
  getPushPreferences,
  updatePushPreferences,
  type PushPreferences,
} from "@/lib/web-push";

export const PushNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<PushPreferences>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    getPushPreferences()
      .then((value) => active && setPreferences(value))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  if (!preferences?.supported) return null;

  const run = async (action: () => Promise<PushPreferences>, message: string) => {
    setBusy(true);
    try {
      setPreferences(await action());
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تغییر تنظیمات اعلان ناموفق بود.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mb-8 rounded-3xl border border-primary/20 bg-card p-6 shadow-soft" aria-labelledby="push-title">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {preferences.subscribed ? <Bell size={21} aria-hidden="true" /> : <BellOff size={21} aria-hidden="true" />}
          </div>
          <div>
            <h2 id="push-title" className="text-lg font-black">اعلان وضعیت سفارش</h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              فقط با انتخاب شما فعال می‌شود و اطلاعات حساس در متن اعلان نمایش داده نمی‌شود.
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void run(
            preferences.subscribed ? disableWebPush : enableWebPush,
            preferences.subscribed ? "اعلان مرورگر غیرفعال شد" : "اعلان وضعیت سفارش فعال شد",
          )}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {preferences.subscribed ? "غیرفعال‌کردن" : "فعال‌کردن اعلان"}
        </button>
      </div>

      {preferences.subscribed && (
        <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-muted/50 p-4 text-sm">
          <span>
            <strong className="block">پیشنهادها و خبرهای وینیمی</strong>
            <span className="mt-1 block text-xs text-muted-foreground">اختیاری و مستقل از اعلان‌های ضروری سفارش</span>
          </span>
          <input
            type="checkbox"
            checked={preferences.marketingEnabled}
            disabled={busy}
            onChange={(event) => void run(
              () => updatePushPreferences(true, event.target.checked),
              "تنظیمات اعلان ذخیره شد",
            )}
            className="h-5 w-5 accent-primary"
          />
        </label>
      )}
    </section>
  );
};
