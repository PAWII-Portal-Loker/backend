import { JobSeekerResDto } from "@jobSeeker/dtos/jobSeekerRes.dto";
import { VacancyResDto } from "@vacancy/dtos/vacancyRes.dto";

export interface ApplicationResDto {
  id: string;
  jobSeeker?: JobSeekerResDto;
  vacancy?: VacancyResDto;
  documentUrls: string[];
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
