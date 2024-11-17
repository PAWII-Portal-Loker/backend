import { Document } from "mongoose";

export interface UserDto extends Document {
  name: string;
  email: string;
  password: string;
}
