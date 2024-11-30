import { UserDto } from "@user/dtos/user.dto";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema<UserDto>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    waNumber: { type: String, required: true },
    imageUrl: { type: String, required: true },
    bio: { type: String, required: true },
    country: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    subdistrict: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<UserDto>("User", userSchema);
