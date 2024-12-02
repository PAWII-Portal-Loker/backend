import { CompanyDto } from "@company/dtos/company.dto";
import { IncomeTypeEnums } from "@enums/consts/incomeTypes";
import { JobTypeEnums } from "@enums/consts/jobTypes";
import { Timestamps } from "@types";
import { Document } from "mongoose";

export interface VacancyDto extends Document, Timestamps {
  companyId: CompanyDto["_id"];
  jobType: JobTypeEnums;
  incomeType: IncomeTypeEnums;
  position: string;
  thumnailUrl: string;
  description: string;
  applied_count: number;
  is_closed: boolean;
}

export interface VacancyResponseDto {
  id: string;
  company: CompanyDto;
  jobType: JobTypeEnums;
  incomeType: IncomeTypeEnums;
  position: string;
  thumnailUrl: string;
  description: string;
  applied_count: number;
  is_closed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
