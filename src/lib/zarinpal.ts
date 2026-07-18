const MERCHANT_ID = import.meta.env.VITE_ZARINPAL_MERCHANT_ID || "";
const SANDBOX = import.meta.env.VITE_ZARINPAL_SANDBOX === "true";
const BASE_URL = SANDBOX
  ? "https://sandbox.zarinpal.com/pg/v4/payment"
  : "https://api.zarinpal.com/pg/v4/payment";

export interface PaymentRequestResult {
  success: boolean;
  authority?: string;
  paymentUrl?: string;
  error?: string;
}

export interface PaymentVerifyResult {
  success: boolean;
  refId?: string;
  error?: string;
}

export const isSimulationMode = () => !MERCHANT_ID || MERCHANT_ID.length < 10;

export const requestPayment = async (params: {
  orderId: string;
  amountToman: number;
  description: string;
  mobile: string;
  callbackUrl: string;
}): Promise<PaymentRequestResult> => {
  if (isSimulationMode()) {
    const authority = "SIM-" + Date.now();
    const sep = params.callbackUrl.includes("?") ? "&" : "?";
    return {
      success: true,
      authority,
      paymentUrl: `${params.callbackUrl}${sep}status=paid&Authority=${authority}`,
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: params.amountToman * 10,
        description: params.description,
        callback_url: params.callbackUrl,
        metadata: { mobile: params.mobile },
      }),
    });
    const data = await res.json();
    if (data.data?.code === 100) {
      const authority = data.data.authority;
      const payBase = SANDBOX
        ? "https://sandbox.zarinpal.com/pg/StartPay/"
        : "https://www.zarinpal.com/pg/StartPay/";
      return { success: true, authority, paymentUrl: payBase + authority };
    }
    return {
      success: false,
      error: "خطا در اتصال به درگاه پرداخت. کد: " + (data.errors?.code || "نامشخص"),
    };
  } catch {
    return { success: false, error: "عدم اتصال به درگاه پرداخت. لطفاً دوباره تلاش کنید." };
  }
};

export const verifyPayment = async (params: {
  authority: string;
  amountToman: number;
}): Promise<PaymentVerifyResult> => {
  if (isSimulationMode()) {
    return { success: true, refId: "SIM-REF-" + Date.now() };
  }
  try {
    const res = await fetch(`${BASE_URL}/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: params.amountToman * 10,
        authority: params.authority,
      }),
    });
    const data = await res.json();
    if (data.data?.code === 100 || data.data?.code === 101) {
      return { success: true, refId: String(data.data.ref_id) };
    }
    return { success: false, error: "پرداخت تأیید نشد." };
  } catch {
    return { success: false, error: "خطا در تأیید پرداخت." };
  }
};
