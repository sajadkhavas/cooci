import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);

export const PwaInstallPrompt = () => {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const { content } = useStorefrontSettings();

  useEffect(() => {
    if (isStandalone()) return undefined;
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => setPromptEvent(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!promptEvent || dismissed) return null;

  return (
    <aside className="fixed bottom-24 left-3 right-3 z-[64] mx-auto max-w-md rounded-2xl border border-[#91b33f]/35 bg-white p-4 text-[#111] shadow-xl md:bottom-5" aria-label="نصب وب‌اپ وینیمی">
      <button type="button" onClick={() => setDismissed(true)} className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5" aria-label="بستن پیشنهاد نصب">
        <X size={17} aria-hidden="true" />
      </button>
      <div className="pl-8">
        <strong className="block text-sm font-black">{content.appUi.installTitle}</strong>
        <p className="mt-1 text-xs leading-6 text-black/65">{content.appUi.installDescription}</p>
        <button
          type="button"
          onClick={() => void (async () => {
            await promptEvent.prompt();
            const choice = await promptEvent.userChoice;
            if (choice.outcome === "accepted") setPromptEvent(null);
          })()}
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#d0e596] px-4 text-sm font-black text-[#111]"
        >
          <Download size={17} aria-hidden="true" />
          {content.appUi.installAction}
        </button>
      </div>
    </aside>
  );
};
