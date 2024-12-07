import { CompanyResDto } from "@company/dtos/companyRes.dto";
import { IncomeTypeEnums } from "@enums/consts/incomeTypes";
import { JobTypeEnums } from "@enums/consts/jobTypes";

export interface VacancyResDto {
  id: string;
  company: CompanyResDto;
  jobType: JobTypeEnums;
  incomeType: IncomeTypeEnums;
  position: string;
  thumbnailUrl: string;
  description: string;
  appliedCount: number;
  isClosed: boolean;
  isApplied?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
