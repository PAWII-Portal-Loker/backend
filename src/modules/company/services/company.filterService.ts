import BaseFilter from "@base/filter";
import { CompanyReqDto } from "@company/dtos/companyReq.dto";
import { DataFilter } from "@types";

class CompanyFilter extends BaseFilter {
  public handleFilter(reqParam: CompanyReqDto): DataFilter<CompanyReqDto> {
    const query = {};

    this.safelyAssign(query, "companyName", reqParam.companyName);
    this.safelyAssign(query, "companyType", reqParam.companyType);

    const sortKey = ["companyName", "companyType"];
    const sorter = this.handleSorter(sortKey, reqParam?.sort, reqParam?.order);

    return { query, sorter };
  }
}

export default CompanyFilter;
