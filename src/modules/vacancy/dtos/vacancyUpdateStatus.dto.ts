import * as Yup from "yup";

export interface VacancyUpdateStatusDto {
  isClosed: boolean;
}

export const VacancyUpdateStatusSchema: Yup.Schema<VacancyUpdateStatusDto> =
  Yup.object({
    isClosed: Yup.boolean().required("is_closed is required"),
  });
