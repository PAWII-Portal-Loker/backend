import { shouldBeNumber } from "@utils/yup";
import * as Yup from "yup";

export interface UserGetDto {
  name?: string;
  email?: string;

  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
}

export const UserGetSchema = Yup.object({
  name: Yup.string().optional(),
  email: Yup.string().optional(),
  page: shouldBeNumber().min(1, "page must be at least 1"),
  limit: shouldBeNumber()
    .min(1, "limit must be at least 1")
    .max(100, "limit must be at most 100"),
  sort: Yup.string().optional(),
  order: Yup.string().optional(),
})
  .noUnknown(true)
  .strict(true);
