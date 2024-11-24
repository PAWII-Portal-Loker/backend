import BaseFilter from "@base/filter";
import { DataFilter } from "@types";
import { UserGetDto } from "@user/dtos/user/userGet.dto";

class UserFilter extends BaseFilter {
  public handleFilter(reqParam: UserGetDto): DataFilter<UserGetDto> {
    const filters = {};

    this.safelyAssign(filters, "name", reqParam.name);
    this.safelyAssign(filters, "email", reqParam.email);

    const sortKey = ["name", "email"];
    const sorter = this.handleSorter(sortKey, reqParam?.sort, reqParam?.order);

    return [filters, sorter];
  }
}

export default UserFilter;
