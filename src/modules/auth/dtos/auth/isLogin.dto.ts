import * as Yup from "yup";

export interface IsLoginDto {
  userId: string;
  deviceId: string;
  refreshToken: string;
}

export const IsLoginSchema: Yup.Schema<Partial<IsLoginDto>> = Yup.object({
  userId: Yup.string().required("user_id is required"),
  deviceId: Yup.string().required("device_id is required"),
  refreshToken: Yup.string().required("refresh_token is required"),
  // TODO: specify device_id format
})
  .noUnknown(true)
  .strict(true);
