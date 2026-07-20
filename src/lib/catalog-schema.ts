import { z } from "zod";
import { ApiError } from "@/lib/api";
import type {
  BackendCategory,
  BackendPagination,
  BackendProduct,
} from "@/lib/backend-contract";
import {
  backendCategorySchema,
  backendPaginationSchema,
  backendProductSchema,
} from "@/lib/catalog-contract-schema";

const invalidCatalogContract = (issues: z.ZodIssue[]) =>
  new ApiError({
    message: "ساختار اطلاعات کاتالوگ با قرارداد فرانت‌اند سازگار نیست.",
    status: 502,
    code: "invalid_catalog_contract",
    errors: {
      issues: issues.slice(0, 20).map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    },
  });

const parseWithContract = <T>(schema: z.ZodType<T>, value: unknown): T => {
  const result = schema.safeParse(value);
  if (!result.success) throw invalidCatalogContract(result.error.issues);
  return result.data;
};

export const parseBackendProduct = (value: unknown): BackendProduct =>
  parseWithContract(backendProductSchema, value) as BackendProduct;

export const parseBackendProducts = (value: unknown): BackendProduct[] =>
  parseWithContract(
    z.array(backendProductSchema).max(100),
    value,
  ) as BackendProduct[];

export const parseBackendCategories = (value: unknown): BackendCategory[] =>
  parseWithContract(
    z.array(backendCategorySchema).max(100),
    value,
  ) as BackendCategory[];

export const parseBackendPagination = (value: unknown): BackendPagination =>
  parseWithContract(backendPaginationSchema, value) as BackendPagination;
