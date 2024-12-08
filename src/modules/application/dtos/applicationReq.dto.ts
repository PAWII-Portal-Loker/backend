import * as Yup from "yup";
import { PaginatorDto, SorterDto } from "@types";
import { paginatorSchema, sorterSchema } from "@consts";

export interface ApplicationReqDto extends PaginatorDto, SorterDto {
  companyName?: string;
  position?: string;
}

export const ApplicationGetSchema = Yup.object({
  companyName: Yup.string().optional(),
  position: Yup.string().optional(),

  ...paginatorSchema,
  ...sorterSchema,
})
  .noUnknown(true)
  .strict(true);
