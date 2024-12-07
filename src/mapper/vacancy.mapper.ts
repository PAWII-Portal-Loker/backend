import { CompanyDto } from "@company/dtos/company.dto";
import { VacancyDto } from "@vacancy/dtos/vacancy.dto";
import { VacancyResDto } from "@vacancy/dtos/vacancyRes.dto";
import { companyMapper } from "./company.mapper";

export function vacancyMapper(
  vacancy: VacancyDto,
  company: CompanyDto,
): VacancyResDto {
  return {
    id: (vacancy?._id as string) ?? "",
    company: companyMapper(company),
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
