import { LastEducationTypeEnum } from "@enums/consts/lastEducationTypes";
import { UserResDto } from "@user/dtos/userRes.dto";

export interface JobSeekerResDto {
  id: string;
  user: UserResDto;
  name: string;
  lastEducation: LastEducationTypeEnum;
  major: string;
  gpa: number;
  createdAt: Date;
  updatedAt: Date;
}
