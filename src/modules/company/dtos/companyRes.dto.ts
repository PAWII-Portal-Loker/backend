import { CompanyTypeEnums } from "@enums/consts/companyTypes";
import { UserResDto } from "@user/dtos/userRes.dto";

export interface CompanyResDto {
  id: string;
  user: UserResDto;
  companyType: CompanyTypeEnums;
  companyName: string;
  foundingDate: Date;
  employeeTotal: number;
  earlyWorkingHour: string;
  endWorkingHour: string;
  createdAt: Date;
  updatedAt: Date;
}
