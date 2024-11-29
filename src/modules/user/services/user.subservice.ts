import { UserDto } from "@user/dtos/user.dto";
import { ServiceError } from "@types";
import { StatusBadRequest, StatusNotFound } from "@utils/statusCodes";
import BaseMongoService from "@base/mongoService";
import { UserModel } from "@user/models/user.model";
import { RoleResponseDto } from "src/modules/role/dtos/role.dto";
import RoleService from "src/modules/role/services/role.service";

class UserSubservice extends BaseMongoService<UserDto> {
  private roleService = new RoleService();

  constructor() {
    super(UserModel);
  }

  public async isUserExists(
    user: Partial<UserDto>,
  ): Promise<boolean | ServiceError> {
    if (user.email) {
      return !!(await this.findOne({ email: user.email }));
    }

    if (user._id) {
      return !!(await this.findOne({ _id: user._id }));
    }

    return this.throwError("Invalid user data", StatusBadRequest);
  }

  public async validateLogin(
    data: Partial<UserDto>,
  ): Promise<UserDto | ServiceError> {
    const user = await this.findOne({ email: data.email });
    if (!user) {
      return this.throwError("User not found", StatusNotFound);
    }

    if (user.password !== data.password) {
      return this.throwError("Invalid password", StatusBadRequest);
    }

    return user;
  }

  public async getRoleByUserId(
    userId: string,
  ): Promise<RoleResponseDto | ServiceError> {
    const user = await this.findOne({ _id: userId });
    if (!user) {
      return this.throwError("User not found", StatusNotFound);
    }

    const role = await this.roleService.findOne({ _id: user.role_id });
    if (!role) {
      return this.throwError("Role not found", StatusNotFound);
    }

    return {
      id: role._id as string,
      name: role.name,
    };
  }
}

export default UserSubservice;
