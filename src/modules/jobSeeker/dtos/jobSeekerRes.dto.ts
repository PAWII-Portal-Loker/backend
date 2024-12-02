import { UserResDto } from "@user/dtos/userRes.dto";

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