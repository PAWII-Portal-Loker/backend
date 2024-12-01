import { CompanyTypeEnums } from "@enums/consts/companyTypes";
import { Timestamps } from "@types";
import { UserDto } from "@user/dtos/user.dto";
import { Document } from "mongoose";

export interface CompanyDto extends Document, Timestamps {
  userId: UserDto["_id"];
  companyType: CompanyTypeEnums;
  companyName: string;
  foundingDate: Date;
  employeeTotal: number;
  earlyWorkingHour: string;
  endWorkingHour: string;
}
