import * as Yup from "yup";

export interface SignInDto {
  email: string;
  password: string;
  userId: string;
  deviceId: string;
  refreshToken: string;
}

export const SignInSchema: Yup.Schema<Partial<SignInDto>> = Yup.object({
  email: Yup.string()
    .required("email is required")
    .email("Invalid email format"),

  password: Yup.string()
    .required("password is required")
    .min(6, "password must be at least 6 characters")
    .max(100, "password must be at most 100 characters"),

  // TODO: specify device_id format
})
  .noUnknown(true)
  .strict(true);
