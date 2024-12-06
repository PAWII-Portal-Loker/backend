import { CompanyResDto } from "@company/dtos/companyRes.dto";
import { IncomeTypeEnums } from "@enums/consts/incomeTypes";
import { JobTypeEnums } from "@enums/consts/jobTypes";

export interface VacancyResDto {
  id: string;
  company: CompanyResDto;
  jobType: JobTypeEnums;
  incomeType: IncomeTypeEnums;
  position: string;
  thumnailUrl: string;
  description: string;
  applied_count: number;
  is_closed: boolean;
  is_applied?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
