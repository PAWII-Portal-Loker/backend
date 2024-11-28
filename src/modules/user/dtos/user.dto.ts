import { Timestamps } from "@types";
import { Document } from "mongoose";

export interface UserDto extends Document, Timestamps {
  name: string;
  email: string;
  password: string;
}
