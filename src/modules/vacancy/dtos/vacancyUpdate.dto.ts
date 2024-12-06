import { INCOME_TYPES, IncomeTypeEnums } from "@enums/consts/incomeTypes";
import { JOB_TYPES, JobTypeEnums } from "@enums/consts/jobTypes";
import * as Yup from "yup";

export interface VacancyUpdateDto {
  jobType: JobTypeEnums;
  incomeType: IncomeTypeEnums;
  position: string;
  thumbnailUrl?: string;
  description: string;
}

export const VacancyUpdateSchema: Yup.Schema<VacancyUpdateDto> = Yup.object({
  jobType: Yup.string()
    .required("job_type is required")
    .oneOf(
      JOB_TYPES,
      `Invalid job_type, must be one of "${JOB_TYPES.join(", ")}"`,
    ),

  incomeType: Yup.string()
    .required("income_type is required")
    .oneOf(
      INCOME_TYPES,
      `Invalid income_type, must be one of "${INCOME_TYPES.join(", ")}"`,
    ),

  position: Yup.string()
    .required("position is required")
    .min(3, "position must be at least 3 characters")
    .max(100, "position must be at most 100 characters"),

  thumbnailUrl: Yup.string().optional().url("Invalid thumbnail_url format"),

  description: Yup.string()
    .required("description is required")
    .min(10, "description must be at least 10 characters"),
});
