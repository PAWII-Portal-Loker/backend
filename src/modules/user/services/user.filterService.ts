import BaseFilter from "@base/filter";
import { DataFilter } from "@types";
import { UserReqDto } from "@user/dtos/userReq.dto";

class UserFilter extends BaseFilter {
  public handleFilter(reqParam: UserReqDto): DataFilter<UserReqDto> {
    const query = {};

    this.safelyAssign(query, "name", reqParam.name);
    this.safelyAssign(query, "email", reqParam.email);

    const sortKey = ["name", "email"];
    const sorter = this.handleSorter(sortKey, reqParam?.sort, reqParam?.order);

    return { query, sorter };
  }
}

export default UserFilter;
