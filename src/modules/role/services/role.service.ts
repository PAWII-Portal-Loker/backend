import { DataFilter, ServiceError } from "@types";
import { StatusBadRequest } from "@utils/statusCodes";
import { RoleDto } from "../dtos/role.dto";
import BaseMongoService from "@base/mongoService";
import { RoleModel } from "../models/role.model";

class RoleService extends BaseMongoService<RoleDto> {
  constructor() {
    super(RoleModel);
  }

  public async getAllRoles(
    filters: DataFilter,
  ): Promise<RoleDto[] | ServiceError> {
    const roles = await this.find(filters);
    if (!roles) {
      return this.throwError("Error getting roles", StatusBadRequest);
    }

    return roles;
  }
}

export default RoleService;
