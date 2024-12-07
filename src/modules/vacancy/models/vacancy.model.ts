import mongoose, { Schema } from "mongoose";
import { VacancyDto } from "../dtos/vacancy.dto";

const vacancySchema = new Schema<VacancyDto>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    jobType: { type: String, required: true },
    incomeType: { type: String, required: true },
    position: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    description: { type: String, required: true },
    appliedCount: { type: Number, required: true },
    isClosed: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

export const VacancyModel = mongoose.model<VacancyDto>(
  "Vacancy",
  vacancySchema,
);
