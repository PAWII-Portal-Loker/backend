import { UserDto } from "@user/dtos/user.dto";
import { userMapper } from "./user.mapper";

import { JobSeekerDto } from "@jobSeeker/dtos/jobSeeker.dto";
import { JobSeekerResDto } from "@jobSeeker/dtos/jobSeekerRes.dto";

export function jobSeekerMapper(
  jobSeeker: JobSeekerDto,
  user: UserDto,
): JobSeekerResDto {
  return {
    id: (jobSeeker?._id as string) ?? "",
    user: userMapper(user),
    name: jobSeeker?.name ?? "",
    lastEducation: jobSeeker?. lastEducation ?? "",
    major: jobSeeker?. major ?? "",
    gpa: jobSeeker?. gpa ?? "",
    createdAt: jobSeeker?.createdAt ?? "",
    updatedAt: jobSeeker?.updatedAt ?? "",
  };
}
