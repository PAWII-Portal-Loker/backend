import { StatusOk } from "@consts/statusCodes";
import { shouldBeNumber } from "@utils/yup";
import * as Yup from "yup";

export const baseSuccessRes = Object.freeze({
  success: true,
  statusCode: StatusOk,
  message: "Success",
  data: null,
});

export const baseErrorRes = Object.freeze({
  success: false,
  statusCode: 500,
  message: "Error",
  errors: [],
});

export const orderByMap = Object.freeze({
  asc: 1,
  desc: -1,
});

export const baseSortKey = ["created_at", "updated_at"];

export const days_7 = 60 * 60 * 24 * 7;
export const minutes_15 = 60 * 15;

export const MB_10 = 10485760;

export const TOKEN_EXPIRED = "TokenExpiredError";
export const TOKEN_INVALID = "JsonWebTokenError";

export const paginatorSchema = {
  page: shouldBeNumber().min(1, "page must be at least 1"),
  limit: shouldBeNumber()
    .min(1, "limit must be at least 1")
    .max(100, "limit must be at most 100"),
};
export const sorterSchema = {
  sort: Yup.string().optional(),
  order: Yup.string().oneOf(["ASC", "DESC", "asc", "desc"]).optional(),
};
