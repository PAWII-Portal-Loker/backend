import { RolesEnum } from "@enums/consts/roles";
import { Timestamps } from "@types";
import { Document } from "mongoose";

export interface UserDto extends Document, Timestamps {
  role: RolesEnum;
  email: string;
  password: string;
  waNumber: string;
  imageUrl: string;
  bio: string;
  province: string;
  city: string;
  subdistrict: string;
  address: string;
}
