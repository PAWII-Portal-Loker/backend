import { Request, Response } from "express";
import BaseController from "@base/controller";
import RoleService from "../services/role.service";
import RoleFilter from "../filters/role.filter";
import { RoleGetSchema } from "../dtos/roleGet.dto";

class RoleController extends BaseController {
  private roleService = new RoleService();
  private roleFilter = new RoleFilter();

  constructor() {
    super();
    this.getAllRoles();
  }

  private async getAllRoles() {
    this.router.get("/v1/roles", async (req: Request, res: Response) => {
      const reqParam = this.validateQuery(req, res, RoleGetSchema);
      if (!reqParam) {
        return;
      }

      const filters = this.roleFilter.handleFilter(reqParam);
      const roles = await this.roleService.getAllRoles(filters);
      if (this.isServiceError(res, roles)) {
        return;
      }

      return this.handleSuccess(res, {
        message: "Success getting roles",
        data: roles,
      });
    });
  }
}

export default RoleController;
