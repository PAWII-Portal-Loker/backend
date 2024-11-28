import BaseFilter from "@base/filter";
import { DataFilter } from "@types";
import { UserGetDto } from "@user/dtos/userGet.dto";

class UserFilter extends BaseFilter {
  public handleFilter(reqParam: UserGetDto): DataFilter<UserGetDto> {
    const query = {};

    this.safelyAssign(query, "name", reqParam.name);
    this.safelyAssign(query, "email", reqParam.email);

    const sortKey = ["name", "email"];
    const sorter = this.handleSorter(sortKey, reqParam?.sort, reqParam?.order);

    return { query, sorter };
  }
}

export default UserFilter;
