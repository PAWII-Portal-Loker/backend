import * as Yup from "yup";

export interface ForgetPasswordDto {
  email: string;
}

export const ForgetPasswordSchema: Yup.Schema<Partial<ForgetPasswordDto>> =
  Yup.object({
    email: Yup.string()
      .required("email is required")
      .email("Invalid email format"),
  })
    .noUnknown(true)
    .strict(true);
