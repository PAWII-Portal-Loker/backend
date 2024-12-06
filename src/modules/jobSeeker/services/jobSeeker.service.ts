import BaseMongoService from "@base/mongoService";
import { ROLE_JOB_SEEKER } from "@enums/consts/roles";
import { JobSeekerDto } from "@jobSeeker/dtos/jobSeeker.dto";
import { JobSeekerCreateDto } from "@jobSeeker/dtos/jobSeekerCreate.dto";
import { JobSeekerResDto } from "@jobSeeker/dtos/jobSeekerRes.dto";
import { JobSeekerModel } from "@jobSeeker/models/jobSeeker.model";
import { jobSeekerMapper } from "@mapper/jobseeker.mapper";
import { DataFilter, Pagination, ServiceError } from "@types";
import UserService from "@user/services/user.service";
import { isIdEquals } from "@utils/compare";
import { StatusBadRequest, StatusConflict, StatusNotFound } from "@utils/statusCodes";
import { isValidObjectId } from "mongoose";

class JobSeekerService extends BaseMongoService<JobSeekerDto> {
  private userService = new UserService();

  constructor() {
    super(JobSeekerModel);
  }

  public async getAllJobSeekers(
    filters: DataFilter,
    paginator?: Pagination,
  ): Promise<JobSeekerResDto[] | ServiceError> {
    const jobSeekers = await this.find(filters, paginator);
    if (!jobSeekers) {
      return this.throwError("Error getting job seekers", StatusBadRequest);
    }

    const userIds = jobSeekers.map((jobSeekers) => jobSeekers.userId);

    const users = await this.userService.find({
      query: { _id: { $in: userIds } },
    });
    if (!users) {
      return this.throwError("Error getting users", StatusBadRequest);
    }

    return jobSeekers.map((jobSeeker) => {
      return jobSeekerMapper(
        jobSeeker,
        users.find((u) => isIdEquals(u._id, jobSeeker.userId))!,
      )
    })
  }

  public async getJobSeekerById(
    id: string,
  ): Promise<JobSeekerResDto | ServiceError> {
    if (!isValidObjectId(id)) {
      return this.throwError("Invalid job seeker ID", StatusBadRequest);
    }

    const jobSeeker = await this.findOne({ _id: id });
    if (!jobSeeker) {
      return this.throwError("Job seeker not found", StatusNotFound);
    }

    const user = await this.userService.findOne({ _id: jobSeeker.userId });
    if (!user) {
      return this.throwError("Error getting user", StatusBadRequest);
    }

    return jobSeekerMapper(jobSeeker, user);
  }

  public async createJobSeeker(
    data: Partial<JobSeekerCreateDto>,
    userId: string,
  ): Promise<string | ServiceError> {
    const jobSeeker = await this.findOne({ userId });
    if (jobSeeker) {
      return this.throwError("Job Seeker already registered", StatusConflict);
    }

    const createJobSeekerPayload = {
      userId, 
      name: data.name,
      lastEducation: data.lastEducation,
      major: data.major,
      gpa: data.gpa,
    }

    const [newJobSeeker, updatedUser] = await Promise.all([
      this.create(createJobSeekerPayload),
      this.userService.update({ _id: userId }, { role: ROLE_JOB_SEEKER }),
    ]);
    if (!newJobSeeker) {
      this.userService.update({ _id: userId }, { role: null });
      return this.throwError("Error creating job seeker", StatusBadRequest);
    }
    if (!updatedUser) {
      this.delete({ _id: newJobSeeker.id });
      return this.throwError("Error updating user", StatusBadRequest)
    }

    return newJobSeeker._id as string;
  }

  public async updateJobSeeker(
    data: Partial<JobSeekerCreateDto>,
    userId: string,
  ): Promise<string | ServiceError> {
    const jobSeeker = await this.findOne({ userId });
    if (!jobSeeker) {
      return this.throwError("Job seeker not found", StatusConflict);
    }

    const updatedJobSeeker = await this.update(
      { _id: jobSeeker.id },
      {
        name: data.name,
        lastEducation: data.lastEducation,
        major: data.major,
        gpa: data.gpa,
      },
    );
    console.log(updatedJobSeeker);
    if (!updatedJobSeeker){
      return this.throwError("Error updating job seeker", StatusBadRequest);
    }

    return updatedJobSeeker._id as string;
  }
}

export default JobSeekerService;