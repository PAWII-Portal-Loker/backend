import { Request, Response } from "express";
import BaseController from "@base/controller";
import VacancyService from "@vacancy/services/vacancy.service";
import VacancyFilter from "@vacancy/services/vacancy.filterService";
import { VacancyGetSchema } from "@vacancy/dtos/vacancyReq.dto";
import {
  VacancyCreateDto,
  VacancyCreateSchema,
} from "@vacancy/dtos/vacancyCreate.dto";
import { StatusCreated, StatusForbidden, StatusOk } from "@consts/statusCodes";
import {
  VacancyUpdateStatusDto,
  VacancyUpdateStatusSchema,
} from "@vacancy/dtos/vacancyUpdateStatus.dto";
import VacancySubservice from "@vacancy/services/vacancy.subservice";
import {
  VacancyUpdateDto,
  VacancyUpdateSchema,
} from "@vacancy/dtos/vacancyUpdate.dto";
import { ROLE_COMPANY } from "@enums/consts/roles";

class VacancyController extends BaseController {
  private vacancyService = new VacancyService();
  private vacancyFilter = new VacancyFilter();
  private vacancySubservice = new VacancySubservice();

  constructor() {
    super();
    this.getAllVacancies();
    this.getVacancyById();
    this.createVacancy();
    this.updateVacancyStatus();
    this.updateVacancy();
  }

  private async getAllVacancies() {
    this.router.get("/v1/vacancies", async (req: Request, res: Response) => {
      const reqParam = this.validateQuery(req, res, VacancyGetSchema);
      if (!reqParam) {
        return;
      }

      const paginator = this.paginate(reqParam.page, reqParam.limit);
      const filters = await this.vacancyFilter.handleFilter(
        reqParam,
        res.locals,
      );

      const [vacancies, count] = await Promise.all([
        this.vacancyService.getAllVacancies(filters, paginator),
        this.vacancyService.count(filters),
      ]);
      if (this.isServiceError(res, vacancies)) {
        return;
      }

      return this.handleSuccess(
        res,
        {
          message: "Success getting vacancies",
          data: vacancies,
        },
        this.handlePagination(paginator, count),
      );
    });
  }

  private async getVacancyById() {
    this.router.get(
      "/v1/vacancies/:id",
      async (req: Request, res: Response) => {
        const vacancyId = req.params.id;
        const vacancy = await this.vacancyService.getVacancyById(vacancyId);

        if (this.isServiceError(res, vacancy)) {
          return;
        }

        return this.handleSuccess(res, {
          message: "Success getting vacancy",
          data: vacancy,
        });
      },
    );
  }

  private async createVacancy() {
    this.router.post(
      "/v1/vacancies",
      this.mustAuthorized,
      this.allowedRoles([ROLE_COMPANY]),
      async (req: Request, res: Response) => {
        const reqBody = this.validate<VacancyCreateDto>(
          req,
          res,
          VacancyCreateSchema,
        );
        if (!reqBody) {
          return;
        }

        const userId = res.locals.userId;
        const newVacancy = await this.vacancyService.createVacancy(
          reqBody,
          userId,
        );
        if (this.isServiceError(res, newVacancy)) {
          return;
        }

        const vacancy = await this.vacancyService.getVacancyById(newVacancy);
        if (this.isServiceError(res, vacancy)) {
          return;
        }

        return this.handleSuccess(res, {
          statusCode: StatusCreated,
          message: "Success creating vacancy",
          data: vacancy,
        });
      },
    );
  }

  private async updateVacancyStatus() {
    this.router.patch(
      "/v1/vacancies/:id/status",
      this.mustAuthorized,
      this.allowedRoles([ROLE_COMPANY]),
      async (req: Request, res: Response) => {
        const reqBody = this.validate<VacancyUpdateStatusDto>(
          req,
          res,
          VacancyUpdateStatusSchema,
        );
        if (!reqBody) {
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

        const updatedVacancy = await this.vacancyService.updateVacancyStatus(
          vacancyId,
          reqBody,
        );
        if (this.isServiceError(res, updatedVacancy)) {
          return;
        }

        const vacancy =
          await this.vacancyService.getVacancyById(updatedVacancy);
        if (this.isServiceError(res, vacancy)) {
          return;
        }

        return this.handleSuccess(res, {
          statusCode: StatusOk,
          message: "Success updating vacancy status",
          data: vacancy,
        });
      },
    );
  }

  private async updateVacancy() {
    this.router.put(
      "/v1/vacancies/:id",
      this.mustAuthorized,
      this.allowedRoles([ROLE_COMPANY]),
      async (req: Request, res: Response) => {
        const reqBody = this.validate<VacancyUpdateDto>(
          req,
          res,
          VacancyUpdateSchema,
        );
        if (!reqBody) {
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

        const updatedVacancy = await this.vacancyService.updateVacancy(
          vacancyId,
          reqBody,
        );
        if (this.isServiceError(res, updatedVacancy)) {
          return;
        }

        const vacancy =
          await this.vacancyService.getVacancyById(updatedVacancy);
        if (this.isServiceError(res, vacancy)) {
          return;
        }

        return this.handleSuccess(res, {
          statusCode: StatusOk,
          message: "Success updating vacancy",
          data: vacancy,
        });
      },
    );
  }
}

export default VacancyController;
