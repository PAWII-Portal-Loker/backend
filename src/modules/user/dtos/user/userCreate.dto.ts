import * as Yup from "yup";

export interface UserCreateDto {
  name: string;
  email: string;
  password: string;
}

export const UserCreateSchema: Yup.Schema<UserCreateDto> = Yup.object({
  name: Yup.string()
    .required("name is required")
    .min(2, "name must be at least 2 characters")
    .max(100, "name must be at most 100 characters"),

  email: Yup.string()
    .required("email is required")
    .email("Invalid email format"),

  password: Yup.string()
    .required("password is required")
    .min(6, "password must be at least 6 characters")
    .max(100, "password must be at most 100 characters"),
});
