import { UserDto } from "@user/dtos/user/user.dto";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema<UserDto>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<UserDto>("User", userSchema);
