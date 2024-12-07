import { Request, Response } from "express";
import BaseController from "@base/controller";
import { JobSeekerGetSchema } from "@jobSeeker/dtos/jobSeekerReq.dto";
import JobSeekerFilter from "@jobSeeker/filters/jobSeeker.filter";
import JobSeekerService from "@jobSeeker/services/jobSeeker.service";
import {
  JobSeekerCreateDto,
  JobSeekerCreateSchema,
} from "@jobSeeker/dtos/jobSeekerCreate.dto";
import { StatusCreated } from "@utils/statusCodes";
import {
  JobSeekerUpdateDto,
  JobSeekerUpdateSchema,
} from "@jobSeeker/dtos/jobSeekerUpdate.dto";

class JobSeekerController extends BaseController {
  private jobSeekerService = new JobSeekerService();
  private jobSeekerFilter = new JobSeekerFilter();

  constructor() {
    super();
    this.getAllJobSeekers();
    this.getJobSeekerById();
    this.createJobSeeker();
    this.updateJobSeeker();
  }

  private async getAllJobSeekers() {
    this.router.get("/v1/job-seekers", async (req: Request, res: Response) => {
      const reqParam = this.validateQuery(req, res, JobSeekerGetSchema);
      if (!reqParam) {
        return;
      }

      const paginator = this.paginate(reqParam.page, reqParam.limit);
      const filters = this.jobSeekerFilter.handleFilter(reqParam);

      const [jobSeekers, count] = await Promise.all([
        this.jobSeekerService.getAllJobSeekers(filters, paginator),
        this.jobSeekerService.count(filters),
      ]);
      if (this.isServiceError(res, jobSeekers)) {
        return;
      }

      return this.handleSuccess(
        res,
        {
          message: "Success getting job seekers",
          data: jobSeekers,
        },
        this.handlePagination(paginator, count),
      );
    });
  }

  private async getJobSeekerById() {
    this.router.get(
      "/v1/job-seekers/:id",
      async (req: Request, res: Response) => {
        const jobSeekerId = req.params.id;
        const jobSeeker =
          await this.jobSeekerService.getJobSeekerById(jobSeekerId);

        if (this.isServiceError(res, jobSeeker)) {
          return;
        }

        return this.handleSuccess(res, {
          message: "Success getting job seeker",
          data: jobSeeker,
        });
      },
    );
  }

  private async createJobSeeker() {
    this.router.post(
      "/v1/job-seekers",
      this.mustAuthorized,
      async (req: Request, res: Response) => {
        const reqBody = this.validate<JobSeekerCreateDto>(
          req,
          res,
          JobSeekerCreateSchema,
        );
        if (!reqBody) {
          return;
        }

        const userId = res.locals.userId;
        const newJobSeeker = await this.jobSeekerService.createJobSeeker(
          reqBody,
          userId,
        );
        if (this.isServiceError(res, newJobSeeker)) {
          return;
        }

        const jobSeeker =
          await this.jobSeekerService.getJobSeekerById(newJobSeeker);
        if (this.isServiceError(res, jobSeeker)) {
          return;
        }

        return this.handleSuccess(res, {
          statusCode: StatusCreated,
          message: "Success creating job seeker",
          data: jobSeeker,
        });
      },
    );
  }

  private async updateJobSeeker() {
    this.router.put(
      "/v1/job-seekers",
      this.mustAuthorized,
      async (req: Request, res: Response) => {
        const reqBody = this.validate<JobSeekerUpdateDto>(
          req,
          res,
          JobSeekerUpdateSchema,
        );
        if (!reqBody) {
          return;
        }

        const userId = res.locals.userId;
        const updatedJobSeeker = await this.jobSeekerService.updateJobSeeker(
          reqBody,
          userId,
        );
        if (this.isServiceError(res, updatedJobSeeker)) {
          return;
        }

        const jobSeeker =
          await this.jobSeekerService.getJobSeekerById(updatedJobSeeker);
        if (this.isServiceError(res, jobSeeker)) {
          return;
        }

        return this.handleSuccess(res, {
          statusCode: StatusCreated,
          message: "Success updating job seeker",
          data: jobSeeker,
        });
      },
    );
  }
}

export default JobSeekerController;
