import { Request, Response } from "express";
import BaseController from "@base/controller";
import ApplicationService from "@application/services/application.service";
import { ApplicationGetSchema } from "@application/dtos/applicationReq.dto";
import ApplicationFilter from "@application/services/application.filterService";
import { ROLE_COMPANY, ROLE_JOB_SEEKER } from "@enums/consts/roles";
import JobSeekerSubservice from "@jobSeeker/services/jobSeeker.subservice";
import { ApplicationCreateSchema } from "@application/dtos/applicationCreate.dto";
import { StatusCreated, StatusForbidden } from "@consts/statusCodes";
import VacancySubservice from "@vacancy/services/vacancy.subservice";

class ApplicationController extends BaseController {
  private applicationService = new ApplicationService();
  private applicationFilter = new ApplicationFilter();
  private jobSeekerSubservice = new JobSeekerSubservice();
  private vacancySubservice = new VacancySubservice();

  constructor() {
    super();
    this.getAllJobSeekerApplications();
    this.getAllVacancyApplicants();
    this.createApplication();
  }

  private async getAllJobSeekerApplications() {
    this.router.get(
      "/v1/applications",
      this.mustAuthorized,
      this.allowedRoles([ROLE_JOB_SEEKER]),
      async (req: Request, res: Response) => {
        const reqParam = this.validateQuery(req, res, ApplicationGetSchema);
        if (!reqParam) {
          return;
        }

        const userId = res.locals.userId;
        const jobSeekerId =
          await this.jobSeekerSubservice.getJobSeekerIdByUserId(userId);
        if (this.isServiceError(res, jobSeekerId)) {
          return;
        }

        const paginator = this.paginate(reqParam.page, reqParam.limit);
        const filters = await this.applicationFilter.handleFilter(reqParam);

        Object.assign(filters.query, { jobSeekerId });

        const [applications, count] = await Promise.all([
          this.applicationService.getAllJobSeekerApplications(
            filters,
            paginator,
          ),
          this.applicationService.count(filters),
        ]);
        if (this.isServiceError(res, applications)) {
          return;
        }

        return this.handleSuccess(
          res,
          {
            message: "Success getting applications",
            data: applications,
          },
          this.handlePagination(paginator, count),
        );
      },
    );
  }

  private async getAllVacancyApplicants() {
    this.router.get(
      "/v1/vacancies/:id/applicants",
      this.mustAuthorized,
      this.allowedRoles([ROLE_COMPANY]),
      async (req: Request, res: Response) => {
        const reqParam = this.validateQuery(req, res, ApplicationGetSchema);
        if (!reqParam) {
          return;
        }

        const userId = res.locals.userId;
        const vacancyId = req.params.id;
        const isOwner = this.vacancySubservice.isUserVacancyOwner(
          userId,
          vacancyId,
        );
        if (this.isServiceError(res, isOwner)) {
          return;
        }
        if (!isOwner) {
          return this.handleError(res, {
            message: "You are not the owner of this vacancy",
            statusCode: StatusForbidden,
          });
        }

        const paginator = this.paginate(reqParam.page, reqParam.limit);
        const filters = await this.applicationFilter.handleFilter(reqParam);

        Object.assign(filters.query, { vacancyId });

        const [applicants, count] = await Promise.all([
          this.applicationService.getAllVacancyApplicants(filters, paginator),
          this.applicationService.count(filters),
        ]);
        if (this.isServiceError(res, applicants)) {
          return;
        }

        return this.handleSuccess(
          res,
          {
            message: "Success getting vacancy applicants",
            data: applicants,
          },
          this.handlePagination(paginator, count),
        );
      },
    );
  }

  private async createApplication() {
    this.router.post(
      "/v1/applications",
      this.mustAuthorized,
      this.allowedRoles([ROLE_JOB_SEEKER]),
      async (req: Request, res: Response) => {
        const reqBody = this.validate(req, res, ApplicationCreateSchema);
        if (!reqBody) {
          return;
        }

        const userId = res.locals.userId;
        const jobSeekerId =
          await this.jobSeekerSubservice.getJobSeekerIdByUserId(userId);
        if (this.isServiceError(res, jobSeekerId)) {
          return;
        }

        const newApplication = await this.applicationService.createApplication(
          reqBody,
          jobSeekerId,
        );
        if (this.isServiceError(res, newApplication)) {
          return;
        }

        const application =
          await this.applicationService.getJobSeekerApplicationById(
            newApplication,
          );
        if (this.isServiceError(res, application)) {
          return;
        }

        return this.handleSuccess(res, {
          statusCode: StatusCreated,
          message: "Success creating application",
          data: application,
        });
      },
    );
  }
}

export default ApplicationController;
