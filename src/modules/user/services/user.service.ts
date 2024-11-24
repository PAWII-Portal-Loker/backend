import BaseService from "@base/service";
import { DataFilter, Pagination, ServiceError } from "@types";
import { UserDto } from "@user/dtos/user/user.dto";
import { UserModel } from "@user/models/user.model";
import {
  StatusBadRequest,
  StatusConflict,
  StatusNotFound,
} from "@utils/statusCodes";
import { isValidObjectId } from "mongoose";

class UserService extends BaseService<UserDto> {
  constructor() {
    super(UserModel);
  }

  public async getAllUsers(
    filters: DataFilter,
    paginator?: Pagination,
  ): Promise<UserDto[] | ServiceError> {
    const users = await this.find(filters, paginator);
    if (!users) {
      return this.throwError("Error getting users", StatusBadRequest);
    }

    return users;
  }

  public async getUserById(id: string): Promise<UserDto | ServiceError> {
    if (!isValidObjectId(id)) {
      return this.throwError("Invalid user ID", StatusBadRequest);
    }

    const user = await this.findOne({ _id: id });
    if (!user) {
      return this.throwError("User not found", StatusNotFound);
    }

    return user;
  }

  public async createUser(
    data: Partial<UserDto>,
  ): Promise<UserDto | ServiceError> {
    const user = await this.findOne({ email: data.email });
    if (user) {
      return this.throwError("User already exists", StatusConflict);
    }

    const newUser = await this.create(data);
    if (!newUser) {
      return this.throwError("Error creating user", StatusBadRequest);
    }

    return newUser;
  }
}

export default UserService;
