import BaseMongoService from "@base/mongoService";
import { ServiceError } from "@types";
import { StatusNotFound } from "@consts/statusCodes";
import { JobSeekerModel } from "@jobSeeker/models/jobSeeker.model";
import { JobSeekerDto } from "@jobSeeker/dtos/jobSeeker.dto";
import { isValidObjectId } from "mongoose";

class JobSeekerSubservice extends BaseMongoService<JobSeekerDto> {
  constructor() {
    super(JobSeekerModel);
  }

  public async getJobSeekerIdByUserId(
    userId: string,
  ): Promise<JobSeekerDto["_id"] | ServiceError> {
    if (!userId || !isValidObjectId(userId)) {
      return this.throwError("Invalid user ID", StatusNotFound);
    }

    const jobSeeker = await this.findOne({ userId });
    if (!jobSeeker) {
      return this.throwError("Job Seeker not found", StatusNotFound);
    }

    return jobSeeker._id;
  }
}

export default JobSeekerSubservice;
