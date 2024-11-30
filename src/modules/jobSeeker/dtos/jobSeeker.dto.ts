import { Timestamps } from "@types";
import { UserDto, UserResDto } from "@user/dtos/user.dto";
import { Document } from "mongoose";

export interface JobSeekerDto extends Document, Timestamps {
  userId: UserDto["_id"];
  name: string;
  lastEducation: string;
  major: string;
  gpa: number;
}

export interface JobSeekerResponseDto {
  id: string;
  user: UserResDto;
  name: string;
  lastEducation: string;
  major: string;
  gpa: number;
  createdAt: Date;
  updatedAt: Date;
}
