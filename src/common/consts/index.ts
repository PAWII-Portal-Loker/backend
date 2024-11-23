import { StatusOk } from "@utils/statusCodes";

export const baseSuccessRes = Object.freeze({
  success: true,
  statusCode: StatusOk,
  message: "Success",
  data: {},
});

export const baseErrorRes = Object.freeze({
  success: false,
  statusCode: 500,
  message: "Error",
  errors: [],
});
