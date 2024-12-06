import BaseFilter from "@base/filter";
import { DataFilter } from "@types";
import { VacancyReqDto } from "@vacancy/dtos/vacancyReq.dto";

class VacancyFilter extends BaseFilter {
  public handleFilter(reqParam: VacancyReqDto): DataFilter<VacancyReqDto> {
    const query = {};

    this.safelyAssign(query, "ownedBy", reqParam.position, ({ key, value }) => {
      return {
        // TODO: specify the filter here...
        [key]: value,
      };
    });
    this.safelyAssign(query, "position", reqParam.position);
    this.safelyAssign(query, "jobType", reqParam.jobType);
    this.safelyAssign(query, "incomeType", reqParam.incomeType);
    this.safelyAssign(query, "isClosed", reqParam.isClosed);

    const sortKey = ["position", "jobType", "incomeType"];
    const sorter = this.handleSorter(sortKey, reqParam?.sort, reqParam?.order);

    return { query, sorter };
  }
}

export default VacancyFilter;
