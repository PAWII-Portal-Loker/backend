import mongoose, { Schema } from "mongoose";
import { RoleDto } from "../dtos/role.dto";

const roleSchema = new Schema<RoleDto>({
  name: { type: String, required: true, unique: true },
});

export const RoleModel = mongoose.model<RoleDto>("Role", roleSchema);
