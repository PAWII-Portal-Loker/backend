import { COMPANY_TYPES } from "@enums/consts/companyTypes";
import * as Yup from "yup";

export interface CompanyUpdateDto {
  company_type: string;
  company_name: string;
  founding_date: string;
  employee_total: number;
  early_working_hour: string;
  end_working_hour: string;
}

export const CompanyUpdateSchema: Yup.Schema<CompanyUpdateDto> = Yup.object({
  company_type: Yup.string()
    .required("company_type is required")
    .oneOf(
      COMPANY_TYPES,
      `Invalid company_type, must be one of "${COMPANY_TYPES.join(", ")}"`,
    ),

  company_name: Yup.string()
    .required("company_name is required")
    .min(3, "company_name must be at least 3 characters")
    .max(100, "company_name must be at most 100 characters"),

  founding_date: Yup.string()
    .required("founding_date is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid founding_date format (YYYY-MM-DD)",
    ),

  employee_total: Yup.number()
    .required("employee_total is required")
    .min(1, "employee_total must be at least 1"),

  early_working_hour: Yup.string()
    .required("early_working_hour is required")
    .matches(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid early_working_hour format (HH:MM)",
    ),

  end_working_hour: Yup.string()
    .required("end_working_hour is required")
    .matches(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid end_working_hour format (HH:MM)",
    ),
})
  .noUnknown(true)
  .strict(true);
