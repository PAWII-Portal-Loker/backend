import BaseMongoService from "@base/mongoService";
import { userMapper } from "@mapper/user.mapper";
import { DataFilter, Pagination, ServiceError } from "@types";
import { UserDto } from "@user/dtos/user.dto";
import { UserCreateDto } from "@user/dtos/userCreate.dto";
import { UserResDto } from "@user/dtos/userRes.dto";
import { UserModel } from "@user/models/user.model";
import {
  StatusBadRequest,
  StatusConflict,
  StatusNotFound,
} from "@consts/statusCodes";
import { isValidObjectId } from "mongoose";
import * as bcrypt from "bcrypt";

class UserService extends BaseMongoService<UserDto> {
  constructor() {
    super(UserModel);
  }

  public async getAllUsers(
    filters: DataFilter,
    paginator?: Pagination,
  ): Promise<UserResDto[] | ServiceError> {
    const users = await this.find(filters, paginator);
    if (!users) {
      return this.throwError("Error getting users", StatusBadRequest);
    }

    return users.map((user) => userMapper(user));
  }

  public async getUserById(id: string): Promise<UserResDto | ServiceError> {
    if (!isValidObjectId(id)) {
      return this.throwError("Invalid user ID", StatusBadRequest);
    }

    const user = await this.findOne({ _id: id });
    if (!user) {
      return this.throwError("User not found", StatusNotFound);
    }

    return userMapper(user);
  }

  public async createUser(
    data: Partial<UserCreateDto>,
  ): Promise<string | ServiceError> {
    const user = await this.findOne({ email: data.email });
    if (user) {
      return this.throwError("User already exists", StatusConflict);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const newUser = await this.create({
      email: data.email,
      password: data.password,
      waNumber: data.waNumber,
    });
    if (!newUser) {
      return this.throwError("Error creating user", StatusBadRequest);
    }

    return newUser._id as string;
  }
}

export default UserService;
