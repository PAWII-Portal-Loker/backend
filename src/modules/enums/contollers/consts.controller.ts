import { Request, Response } from "express";
import BaseController from "@base/controller";
import ConstsService from "@enums/services/consts.service";

class ConstsController extends BaseController {
  private constsService = new ConstsService();

  constructor() {
    super();
    this.getAllConsts();
    this.getAllCompanyTypes();
    this.getAllIncomeTypes();
    this.getAllJobTypes();
    this.getAllRoles();
  }

  private getAllConsts() {
    this.router.get("/v1/consts", (_: Request, res: Response) => {
      const companyTypes = this.constsService.getAllCompanyTypes();
      const incomeTypes = this.constsService.getAllIncomeTypes();
      const jobTypes = this.constsService.getAllJobTypes();
      const roles = this.constsService.getAllRoles();

      return this.handleSuccess(res, {
        message: "Success getting all consts",
        data: {
          companyTypes,
          incomeTypes,
          jobTypes,
          roles,
        },
      });
    });
  }

  private getAllCompanyTypes() {
    this.router.get(
      "/v1/consts/company-types",
      (req: Request, res: Response) => {
        const keyword = req.query["keyword"] as string;
        const result = this.constsService.getAllCompanyTypes(keyword);

        return this.handleSuccess(res, {
          message: "Success getting company types",
          data: result,
        });
      },
    );
  }

  private getAllIncomeTypes() {
    this.router.get(
      "/v1/consts/income-types",
      (req: Request, res: Response) => {
        const keyword = req.query["keyword"] as string;
        const result = this.constsService.getAllIncomeTypes(keyword);

        return this.handleSuccess(res, {
          message: "Success getting income types",
          data: result,
        });
      },
    );
  }
  private getAllJobTypes() {
    this.router.get("/v1/consts/job-types", (req: Request, res: Response) => {
      const keyword = req.query["keyword"] as string;
      const result = this.constsService.getAllJobTypes(keyword);

      return this.handleSuccess(res, {
        message: "Success getting job types",
        data: result,
      });
    });
  }

  private getAllRoles() {
    this.router.get("/v1/consts/roles", (req: Request, res: Response) => {
      const keyword = req.query["keyword"] as string;
      const result = this.constsService.getAllRoles(keyword);

      return this.handleSuccess(res, {
        message: "Success getting roles",
        data: result,
      });
    });
  }
}

export default ConstsController;
