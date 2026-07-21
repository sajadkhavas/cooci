import type {
  BackendOrder,
  BackendPaymentAttempt,
  BackendPaymentVerificationResult,
} from "@/lib/backend-contract";

const ZARINPAL_HOSTS = new Set([
  "zarinpal.com",
  "www.zarinpal.com",
  "payment.zarinpal.com",
  "sandbox.zarinpal.com",
]);

const MAX_REDIRECT_URL_LENGTH = 2_048;

export const resolveSafePaymentRedirect = (
  rawUrl: string | null | undefined,
  {
    frontendOrigin,
    allowDevelopmentRoutes = false,
  }: {
    frontendOrigin: string;
    allowDevelopmentRoutes?: boolean;
  },
): string | null => {
  const candidate = rawUrl?.trim();
  if (!candidate || candidate.length > MAX_REDIRECT_URL_LENGTH) return null;

  let frontend: URL;
  let parsed: URL;
  try {
    frontend = new URL(frontendOrigin);
    parsed = new URL(candidate, frontend);
  } catch {
    return null;
  }

  if (
    parsed.username ||
    parsed.password ||
    parsed.hash ||
    !["http:", "https:"].includes(parsed.protocol)
  ) {
    return null;
  }

  if (parsed.origin === frontend.origin) {
    const allowedPath = parsed.pathname === "/payment/callback" ||
      (allowDevelopmentRoutes && parsed.pathname === "/payment/mock");
    return allowedPath ? parsed.toString() : null;
  }

  if (
    parsed.protocol !== "https:" ||
    !ZARINPAL_HOSTS.has(parsed.hostname.toLowerCase()) ||
    !parsed.pathname.toLowerCase().startsWith("/pg/startpay/")
  ) {
    return null;
  }

  return parsed.toString();
};

export const isVerifiedBackendPayment = ({
  verified,
  order,
  payment,
}: BackendPaymentVerificationResult) =>
  verified === true &&
  order.paymentStatus === "paid" &&
  payment.status === "verified" &&
  Boolean(payment.referenceId?.trim()) &&
  payment.amountToman === order.totals.grandTotalToman;

export const deriveBackendPaymentState = ({
  verified,
  order,
  payment,
}: BackendPaymentVerificationResult): "success" | "failed" | "cancelled" | "unknown" => {
  if (isVerifiedBackendPayment({ verified, order, payment })) return "success";
  if (verified || order.paymentStatus === "paid" || payment.status === "verified") {
    return "unknown";
  }
  if (payment.status === "cancelled") return "cancelled";
  if (payment.status === "failed" || payment.status === "expired") return "failed";
  return "unknown";
};

export const canRetryPayment = (order: Pick<BackendOrder, "status" | "paymentStatus">) =>
  order.status === "awaiting_payment" && order.paymentStatus !== "paid";

export const hasConsistentVerifiedAttempt = (
  order: Pick<BackendOrder, "paymentStatus" | "totals">,
  payment: Pick<BackendPaymentAttempt, "status" | "referenceId" | "amountToman">,
) =>
  order.paymentStatus === "paid" &&
  payment.status === "verified" &&
  Boolean(payment.referenceId?.trim()) &&
  payment.amountToman === order.totals.grandTotalToman;
