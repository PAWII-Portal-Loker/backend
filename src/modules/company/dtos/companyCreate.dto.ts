import { COMPANY_TYPES } from "src/modules/enums/consts/companyTypes";
import * as Yup from "yup";

export interface CompanyCreateDto {
  companyType: string;
  companyName: string;
  foundingDate: string;
  employeeTotal: number;
  earlyWorkingHour: string;
  endWorkingHour: string;
}

export const CompanyCreateSchema: Yup.Schema<CompanyCreateDto> = Yup.object({
  companyType: Yup.string()
    .required("companyType is required")
    .oneOf(COMPANY_TYPES, "Invalid companyType"),

  companyName: Yup.string()
    .required("companyName is required")
    .min(3, "companyName must be at least 3 characters")
    .max(100, "companyName must be at most 100 characters"),

  foundingDate: Yup.string()
    .required("foundingDate is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid foundingDate format (YYYY-MM-DD)"),

  employeeTotal: Yup.number()
    .required("employeeTotal is required")
    .min(1, "employeeTotal must be at least 1")
    .max(10000, "employeeTotal must be at most 10000"),

  earlyWorkingHour: Yup.string()
    .required("earlyWorkingHour is required")
    .matches(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid earlyWorkingHour format (HH:MM)",
    ),

  endWorkingHour: Yup.string()
    .required("endWorkingHour is required")
    .matches(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid endWorkingHour format (HH:MM)",
    ),
})
  .noUnknown(true)
  .strict(true);
