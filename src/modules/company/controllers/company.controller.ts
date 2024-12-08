import { Request, Response } from "express";
import BaseController from "@base/controller";
import { CompanyGetSchema } from "@company/dtos/companyReq.dto";
import CompanyFilter from "@company/services/company.filterService";
import CompanyService from "@company/services/company.service";
import {
  CompanyCreateDto,
  CompanyCreateSchema,
} from "@company/dtos/companyCreate.dto";
import { StatusCreated } from "@consts/statusCodes";
import {
  CompanyUpdateDto,
  CompanyUpdateSchema,
} from "@company/dtos/companyUpdate.dto";
import AuthService from "@auth/services/auth.service";
import { ROLE_COMPANY } from "@enums/consts/roles";

class CompanyController extends BaseController {
  private companyService = new CompanyService();
  private companyFilter = new CompanyFilter();
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService(this.redisClient);
    this.getAllCompanies();
    this.getCompanyById();
    this.createCompany();
    this.updateCompany();
  }

  private async getAllCompanies() {
    this.router.get("/v1/companies", async (req: Request, res: Response) => {
      const reqParam = this.validateQuery(req, res, CompanyGetSchema);
      if (!reqParam) {
        return;
      }

      const paginator = this.paginate(reqParam.page, reqParam.limit);
      const filters = this.companyFilter.handleFilter(reqParam);

      const [companies, count] = await Promise.all([
        this.companyService.getAllCompanies(filters, paginator),
        this.companyService.count(filters),
      ]);
      if (this.isServiceError(res, companies)) {
        return;
      }

      return this.handleSuccess(
        res,
        {
          message: "Success getting companies",
          data: companies,
        },
        this.handlePagination(paginator, count),
      );
    });
  }

  private async getCompanyById() {
    this.router.get(
      "/v1/companies/:id",
      async (req: Request, res: Response) => {
        const companyId = req.params.id;
        const company = await this.companyService.getCompanyById(companyId);

        if (this.isServiceError(res, company)) {
          return;
        }

        return this.handleSuccess(res, {
          message: "Success getting company",
          data: company,
        });
      },
    );
  }

  private async createCompany() {
    this.router.post(
      "/v1/companies",
      this.mustAuthorized,
      async (req: Request, res: Response) => {
        const reqBody = this.validate<CompanyCreateDto>(
          req,
          res,
          CompanyCreateSchema,
        );
        if (!reqBody) {
          return;
        }

        const userId = res.locals.userId;
        const newCompany = await this.companyService.createCompany(
          reqBody,
          userId,
        );
        if (this.isServiceError(res, newCompany)) {
          return;
        }

        const company = await this.companyService.getCompanyById(newCompany);
        if (this.isServiceError(res, company)) {
          return;
        }

        const signData = {
          userId: userId,
          deviceId: res.locals.deviceId,
        };
        const signIn = await this.authService.signIn(signData);
        if (this.isServiceError(res, signIn)) {
          return;
        }

        console.log(signIn);

        res.setHeader("x-access-token", signIn.accessToken);
        res.setHeader("x-refresh-token", signIn.refreshToken);
        res.setHeader("x-user-id", userId);

        return this.handleSuccess(res, {
          statusCode: StatusCreated,
          message: "Success creating company",
          data: company,
        });
      },
    );
  }

  private async updateCompany() {
    this.router.put(
      "/v1/companies",
      this.mustAuthorized,
      this.allowedRoles([ROLE_COMPANY]),
      async (req: Request, res: Response) => {
        const reqBody = this.validate<CompanyUpdateDto>(
          req,
          res,
          CompanyUpdateSchema,
        );
        if (!reqBody) {
          return;
        }

        const userId = res.locals.userId;
        const updatedCompany = await this.companyService.updateCompany(
          reqBody,
          userId,
        );
        if (this.isServiceError(res, updatedCompany)) {
          return;
        }

        const company =
          await this.companyService.getCompanyById(updatedCompany);
        if (this.isServiceError(res, company)) {
          return;
        }

        return this.handleSuccess(res, {
          statusCode: StatusCreated,
          message: "Success updating company",
          data: company,
        });
      },
    );
  }
}

export default CompanyController;
