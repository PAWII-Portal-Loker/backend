import { DataFilter, ServiceError } from "@types";
import { StatusBadRequest } from "@utils/statusCodes";
import { RoleDto, RoleResponseDto } from "../dtos/role.dto";
import BaseMongoService from "@base/mongoService";
import { RoleModel } from "../models/role.model";

class RoleService extends BaseMongoService<RoleDto> {
  constructor() {
    super(RoleModel);
  }

  public async getAllRoles(
    filters: DataFilter,
  ): Promise<RoleResponseDto[] | ServiceError> {
    const roles = await this.find(filters);
    if (!roles) {
      return this.throwError("Error getting roles", StatusBadRequest);
    }

    return this.#mapResponse(roles);
  }

  public async getRoleById(id: string): Promise<RoleDto | ServiceError> {
    const role = await this.findOne({ _id: id });
    if (!role) {
      return this.throwError("Role not found", StatusBadRequest);
    }

    return role;
  }

  #mapResponse(data: RoleDto[]): RoleResponseDto[] {
    return data.map((role) => ({
      id: role._id as string,
      name: role.name,
    }));
  }
}

export default RoleService;
