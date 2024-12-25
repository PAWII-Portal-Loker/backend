import BaseMongoService from "@base/mongoService";
import { DataFilter, Pagination, ServiceError } from "@types";
import { isIdEquals } from "@utils/compare";
import { StatusBadRequest } from "@consts/statusCodes";
import { ApplicationDto } from "@application/dtos/application.dto";
import { ApplicationModel } from "@application/models/application.model";
import { ApplicationResDto } from "@application/dtos/applicationRes.dto";
import VacancyService from "@vacancy/services/vacancy.service";
import JobSeekerService from "@jobSeeker/services/jobSeeker.service";
import CompanyService from "@company/services/company.service";
import UserService from "@user/services/user.service";
import {
  jobSeekerApplicationMapper,
  vacancyApplicantMapper,
} from "@mapper/application.mapper";
import { ApplicationCreateDto } from "@application/dtos/applicationCreate.dto";
import { JobSeekerDto } from "@jobSeeker/dtos/jobSeeker.dto";
import { isValidObjectId } from "mongoose";

class ApplicationService extends BaseMongoService<ApplicationDto> {
  private vacancyService = new VacancyService();
  private jobSeekerService = new JobSeekerService();
  private companyService = new CompanyService();
  private userService = new UserService();

  constructor() {
    super(ApplicationModel);
  }

  public async getAllJobSeekerApplications(
    filters: DataFilter,
    paginator: Pagination,
  ): Promise<ApplicationResDto[] | ServiceError> {
    const applications = await this.find(filters, paginator);
    if (!applications) {
      return this.throwError("Error getting applications", StatusBadRequest);
    }

    const vacancyIds = applications.map((app) => app.vacancyId);
    const vacancies = await this.vacancyService.find({
      query: { _id: { $in: vacancyIds } },
    });
    if (!vacancies) {
      return this.throwError("Error getting vacancies", StatusBadRequest);
    }

    const companyIds = vacancies.map((vac) => vac.companyId);
    const companies = await this.companyService.find({
      query: { _id: { $in: companyIds } },
    });
    if (!companies) {
      return this.throwError("Error getting companies", StatusBadRequest);
    }

    const companyUserIds = companies.map((c) => c.userId);
    const companyUsers = await this.userService.find({
      query: { _id: { $in: companyUserIds } },
    });
    if (!companyUsers) {
      return this.throwError("Error getting users", StatusBadRequest);
    }

    return applications.map((application) => {
      const vacancy = vacancies.find((v) =>
        isIdEquals(v._id, application.vacancyId),
      )!;
      const company = companies.find((c) =>
        isIdEquals(c._id, vacancy.companyId),
      )!;
      const companyUser = companyUsers.find((u) =>
        isIdEquals(u._id, company.userId),
      )!;

      return jobSeekerApplicationMapper(
        application,
        vacancy,
        company,
        companyUser,
      );
    });
  }

  public async getJobSeekerApplicationById(
    id: string,
  ): Promise<ApplicationResDto | ServiceError> {
    if (!isValidObjectId(id)) {
      return this.throwError("Invalid application ID", StatusBadRequest);
    }

    const application = await this.findOne({ _id: id });
    if (!application) {
      return this.throwError("Application not found", StatusBadRequest);
    }

    const vacancy = await this.vacancyService.findOne({
      _id: application.vacancyId,
    });
    if (!vacancy) {
      return this.throwError("Error getting vacancy", StatusBadRequest);
    }

    const company = await this.companyService.findOne({
      _id: vacancy.companyId,
    });
    if (!company) {
      return this.throwError("Error getting company", StatusBadRequest);
    }

    const companyUser = await this.userService.findOne({ _id: company.userId });
    if (!companyUser) {
      return this.throwError("Error getting company user", StatusBadRequest);
    }

    return jobSeekerApplicationMapper(
      application,
      vacancy,
      company,
      companyUser,
    );
  }

  public async getAllVacancyApplicants(
    filters: DataFilter,
    paginator: Pagination,
  ): Promise<ApplicationResDto[] | ServiceError> {
    const applications = await this.find(filters, paginator);
    if (!applications) {
      return this.throwError("Error getting applications", StatusBadRequest);
    }

    const jobSeekerIds = applications.map((app) => app.jobSeekerId);
    const jobSeekers = await this.jobSeekerService.find({
      query: { _id: { $in: jobSeekerIds } },
    });
    if (!jobSeekers) {
      return this.throwError("Error getting job seekers", StatusBadRequest);
    }

    const userIds = jobSeekers.map((js) => js.userId);
    const users = await this.userService.find({
      query: { _id: { $in: userIds } },
    });
    if (!users) {
      return this.throwError("Error getting users", StatusBadRequest);
    }

    return applications.map((application) => {
      const jobSeeker = jobSeekers.find((js) =>
        isIdEquals(js._id, application.jobSeekerId),
      )!;
      const user = users.find((u) => isIdEquals(u._id, jobSeeker.userId))!;

      return vacancyApplicantMapper(application, jobSeeker, user);
    });
  }

  public async getVacancyApplicantById(
    id: string,
  ): Promise<ApplicationResDto | ServiceError> {
    if (!isValidObjectId(id)) {
      return this.throwError("Invalid application ID", StatusBadRequest);
    }

    const application = await this.findOne({ _id: id });
    if (!application) {
      return this.throwError("Application not found", StatusBadRequest);
    }

    const jobSeeker = await this.jobSeekerService.findOne({
      _id: application.jobSeekerId,
    });
    if (!jobSeeker) {
      return this.throwError("Error getting job seeker", StatusBadRequest);
    }

    const user = await this.userService.findOne({ _id: jobSeeker.userId });
    if (!user) {
      return this.throwError("Error getting user", StatusBadRequest);
    }

    return vacancyApplicantMapper(application, jobSeeker, user);
  }

  public async createApplication(
    data: Partial<ApplicationCreateDto>,
    jobSeekerId: JobSeekerDto["_id"],
  ): Promise<string | ServiceError> {
    const application = await this.findOne({
      jobSeekerId,
      vacancyId: data.vacancyId,
    });
    if (application) {
      return this.throwError("Application already exists", StatusBadRequest);
    }

    const vacancy = await this.vacancyService.findOne({ _id: data.vacancyId });
    if (!vacancy) {
      return this.throwError("Vacancy not found", StatusBadRequest);
    }

    if (vacancy.isClosed) {
      return this.throwError("Vacancy is closed", StatusBadRequest);
    }

    const createApplicationPayload = {
      jobSeekerId,
      vacancyId: data.vacancyId,
      message: data.message,
      documentUrls: data.documentUrls,
    };
    const newApplication = await this.create(createApplicationPayload);
    if (!newApplication) {
      return this.throwError("Error creating application", StatusBadRequest);
    }

    // async update
    this.vacancyService.update(
      { _id: data.vacancyId },
      {
        appliedCount: vacancy.appliedCount + 1,
      },
    );

    return newApplication._id as string;
  }
}

export default ApplicationService;
