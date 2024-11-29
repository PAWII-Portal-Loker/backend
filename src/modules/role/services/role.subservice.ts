import { ServiceError } from "@types";
import { StatusBadRequest } from "@utils/statusCodes";
import { RoleDto } from "../dtos/role.dto";
import BaseMongoService from "@base/mongoService";
import { RoleModel } from "../models/role.model";

class RoleSubservice extends BaseMongoService<RoleDto> {
  constructor() {
    super(RoleModel);
  }

  public async isRoleExists(
    role: Partial<RoleDto>,
  ): Promise<boolean | ServiceError> {
    if (role._id) {
      return !!(await this.findOne({ _id: role._id }));
    }

    return this.throwError("Invalid role data", StatusBadRequest);
  }
}

export default RoleSubservice;
