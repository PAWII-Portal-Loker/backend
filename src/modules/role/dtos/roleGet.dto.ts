import { sorterSchema } from "@consts";
import { PaginatorDto, SorterDto } from "@types";
import * as Yup from "yup";

export interface RoleGetDto extends PaginatorDto, SorterDto {
  name?: string;
}

export const RoleGetSchema = Yup.object({
  name: Yup.string().optional(),
  ...sorterSchema,
})
  .noUnknown(true)
  .strict(true);
