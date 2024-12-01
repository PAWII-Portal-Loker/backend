import { RolesEnum } from "@enums/consts/roles";

export interface UserResDto {
  id: string;
  role: RolesEnum;
  email: string;
  waNumber: string;
  imageUrl: string;
  bio: string;
  province: string;
  city: string;
  subdistrict: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
