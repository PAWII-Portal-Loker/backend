import * as Yup from "yup";
import { INCOME_TYPES, IncomeTypeEnums } from "@enums/consts/incomeTypes";
import { JOB_TYPES, JobTypeEnums } from "@enums/consts/jobTypes";
import { PaginatorDto, SorterDto } from "@types";
import { paginatorSchema, sorterSchema } from "@consts";

export interface VacancyReqDto extends PaginatorDto, SorterDto {
  position?: string;
  jobType?: JobTypeEnums;
  incomeType?: IncomeTypeEnums;
}

export const VacancyGetSchema = Yup.object({
  position: Yup.string().optional(),
  jobType: Yup.string().oneOf(JOB_TYPES).optional(),
  incomeType: Yup.string().oneOf(INCOME_TYPES).optional(),
  ...paginatorSchema,
  ...sorterSchema,
})
  .noUnknown(true)
  .strict(true);
