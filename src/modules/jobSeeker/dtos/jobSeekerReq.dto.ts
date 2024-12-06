import { paginatorSchema, sorterSchema } from "@consts";
import { LAST_EDUCATION_TYPE, LastEducationTypeEnum } from "@enums/consts/lastEducationTypes";
import { PaginatorDto, SorterDto } from "@types";
import * as Yup from "yup";

export interface JobSeekerReqDto extends PaginatorDto, SorterDto {
    name?: string;
    lastEducation?: LastEducationTypeEnum;
}

export const JobSeekerGetSchema = Yup.object({
    name: Yup.string().optional(),
    lastEducation: Yup.string().oneOf(LAST_EDUCATION_TYPE).optional(),
    ...paginatorSchema,
    ...sorterSchema,
})
  .noUnknown(true)
  .strict(true);