import { shouldBeNumber } from "@utils/yup";
import * as Yup from "yup";

export interface UserGetDto {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
}

export const UserGetSchema = Yup.object({
  page: shouldBeNumber().min(1, "page must be at least 1"),
  limit: shouldBeNumber()
    .min(1, "limit must be at least 1")
    .max(100, "limit must be at most 100"),
  name: Yup.string().optional(),
  email: Yup.string().optional(),
})
  .noUnknown(true)
  .strict(true);
