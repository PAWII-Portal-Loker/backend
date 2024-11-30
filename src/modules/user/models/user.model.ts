import { UserDto } from "@user/dtos/user.dto";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema<UserDto>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    waNumber: { type: String, required: true },
    imageUrl: { type: String },
    bio: { type: String },
    province: { type: String },
    city: { type: String },
    subdistrict: { type: String },
    address: { type: String },
    role: { type: String },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<UserDto>("User", userSchema);
