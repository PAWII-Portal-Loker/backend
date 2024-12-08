import { CompanyDto } from "@company/dtos/company.dto";
import { VacancyDto } from "@vacancy/dtos/vacancy.dto";
import { VacancyResDto } from "@vacancy/dtos/vacancyRes.dto";
import { companyMapper } from "./company.mapper";
import { UserDto } from "@user/dtos/user.dto";

export function vacancyMapper(
  vacancy: VacancyDto,
  company?: CompanyDto,
  user?: UserDto,
): VacancyResDto {
  return {
    id: (vacancy?._id as string) ?? "",
    company: company && companyMapper(company, user),
    jobType: vacancy?.jobType ?? "",
    incomeType: vacancy?.incomeType ?? "",
    position: vacancy?.position ?? "",
    thumbnailUrl: vacancy?.thumbnailUrl ?? "",
    description: vacancy?.description ?? "",
    appliedCount: vacancy?.appliedCount ?? "",
    isClosed: vacancy?.isClosed ?? "",
    createdAt: vacancy?.createdAt ?? "",
    updatedAt: vacancy?.updatedAt ?? "",
  };
}
