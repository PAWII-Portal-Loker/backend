import { Timestamps } from "@types";
import { Document } from "mongoose";
import { RolesEnum } from "src/modules/enums/consts/roles";
import { RoleResponseDto } from "src/modules/role/dtos/role.dto";

export interface UserDto extends Document, Timestamps {
  role: RolesEnum;
  email: string;
  password: string;
  waNumber: string;
  imageUrl: string;
  bio: string;
  country: string;
  province: string;
  city: string;
  subdistrict: string;
  address: string;
}

export interface UserResponseDto {
  id: string;
  role: RoleResponseDto;
  email: string;
  waNumber: string;
  imageUrl: string;
  bio: string;
  country: string;
  province: string;
  city: string;
  subdistrict: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
