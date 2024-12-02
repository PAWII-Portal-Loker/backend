import BaseMongoService from "@base/mongoService";
import { JobSeekerDto } from "@jobSeeker/dtos/jobSeeker.dto";
import { JobSeekerModel } from "@jobSeeker/models/jobSeeker.model";

class JobSeekerService extends BaseMongoService<JobSeekerDto> {
  constructor() {
    super(JobSeekerModel);
  }

}

export default JobSeekerService;