import { UserDto } from "@user/dtos/user/user.dto";
import UserService from "./user.service";
import { ServiceError } from "@types";
import { StatusBadRequest, StatusNotFound } from "@utils/statusCodes";

class UserSubservice extends UserService {
  constructor() {
    super();
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
}

export default UserSubservice;
