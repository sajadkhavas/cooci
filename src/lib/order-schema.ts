import { z } from "zod";
import { ApiError } from "@/lib/api";
import type {
  BackendCheckoutResult,
  BackendDeliveryOptions,
  BackendOrder,
  BackendPaymentInitiationResult,
  BackendPaymentVerificationResult,
} from "@/lib/backend-contract";
import {
  backendCheckoutResultSchema,
  backendDeliveryOptionsSchema,
  backendOrderSchema,
  backendPaymentInitiationResultSchema,
  backendPaymentVerificationResultSchema,
} from "@/lib/order-contract-schema";

const invalidOrderContract = (issues: z.ZodIssue[]) =>
  new ApiError({
    message: "ساختار سفارش یا پرداخت با قرارداد فرانت‌اند سازگار نیست.",
    status: 502,
    code: "invalid_order_contract",
    errors: {
      issues: issues.slice(0, 20).map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    },
  });

const parseWithContract = <T>(schema: z.ZodTypeAny, value: unknown): T => {
  const result = schema.safeParse(value);
  if (!result.success) throw invalidOrderContract(result.error.issues);
  return result.data as T;
};

export const parseBackendOrder = (value: unknown): BackendOrder =>
  parseWithContract<BackendOrder>(backendOrderSchema, value);

export const parseBackendOrders = (value: unknown): BackendOrder[] =>
  parseWithContract<BackendOrder[]>(z.array(backendOrderSchema).max(100), value);

export const parseBackendDeliveryOptions = (
  value: unknown,
): BackendDeliveryOptions =>
  parseWithContract<BackendDeliveryOptions>(backendDeliveryOptionsSchema, value);

export const parseBackendCheckoutResult = (
  value: unknown,
): BackendCheckoutResult =>
  parseWithContract<BackendCheckoutResult>(backendCheckoutResultSchema, value);

export const parseBackendPaymentInitiationResult = (
  value: unknown,
): BackendPaymentInitiationResult =>
  parseWithContract<BackendPaymentInitiationResult>(
    backendPaymentInitiationResultSchema,
    value,
  );

export const parseBackendPaymentVerificationResult = (
  value: unknown,
): BackendPaymentVerificationResult =>
  parseWithContract<BackendPaymentVerificationResult>(
    backendPaymentVerificationResultSchema,
    value,
  );
