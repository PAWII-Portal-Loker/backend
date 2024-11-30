import mongoose, { Schema } from "mongoose";
import { JobSeekerDto } from "../dtos/jobSeeker.dto";

const jobSeekerSchema = new Schema<JobSeekerDto>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    lastEducation: { type: String, required: true },
    major: { type: String, required: true },
    gpa: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const JobSeekerModel = mongoose.model<JobSeekerDto>(
  "JobSeeker",
  jobSeekerSchema,
);
