import { useEffect, useRef, useState } from "react";
import { Instagram, MessageCircle, Send, X } from "lucide-react";
import { useLocation } from "react-router";
import { useStorefrontSettings } from "@/hooks/useStorefrontSettings";
import { matchesRoutePrefix } from "@/lib/accessibility/navigation";

const hiddenPrefixes = ["/cart", "/checkout", "/payment"];

export const FloatingWhatsApp = () => {
  const location = useLocation();
  const { settings } = useStorefrontSettings();
  const [isOpen, setIsOpen] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const shouldHide = hiddenPrefixes.some((prefix) =>
    matchesRoutePrefix(location.pathname, prefix),
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!launcherRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (shouldHide) return null;

  const telegramIsReady =
    settings.contact.telegramEnabled && Boolean(settings.contact.telegramUrl);

  return (
    <div
      ref={launcherRef}
      className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+6.15rem)] left-4 z-40 flex flex-col items-start gap-3 sm:left-6 md:bottom-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]"
    >
      {isOpen && (
        <div
          id="support-contact-menu"
          className="grid min-w-52 gap-2 rounded-3xl border border-border/80 bg-background/95 p-3 shadow-2xl backdrop-blur-2xl"
          role="menu"
          aria-label="راه‌های ارباط با پشتیبانی"
        >
          <a
            href={settings.contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="flex min-h-12 items-center gap-3 rounded-2xl px-3 font-bold text-foreground transition hover:bg-secondary"
            onClick={() => setIsOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-fuchsia-500 to-violet-600 text-white">
              <Instagram size={19} aria-hidden="true" />
            </span>
            اینستاگرام
          </a>

          <a
            href={settings.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="flex min-h-12 items-center gap-3 rounded-2xl px-3 font-bold text-foreground transition hover:bg-secondary"
            onClick={() => setIsOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-whatsapp text-white">
              <MessageCircle size={19} aria-hidden="true" />
            </span>
            واتساپ
          </a>

          {telegramIsReady ? (
            <a
              href={settings.contact.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="flex min-h-12 items-center gap-3 rounded-2xl px-3 font-bold text-foreground transition hover:bg-secondary"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white">
                <Send size={18} aria-hidden="true" />
              </span>
              تلگرام
            </a>
          ) : (
            <div
              role="menuitem"
              aria-disabled="true"
              className="flex min-h-12 cursor-not-allowed items-center gap-3 rounded-2xl px-3 font-bold text-muted-foreground opacity-60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/70 text-white">
                <Send size={18} aria-hidden="true" />
              </span>
              <span className="flex flex-1 items-center justify-between gap-3">
                تلگرام
                <small className="text-[10px] font-medium">در حال تکمیل</small>
              </span>
            </div>
          )}
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="touch-target flex items-center justify-center gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-xl transition-transform hover:scale-[1.03] sm:px-5"
        aria-label={
          isOpen
            ? "بستن راه‌های ارتباط با پشتیبانی"
            : "نمایش راه‌های ارتباط با پشتیبانی"
        }
        aria-expanded={isOpen}
        aria-controls="support-contact-menu"
        aria-haspopup="menu"
      >
        {isOpen ? (
          <X size={22} aria-hidden="true" />
        ) : (
          <MessageCircle size={22} aria-hidden="true" />
        )}
        <span className="hidden font-bold sm:inline">
          {isOpen ? "بستن" : "ارتباط با پشتیبانی"}
        </span>
      </button>
    </div>
  );
};
