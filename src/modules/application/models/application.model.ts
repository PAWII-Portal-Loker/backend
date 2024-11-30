import mongoose, { Schema } from "mongoose";
import { ApplicationDto } from "../dtos/application.dto";

const applicationSchema = new Schema<ApplicationDto>(
  {
    jobSeekerId: {
      type: Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
    vacancyId: { type: Schema.Types.ObjectId, ref: "Vacancy", required: true },
    documentUrls: { type: [String], required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const ApplicationModel = mongoose.model<ApplicationDto>(
  "Application",
  applicationSchema,
);
