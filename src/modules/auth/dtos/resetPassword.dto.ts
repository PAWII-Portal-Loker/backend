import * as Yup from "yup";

export interface ResetPasswordDto {
  resetToken: string;
  newPassword: string;
}

export const ResetPasswordSchema: Yup.Schema<Partial<ResetPasswordDto>> =
  Yup.object({
    resetToken: Yup.string().required("resetToken is required"),
    newPassword: Yup.string()
      .required("new password is required")
      .min(6, "new password must be at least 6 characters")
      .max(100, "new password must be at most 100 characters"),
  })
    .noUnknown(true)
    .strict(true);
