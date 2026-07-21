import { z } from "zod";

const safeIdentifier = z
  .string()
  .trim()
  .min(1)
  .max(180)
  .refine(
    (value) =>
      !value.startsWith("//") &&
      ![...value].some((character) => {
        const code = character.charCodeAt(0);
        return (
          character === "/" ||
          character === "\\" ||
          character === "?" ||
          character === "#" ||
          code <= 31 ||
          code === 127
        );
      }),
    "unsafe identifier",
  );

const nullableText = (maximum: number) =>
  z.string().max(maximum).nullable();
const nullableIsoDate = z.string().datetime({ offset: true }).nullable();
const money = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);

export const backendOrderStatusSchema = z.enum([
  "awaiting_payment",
  "paid",
  "confirmed",
  "preparing",
  "ready",
  "dispatched",
  "delivered",
  "cancelled",
  "expired",
]);

export const backendPaymentStatusSchema = z.enum([
  "unpaid",
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const backendPaymentAttemptStatusSchema = z.enum([
  "initiated",
  "pending",
  "verified",
  "failed",
  "cancelled",
  "expired",
]);

export const backendPaymentAttemptSchema = z
  .object({
    id: safeIdentifier,
    provider: z.string().trim().min(1).max(80),
    attemptNumber: z.number().int().positive().max(10_000),
    status: backendPaymentAttemptStatusSchema,
    statusLabel: z.string().max(160),
    amountToman: money,
    currency: z.string().trim().min(1).max(16),
    authority: nullableText(255),
    referenceId: nullableText(255),
    gatewayCode: z.union([z.string().max(100), z.number()]).nullable(),
    redirectUrl: nullableText(2_048),
    failure: z
      .object({
        code: nullableText(160),
        message: nullableText(2_000),
      })
      .nullable(),
    expiresAt: nullableIsoDate,
    verifiedAt: nullableIsoDate,
    createdAt: nullableIsoDate,
  })
  .superRefine((payment, context) => {
    if (
      payment.status === "verified" &&
      (!payment.referenceId?.trim() || !payment.verifiedAt)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "verified payment lacks reference or verification timestamp",
      });
    }
    if (
      ["failed", "cancelled", "expired"].includes(payment.status) &&
      payment.referenceId
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "failed payment cannot expose a verified reference",
      });
    }
  });

export const backendOrderItemSchema = z
  .object({
    id: safeIdentifier,
    productId: safeIdentifier,
    variantId: safeIdentifier,
    productName: z.string().trim().min(1).max(255),
    variantName: z.string().trim().min(1).max(255),
    productCode: z.string().trim().min(1).max(160),
    sku: z.string().trim().min(1).max(160),
    weightGrams: z.number().int().nonnegative().nullable(),
    requiresCooling: z.boolean(),
    unitPriceToman: money,
    quantity: z.number().int().positive().max(1_000),
    lineTotalToman: money,
  })
  .superRefine((item, context) => {
    if (item.lineTotalToman !== item.unitPriceToman * item.quantity) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lineTotalToman"],
        message: "line total does not match unit price and quantity",
      });
    }
  });

export const backendOrderSchema = z
  .object({
    id: safeIdentifier,
    number: z.string().trim().min(1).max(160),
    status: backendOrderStatusSchema,
    statusLabel: z.string().max(160),
    paymentStatus: backendPaymentStatusSchema,
    paymentStatusLabel: z.string().max(160),
    delivery: z.object({
      method: z.enum(["standard", "chilled", "pickup"]),
      methodLabel: z.string().max(160),
      requiresCooling: z.boolean(),
      feeToman: money,
      zone: z
        .object({
          id: safeIdentifier,
          name: z.string().trim().min(1).max(160),
        })
        .nullable(),
    }),
    totals: z.object({
      subtotalToman: money,
      deliveryFeeToman: money,
      packagingFeeToman: money,
      discountToman: money,
      grandTotalToman: money,
    }),
    itemCount: z.number().int().nonnegative().max(100_000),
    preparationTimeDays: z.number().int().nonnegative().max(365),
    preparation: z.object({
      minDays: z.number().int().nonnegative().max(365),
      maxDays: z.number().int().nonnegative().max(365),
    }),
    recipient: z.object({
      fullName: z.string().trim().min(1).max(160),
      mobile: z.string().trim().min(1).max(32),
      province: nullableText(160),
      city: nullableText(160),
      address: nullableText(2_000),
      postalCode: nullableText(32),
      notes: nullableText(2_000),
    }),
    fulfillment: z.object({
      trackingCode: nullableText(255),
      confirmedAt: nullableIsoDate,
      preparingAt: nullableIsoDate,
      readyAt: nullableIsoDate,
      dispatchedAt: nullableIsoDate,
      deliveredAt: nullableIsoDate,
    }),
    items: z.array(backendOrderItemSchema).max(100),
    payments: z.array(backendPaymentAttemptSchema).max(100),
    timeline: z
      .array(
        z.object({
          from: backendOrderStatusSchema.nullable(),
          to: backendOrderStatusSchema,
          label: z.string().max(160),
          createdAt: nullableIsoDate,
        }),
      )
      .max(100),
    reservationExpiresAt: nullableIsoDate,
    canCancel: z.boolean(),
    placedAt: nullableIsoDate,
    paidAt: nullableIsoDate,
    cancelledAt: nullableIsoDate,
    createdAt: nullableIsoDate,
  })
  .superRefine((order, context) => {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.lineTotalToman,
      0,
    );
    const expectedTotal =
      order.totals.subtotalToman +
      order.totals.deliveryFeeToman +
      order.totals.packagingFeeToman -
      order.totals.discountToman;

    if (order.itemCount !== itemCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["itemCount"],
        message: "item count does not match order items",
      });
    }
    if (order.totals.subtotalToman !== subtotal) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["totals", "subtotalToman"],
        message: "subtotal does not match order items",
      });
    }
    if (order.delivery.feeToman !== order.totals.deliveryFeeToman) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["delivery", "feeToman"],
        message: "delivery fee is inconsistent",
      });
    }
    if (order.totals.grandTotalToman !== expectedTotal) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["totals", "grandTotalToman"],
        message: "grand total is inconsistent",
      });
    }
    if (order.preparation.minDays > order.preparation.maxDays) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["preparation"],
        message: "preparation range is inverted",
      });
    }
    if (
      order.canCancel &&
      !(
        order.status === "awaiting_payment" &&
        ["unpaid", "failed"].includes(order.paymentStatus)
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["canCancel"],
        message: "cancellation boundary is inconsistent",
      });
    }

    const verifiedAttempts = order.payments.filter(
      (payment) => payment.status === "verified",
    );
    if (
      order.paymentStatus === "paid" &&
      !verifiedAttempts.some(
        (payment) =>
          payment.referenceId?.trim() &&
          payment.amountToman === order.totals.grandTotalToman,
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paymentStatus"],
        message: "paid order lacks a matching verified payment",
      });
    }
  });

export const backendDeliveryOptionsSchema = z.object({
  zone: z
    .object({
      id: safeIdentifier,
      name: z.string().trim().min(1).max(160),
      minimumOrderToman: money.nullable(),
      freeDeliveryThresholdToman: money.nullable(),
      packagingFeeToman: money,
      preparation: z.object({
        minDays: z.number().int().nonnegative().max(365),
        maxDays: z.number().int().nonnegative().max(365),
      }),
    })
    .nullable(),
  methods: z
    .array(
      z.object({
        method: z.enum(["standard", "chilled", "pickup"]),
        label: z.string().max(160),
        enabled: z.boolean(),
        feeToman: money,
      }),
    )
    .max(10),
});

export const backendCheckoutResultSchema = z.object({
  order: backendOrderSchema,
  payment: z.object({
    available: z.boolean(),
    state: z.enum(["ready", "disabled"]),
    initiationEndpoint: z.string().max(500).nullable(),
  }),
});

export const backendPaymentInitiationResultSchema = z
  .object({
    order: backendOrderSchema,
    payment: backendPaymentAttemptSchema,
  })
  .superRefine((result, context) => {
    if (result.payment.amountToman !== result.order.totals.grandTotalToman) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["payment", "amountToman"],
        message: "payment amount does not match order total",
      });
    }
  });

export const backendPaymentVerificationResultSchema = z
  .object({
    verified: z.boolean(),
    order: backendOrderSchema,
    payment: backendPaymentAttemptSchema,
  })
  .superRefine((result, context) => {
    if (result.payment.amountToman !== result.order.totals.grandTotalToman) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["payment", "amountToman"],
        message: "verification amount does not match order total",
      });
    }
    if (
      result.verified &&
      !(
        result.order.paymentStatus === "paid" &&
        result.payment.status === "verified" &&
        result.payment.referenceId?.trim()
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["verified"],
        message: "verified response is internally inconsistent",
      });
    }
  });
