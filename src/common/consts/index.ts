import { StatusOk } from "@utils/statusCodes";

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

export const TOKEN_EXPIRED = "TokenExpiredError";
export const TOKEN_INVALID = "JsonWebTokenError";
