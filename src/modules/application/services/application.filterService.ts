import BaseFilter from "@base/filter";
import { DataFilter } from "@types";
import { VacancyReqDto } from "@vacancy/dtos/vacancyReq.dto";

class ApplicationFilter extends BaseFilter {
  constructor() {
    super();
  }

  public async handleFilter(
    reqParam: VacancyReqDto,
  ): Promise<DataFilter<VacancyReqDto>> {
    const query = {};

    const sorter = this.handleSorter([], reqParam?.sort, reqParam?.order);

    return { query, sorter };
  }
}

export default ApplicationFilter;
