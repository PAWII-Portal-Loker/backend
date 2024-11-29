import { Timestamps } from "@types";
import { Document } from "mongoose";
import { RoleDto, RoleResponseDto } from "src/modules/role/dtos/role.dto";

export interface UserDto extends Document, Timestamps {
  name: string;
  email: string;
  password: string;
  role_id: RoleDto["_id"];
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: RoleResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
