import { JobSeekerDto } from "@jobSeeker/dtos/jobSeeker.dto";
import { Timestamps } from "@types";
import { VacancyDto } from "@vacancy/dtos/vacancy.dto";
import { Document } from "mongoose";

export interface ApplicationDto extends Document, Timestamps {
  jobSeekerId: JobSeekerDto["_id"];
  vacancyId: VacancyDto["_id"];
  documentUrls: string[];
  message: string;
}
