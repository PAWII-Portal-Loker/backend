import BaseMongoService from "@base/mongoService";
import { DataFilter, Pagination, ServiceError } from "@types";
import { UserDto, UserResponseDto } from "@user/dtos/user.dto";
import { UserCreateDto } from "@user/dtos/userCreate.dto";
import { UserModel } from "@user/models/user.model";
import {
  StatusBadRequest,
  StatusConflict,
  StatusNotFound,
} from "@utils/statusCodes";
import { isValidObjectId } from "mongoose";
import RoleSubservice from "src/modules/role/services/role.subservice";
import { RoleDto } from "src/modules/role/dtos/role.dto";
import RoleService from "src/modules/role/services/role.service";
import { isIdEquals } from "@utils/compare";

class UserService extends BaseMongoService<UserDto> {
  private roleService = new RoleService();
  private roleSubservice = new RoleSubservice();

  constructor() {
    super(UserModel);
  }

  public async getAllUsers(
    filters: DataFilter,
    paginator?: Pagination,
  ): Promise<UserResponseDto[] | ServiceError> {
    const users = await this.find(filters, paginator);
    if (!users) {
      return this.throwError("Error getting users", StatusBadRequest);
    }

    const roleIds = [...new Set(users.map((user) => user.roleId))];
    const roles = await this.roleService.find({
      query: { _id: { $in: roleIds } },
    });
    if (!roles) {
      return this.throwError("Roles not found", StatusNotFound);
    }

    return users.map((user) =>
      this.#mapResponse(
        user,
        roles.find((role) => isIdEquals(user.roleId, role._id)),
      ),
    );
  }

  public async getUserById(
    id: string,
  ): Promise<UserResponseDto | ServiceError> {
    if (!isValidObjectId(id)) {
      return this.throwError("Invalid user ID", StatusBadRequest);
    }

    const user = await this.findOne({ _id: id });
    if (!user) {
      return this.throwError("User not found", StatusNotFound);
    }

    const role = await this.roleService.findOne({ _id: user.roleId });
    if (!role) {
      return this.throwError("Role not found", StatusNotFound);
    }

    return this.#mapResponse(user, role);
  }

  public async createUser(
    data: Partial<UserCreateDto>,
  ): Promise<string | ServiceError> {
    const user = await this.findOne({ email: data.email });
    if (user) {
      return this.throwError("User already exists", StatusConflict);
    }

    const role = await this.roleSubservice.isRoleExists({ _id: data.role?.id });
    if (!role) {
      return this.throwError("Role not found", StatusNotFound);
    }

    const newUser = await this.create({
      name: data.name,
      email: data.email,
      password: data.password,
      roleId: data.role?.id,
    });
    if (!newUser) {
      return this.throwError("Error creating user", StatusBadRequest);
    }

    return newUser._id as string;
  }

  #mapResponse(user: UserDto, role?: RoleDto): UserResponseDto {
    return {
      id: user._id as string,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: {
        id: (role?._id as string) ?? "",
        name: (role?.name as string) ?? "",
      },
    };
  }
}

export default UserService;
