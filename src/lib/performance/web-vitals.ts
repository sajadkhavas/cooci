export type CoreWebVitalName = "LCP" | "INP" | "CLS";
export type CoreWebVitalRating = "good" | "needs-improvement" | "poor";

export const CORE_WEB_VITAL_THRESHOLDS = {
  LCP: { good: 2_500, poor: 4_000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
} as const;

export interface CoreWebVitalPayload {
  name: CoreWebVitalName;
  value: number;
  rating: CoreWebVitalRating;
  route: string;
  navigationType: string;
  viewport: { width: number; height: number };
  pageId: string;
  recordedAt: string;
}

export const rateCoreWebVital = (
  name: CoreWebVitalName,
  value: number,
): CoreWebVitalRating => {
  const threshold = CORE_WEB_VITAL_THRESHOLDS[name];
  if (value <= threshold.good) return "good";
  if (value > threshold.poor) return "poor";
  return "needs-improvement";
};

export const selectInpValue = (durations: number[]) => {
  const valid = durations.filter(
    (duration) => Number.isFinite(duration) && duration >= 0,
  );
  if (!valid.length) return undefined;

  const descending = [...valid].sort((first, second) => second - first);
  const ignoredWorstCount = Math.floor(descending.length / 50);
  return descending[Math.min(ignoredWorstCount, descending.length - 1)];
};

const createPageId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

const getNavigationType = () => {
  const navigation = performance.getEntriesByType(
    "navigation",
  )[0] as PerformanceNavigationTiming | undefined;
  return navigation?.type || "navigate";
};

const sendPayload = (payload: CoreWebVitalPayload) => {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const accepted = navigator.sendBeacon(
      "/__web_vitals",
      new Blob([body], { type: "application/json" }),
    );
    if (accepted) return;
  }

  void fetch("/__web_vitals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => undefined);
};

export const observeCoreWebVitals = () => {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return () => undefined;
  }

  const pageId = createPageId();
  let lcpValue: number | undefined;
  let clsValue = 0;
  const interactionDurations = new Map<number, number>();
  const observers: PerformanceObserver[] = [];
  let reported = false;

  const observe = (
    type: string,
    callback: (entries: PerformanceEntry[]) => void,
    options: PerformanceObserverInit = { type, buffered: true },
  ) => {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe(options);
      observers.push(observer);
    } catch {
      // Individual performance entry types are optional across browsers.
    }
  };

  observe("largest-contentful-paint", (entries) => {
    const last = entries.at(-1);
    if (last && Number.isFinite(last.startTime)) lcpValue = last.startTime;
  });

  observe("layout-shift", (entries) => {
    for (const entry of entries) {
      const layoutShift = entry as PerformanceEntry & {
        value?: number;
        hadRecentInput?: boolean;
      };
      if (
        !layoutShift.hadRecentInput &&
        typeof layoutShift.value === "number" &&
        Number.isFinite(layoutShift.value)
      ) {
        clsValue += layoutShift.value;
      }
    }
  });

  observe(
    "event",
    (entries) => {
      for (const entry of entries) {
        const eventEntry = entry as PerformanceEntry & {
          duration: number;
          interactionId?: number;
        };
        if (!eventEntry.interactionId || !Number.isFinite(eventEntry.duration)) {
          continue;
        }
        interactionDurations.set(
          eventEntry.interactionId,
          Math.max(
            interactionDurations.get(eventEntry.interactionId) ?? 0,
            eventEntry.duration,
          ),
        );
      }
    },
    { type: "event", buffered: true, durationThreshold: 40 } as PerformanceObserverInit,
  );

  const report = () => {
    if (reported) return;
    reported = true;

    const route = `${window.location.pathname}${window.location.search}`;
    const common = {
      route,
      navigationType: getNavigationType(),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      pageId,
      recordedAt: new Date().toISOString(),
    };
    const metrics: Array<[CoreWebVitalName, number | undefined]> = [
      ["LCP", lcpValue],
      ["CLS", Number(clsValue.toFixed(4))],
      ["INP", selectInpValue(Array.from(interactionDurations.values()))],
    ];

    for (const [name, value] of metrics) {
      if (value === undefined || !Number.isFinite(value)) continue;
      sendPayload({
        ...common,
        name,
        value: Number(value.toFixed(name === "CLS" ? 4 : 1)),
        rating: rateCoreWebVital(name, value),
      });
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") report();
  };
  document.addEventListener("visibilitychange", handleVisibilityChange, {
    passive: true,
  });
  window.addEventListener("pagehide", report, { passive: true });

  return () => {
    observers.forEach((observer) => observer.disconnect());
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("pagehide", report);
  };
};
