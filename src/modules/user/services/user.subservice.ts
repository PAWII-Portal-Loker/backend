import { UserDto } from "@user/dtos/user.dto";
import { ServiceError } from "@types";
import { StatusBadRequest, StatusNotFound } from "@utils/statusCodes";
import BaseMongoService from "@base/mongoService";
import { UserModel } from "@user/models/user.model";
import { RolesEnum } from "src/modules/enums/consts/roles";

class UserSubservice extends BaseMongoService<UserDto> {
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
  ): Promise<RolesEnum | ServiceError> {
    const user = await this.findOne({ _id: userId });
    if (!user) {
      return this.throwError("User not found", StatusNotFound);
    }

    return user.role;
  }
}

export default UserSubservice;
