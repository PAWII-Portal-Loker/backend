import BaseMongoService from "@base/mongoService";
import { DataFilter, Pagination, ServiceError } from "@types";
import { UserDto } from "@user/dtos/user.dto";
import { UserCreateDto } from "@user/dtos/userCreate.dto";
import { UserResDto } from "@user/dtos/userRes.dto";
import { UserModel } from "@user/models/user.model";
import {
  StatusBadRequest,
  StatusConflict,
  StatusNotFound,
} from "@utils/statusCodes";
import { isValidObjectId } from "mongoose";

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

    return users.map((user) => this.#mapResponse(user));
  }

  public async getUserById(id: string): Promise<UserResDto | ServiceError> {
    if (!isValidObjectId(id)) {
      return this.throwError("Invalid user ID", StatusBadRequest);
    }

    const user = await this.findOne({ _id: id });
    if (!user) {
      return this.throwError("User not found", StatusNotFound);
    }

    return this.#mapResponse(user);
  }

  public async createUser(
    data: Partial<UserCreateDto>,
  ): Promise<string | ServiceError> {
    const user = await this.findOne({ email: data.email });
    if (user) {
      return this.throwError("User already exists", StatusConflict);
    }

    const newUser = await this.create({
      email: data.email,
      password: data.password,
      waNumber: data.wa_number,
    });
    if (!newUser) {
      return this.throwError("Error creating user", StatusBadRequest);
    }

    return newUser._id as string;
  }

  #mapResponse(user: UserDto): UserResDto {
    return {
      id: user._id as string,
      role: user?.role ?? "",
      email: user?.email ?? "",
      waNumber: user?.waNumber ?? "",
      imageUrl: user?.imageUrl ?? "",
      bio: user?.bio ?? "",
      province: user?.province ?? "",
      city: user?.city ?? "",
      subdistrict: user?.subdistrict ?? "",
      address: user?.address ?? "",
      createdAt: user?.createdAt ?? "",
      updatedAt: user?.updatedAt ?? "",
    };
  }
}

export default UserService;
