import { paginatorSchema, sorterSchema } from "@consts";
import { PaginatorDto, SorterDto } from "@types";
import * as Yup from "yup";

export interface UserGetDto extends PaginatorDto, SorterDto {
  name?: string;
  email?: string;
}

export const UserGetSchema = Yup.object({
  name: Yup.string().optional(),
  email: Yup.string().optional(),
  ...paginatorSchema,
  ...sorterSchema,
})
  .noUnknown(true)
  .strict(true);
