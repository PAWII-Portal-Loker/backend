import * as Yup from "yup";

export interface SignOutDto {
  userId: string;
  deviceId: string;
  refreshToken: string;
}

export const SignOutSchema: Yup.Schema<Partial<SignOutDto>> = Yup.object({
  userId: Yup.string().required("user_id is required"),
  refreshToken: Yup.string().required("refresh_token is required"),
  deviceId: Yup.string().required("device_id is required"),
  // TODO: specify device_id format
})
  .noUnknown(true)
  .strict(true);
