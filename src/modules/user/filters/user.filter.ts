import BaseFilter from "@base/filter";
import { UserGetDto } from "@user/dtos/user/userGet.dto";
import { FilterQuery } from "mongoose";

class UserFilter extends BaseFilter {
  public handleFilter(reqParam: UserGetDto): FilterQuery<UserGetDto> {
    const filters = {};

    this.safelyAssign(filters, "name", reqParam.name);
    this.safelyAssign(filters, "email", reqParam.email);

    return filters;
  }
}

export default UserFilter;
