import { apiRequest } from "@/lib/api";

export interface PushPreferences {
  supported: boolean;
  subscribed: boolean;
  transactionalEnabled: boolean;
  marketingEnabled: boolean;
}

interface PushCapabilities {
  supported: boolean;
  publicKey: string | null;
  marketingDefault: false;
}

const GUEST_TOKEN_KEY = "winimi.push.guest-token.v1";

export const isBrowserWebPushSupported = () =>
  typeof window !== "undefined" &&
  window.isSecureContext &&
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "PushManager" in window;

const ensureBrowserWebPushSupport = () => {
  if (!isBrowserWebPushSupported()) {
    throw new Error("اعلان مرورگر در این مرورگر یا دستگاه پشتیبانی نمی‌شود.");
  }
};

const getGuestToken = () => {
  const existing = localStorage.getItem(GUEST_TOKEN_KEY);
  if (existing) return existing;
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const value = btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  localStorage.setItem(GUEST_TOKEN_KEY, value);
  return value;
};

const decodeVapidKey = (value: string) => {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replaceAll("-", "+").replaceAll("_", "/");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
};

export const getPushPreferences = async () =>
  (await apiRequest<{ push: PushPreferences }>("/api/account/push/preferences"))
    .data.push;

export const enableWebPush = async (): Promise<PushPreferences> => {
  ensureBrowserWebPushSupport();

  const capability = (
    await apiRequest<PushCapabilities>("/api/push/capabilities")
  ).data;
  if (!capability.supported || !capability.publicKey) {
    throw new Error("اعلان مرورگر هنوز برای فروشگاه فعال نشده است.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("اجازه نمایش اعلان داده نشد.");
  }

  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decodeVapidKey(capability.publicKey),
    }));
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) {
    throw new Error("اطلاعات اشتراک اعلان ناقص است.");
  }

  await apiRequest("/api/account/push/subscriptions", {
    method: "POST",
    body: {
      endpoint: json.endpoint,
      keys: json.keys,
      contentEncoding: "aes128gcm",
      transactionalEnabled: true,
      marketingEnabled: true,
    },
  });
  return getPushPreferences();
};

export const disableWebPush = async (): Promise<PushPreferences> => {
  ensureBrowserWebPushSupport();
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await apiRequest("/api/account/push/subscriptions", {
      method: "DELETE",
      body: { endpoint: subscription.endpoint },
    });
    await subscription.unsubscribe();
  }
  return getPushPreferences();
};

export const updatePushPreferences = async (
  transactionalEnabled: boolean,
  marketingEnabled: boolean,
) =>
  (
    await apiRequest<{ push: PushPreferences }>("/api/account/push/preferences", {
      method: "PATCH",
      body: { transactionalEnabled, marketingEnabled },
    })
  ).data.push;

export const enableGuestWebPush = async () => {
  ensureBrowserWebPushSupport();
  const capability = (
    await apiRequest<PushCapabilities>("/api/push/capabilities")
  ).data;
  if (!capability.supported || !capability.publicKey) {
    throw new Error("اعلان فروشگاه هنوز فعال نشده است.");
  }
  if (await Notification.requestPermission() !== "granted") {
    throw new Error("اجازه نمایش اعلان داده نشد.");
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription =
    (await registration.pushManager.getSubscription()) ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decodeVapidKey(capability.publicKey),
    }));
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) {
    throw new Error("اطلاعات اشتراک اعلان ناقص است.");
  }
  await apiRequest("/api/push/subscriptions", {
    method: "POST",
    body: {
      guestToken: getGuestToken(),
      endpoint: json.endpoint,
      keys: json.keys,
      contentEncoding: "aes128gcm",
      marketingEnabled: true,
    },
  });
};
