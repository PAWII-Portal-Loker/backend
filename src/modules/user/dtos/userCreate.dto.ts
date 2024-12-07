import * as Yup from "yup";

export interface UserCreateDto {
  email: string;
  password: string;
  waNumber: string;
}

export const UserCreateSchema: Yup.Schema<UserCreateDto> = Yup.object({
  email: Yup.string()
    .required("email is required")
    .email("Invalid email format"),

  password: Yup.string()
    .required("password is required")
    .min(6, "password must be at least 6 characters")
    .max(100, "password must be at most 100 characters"),

  waNumber: Yup.string()
    .required("wa_number is required")
    .matches(/^[0-9]+$/, "wa_number must be a number")
    .min(10, "wa_number must be at least 10 characters")
    .max(20, "wa_number must be at most 20 characters"),
})
  .noUnknown(true)
  .strict(true);
