import { ApplicationResDto } from "@application/dtos/applicationRes.dto";
import { ApplicationDto } from "@application/dtos/application.dto";
import { JobSeekerDto } from "@jobSeeker/dtos/jobSeeker.dto";
import { VacancyDto } from "@vacancy/dtos/vacancy.dto";
import { vacancyMapper } from "./vacancy.mapper";
import { jobSeekerMapper } from "./jobseeker.mapper";
import { CompanyDto } from "@company/dtos/company.dto";
import { UserDto } from "@user/dtos/user.dto";

export function jobSeekerApplicationMapper(
  application: ApplicationDto,
  vacancy: VacancyDto,
  company: CompanyDto,
  companyUser: UserDto,
): ApplicationResDto {
  return {
    id: vacancy._id as string,
    vacancy: vacancyMapper(vacancy, company, companyUser),
    documentUrls: application?.documentUrls ?? [],
    message: application?.message ?? "-",
    createdAt: application?.createdAt ?? "",
    updatedAt: application?.updatedAt ?? "",
  };
}

export function vacancyApplicantMapper(
  application: ApplicationDto,
  jobSeeker: JobSeekerDto,
  user: UserDto,
): ApplicationResDto {
  return {
    id: jobSeeker._id as string,
    jobSeeker: jobSeekerMapper(jobSeeker, user),
    documentUrls: application?.documentUrls ?? [],
    message: application?.message ?? "-",
    createdAt: application?.createdAt ?? "",
    updatedAt: application?.updatedAt ?? "",
  };
}
