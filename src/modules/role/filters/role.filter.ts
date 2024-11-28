import BaseFilter from "@base/filter";
import { RoleGetDto } from "../dtos/roleGet.dto";
import { DataFilter } from "@types";

class RoleFilter extends BaseFilter {
  public handleFilter(reqParam: RoleGetDto): DataFilter<RoleGetDto> {
    const query = {};

    this.safelyAssign(query, "name", reqParam.name);

    const sortKey = ["name"];
    const sorter = this.handleSorter(sortKey, reqParam?.sort, reqParam?.order);

    return { query, sorter };
  }
}

export default RoleFilter;
