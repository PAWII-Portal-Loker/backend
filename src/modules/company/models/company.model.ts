import mongoose, { Schema } from "mongoose";
import { CompanyDto } from "../dtos/company.dto";

const companySchema = new Schema<CompanyDto>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyType: { type: String, required: true },
    companyName: { type: String, required: true },
    foundingDate: { type: Date, required: true },
    employeeTotal: { type: Number, required: true },
    earlyWorkingHour: { type: String, required: true },
    endWorkingHour: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const CompanyModel = mongoose.model<CompanyDto>(
  "Company",
  companySchema,
);
