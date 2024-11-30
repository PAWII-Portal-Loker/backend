import { Timestamps } from "@types";
import { Document } from "mongoose";
import { JobSeekerDto } from "src/modules/jobSeeker/dtos/jobSeeker.dto";
import { VacancyDto } from "src/modules/vacancy/dtos/vacancy.dto";

export interface ApplicationDto extends Document, Timestamps {
  jobSeekerId: JobSeekerDto["_id"];
  vacancyId: VacancyDto["_id"];
  documentUrls: string[];
  message: string;
}

export interface ApplicationResponseDto {
  id: string;
  jobSeeker: JobSeekerDto;
  vacancy: VacancyDto;
  documentUrls: string[];
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
