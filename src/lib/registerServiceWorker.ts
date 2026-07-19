export const SERVICE_WORKER_UPDATE_EVENT = "winimi:service-worker-update";

const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

export const registerServiceWorker = () => {
  if (
    import.meta.env.DEV ||
    !("serviceWorker" in navigator) ||
    !window.isSecureContext
  ) {
    return;
  }

  window.addEventListener("load", () => {
    void navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        if (registration.waiting) {
          window.dispatchEvent(
            new CustomEvent(SERVICE_WORKER_UPDATE_EVENT, {
              detail: registration,
            }),
          );
        }

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;

          worker.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              window.dispatchEvent(
                new CustomEvent(SERVICE_WORKER_UPDATE_EVENT, {
                  detail: registration,
                }),
              );
            }
          });
        });

        window.setInterval(() => {
          if (navigator.onLine) void registration.update();
        }, UPDATE_INTERVAL_MS);
      })
      .catch((error: unknown) => {
        console.warn("Service worker registration failed", error);
      });
  });
};
