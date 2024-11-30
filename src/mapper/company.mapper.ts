import { UserDto } from "@user/dtos/user.dto";
import { CompanyDto } from "src/modules/company/dtos/company.dto";
import { CompanyResDto } from "src/modules/company/dtos/companyRes.dto";
import { userMapper } from "./user.mapper";

export function companyMapper(
  company: CompanyDto,
  user: UserDto,
): CompanyResDto {
  return {
    id: (company?._id as string) ?? "",
    user: userMapper(user),
    companyName: company?.companyName ?? "",
    companyType: company?.companyType ?? "",
    earlyWorkingHour: company?.earlyWorkingHour ?? "",
    employeeTotal: company?.employeeTotal ?? "",
    endWorkingHour: company?.endWorkingHour ?? "",
    foundingDate: company?.foundingDate ?? "",
    createdAt: company?.createdAt ?? "",
    updatedAt: company?.updatedAt ?? "",
  };
}
