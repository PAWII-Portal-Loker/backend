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
    thumnailUrl: vacancy?.thumnailUrl ?? "",
    description: vacancy?.description ?? "",
    applied_count: vacancy?.applied_count ?? "",
    is_closed: vacancy?.is_closed ?? "",
    createdAt: vacancy?.createdAt ?? "",
    updatedAt: vacancy?.updatedAt ?? "",
  };
}
