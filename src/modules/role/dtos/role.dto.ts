import { Timestamps } from "@types";
import { Document } from "mongoose";

export interface RoleDto extends Document, Timestamps {
  name: string;
}

export interface RoleResponseDto {
  id: string;
  name: string;
}
