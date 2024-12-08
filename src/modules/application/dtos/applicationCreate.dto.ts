import { VacancyDto } from "@vacancy/dtos/vacancy.dto";
import * as Yup from "yup";

export interface ApplicationCreateDto {
  vacancyId: VacancyDto["_id"];
  documentUrls?: string[];
  message: string;
}

export const ApplicationCreateSchema: Yup.Schema<ApplicationCreateDto> =
  Yup.object({
    vacancyId: Yup.string()
      .required("vacancy_id is required")
      .length(24, "vacancy_id must be 24 characters"),

    documentUrls: Yup.array()
      .of(Yup.string().url("Invalid document url").required())
      .optional(),

    message: Yup.string()
      .required("message is required")
      .min(3, "message must be at least 3 characters"),
  })
    .noUnknown(true)
    .strict(true);
