import { paginatorSchema, sorterSchema } from "@consts";
import { COMPANY_TYPES, CompanyTypeEnums } from "@enums/consts/companyTypes";
import { PaginatorDto, SorterDto } from "@types";
import * as Yup from "yup";

export interface CompanyReqDto extends PaginatorDto, SorterDto {
  companyName?: string;
  companyType?: CompanyTypeEnums;
}

export const CompanyGetSchema = Yup.object({
  companyName: Yup.string().optional(),
  companyType: Yup.string().oneOf(COMPANY_TYPES).optional(),
  ...paginatorSchema,
  ...sorterSchema,
})
  .noUnknown(true)
  .strict(true);
