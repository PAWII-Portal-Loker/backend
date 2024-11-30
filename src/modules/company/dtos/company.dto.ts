import { Timestamps } from "@types";
import { UserDto, UserResponseDto } from "@user/dtos/user.dto";
import { Document } from "mongoose";
import { CompanyTypeEnums } from "src/modules/enums/consts/companyTypes";

export interface CompanyDto extends Document, Timestamps {
  userId: UserDto["_id"];
  companyType: CompanyTypeEnums;
  companyName: string;
  foundingDate: Date;
  employeeTotal: number;
  earlyWorkingHour: string;
  endWorkingHour: string;
}

export interface CompanyResponseDto {
  id: string;
  user: UserResponseDto;
  companyType: CompanyTypeEnums;
  companyName: string;
  foundingDate: Date;
  employeeTotal: number;
  earlyWorkingHour: string;
  endWorkingHour: string;
  createdAt: Date;
  updatedAt: Date;
}
