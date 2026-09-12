import { useEffect, useState } from "react";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";

type ConsentChoice = "granted" | "denied" | null;
const STORAGE_KEY = "winimi-analytics-consent-v1";

const readChoice = (): ConsentChoice => {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
};

export const AnalyticsConsent = () => {
  const { payload } = useStorefrontSettings();
  const settings = payload?.settings ?? {};
  const enabled = settings["consent.analytics_enabled"] === true;
  const mode = settings["integrations.google_tag_mode"];
  const tagId = settings["integrations.google_tag_id"];
  const [choice, setChoice] = useState<ConsentChoice>(readChoice);

  const configured = enabled && typeof tagId === "string" && (
    (mode === "gtag" && /^G-[A-Z0-9]+$/i.test(tagId)) ||
    (mode === "gtm" && /^GTM-[A-Z0-9]+$/i.test(tagId))
  );

  useEffect(() => {
    if (!configured || choice === null) return;

    const win = window as typeof window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };

    win.dataLayer = win.dataLayer ?? [];

    win.gtag =
      win.gtag ??
      function (...args: unknown[]) {
        win.dataLayer?.push(args);
      };

    const granted = choice === "granted";

    win.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: granted ? "granted" : "denied",
    });

    if (granted && mode === "gtag") {
      win.gtag("event", "page_view", {
        send_to: tagId,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [choice, configured, mode, tagId]);

  if (!configured || choice !== null) return null;
  const decide = (next: Exclude<ConsentChoice, null>) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setChoice(next);
  };

  return (
    <aside className="fixed bottom-24 left-4 right-4 z-[90] mx-auto max-w-xl rounded-3xl border border-[#27390c]/15 bg-white p-5 text-[#27390c] shadow-2xl md:bottom-6" role="dialog" aria-label="تنظیمات حریم خصوصی">
      <strong className="text-base font-black">{String(settings["consent.title"] || "تنظیمات حریم خصوصی")}</strong>
      <p className="mt-2 text-sm leading-7 text-[#27390c]/70">{String(settings["consent.description"] || "اندازه‌گیری بازدید فقط با انتخاب شما فعال می‌شود.")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-full bg-[#d0e596] px-5 py-2.5 text-sm font-black" onClick={() => decide("granted")}>{String(settings["consent.accept_label"] || "اجازه اندازه‌گیری")}</button>
        <button className="rounded-full border border-[#27390c]/20 px-5 py-2.5 text-sm font-black" onClick={() => decide("denied")}>{String(settings["consent.reject_label"] || "فعلاً نه")}</button>
      </div>
    </aside>
  );
};
