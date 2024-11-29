import { UserDto } from "@user/dtos/user.dto";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema<UserDto>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<UserDto>("User", userSchema);
