import { UserResDto } from "@user/dtos/userRes.dto";
import { CompanyTypeEnums } from "src/modules/enums/consts/companyTypes";

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
