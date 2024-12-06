import BaseFilter from "@base/filter";
import { DataFilter } from "@types";
import { VacancyReqDto } from "@vacancy/dtos/vacancyReq.dto";
import VacancyService from "./vacancy.service";
import { isValidObjectId } from "mongoose";

class VacancyFilter extends BaseFilter {
  private vacancyService = new VacancyService();

  constructor() {
    super();
  }

  public handleFilter(reqParam: VacancyReqDto): DataFilter<VacancyReqDto> {
    const query = {};

    this.safelyAssign(query, "ownedBy", reqParam.position, ({ value }) => {
      if (isValidObjectId(value)) {
        return {
          companyId: value,
        };
      }

      return null;
    });

    this.safelyAssign(query, "ownerByMe", reqParam.position, ({ value }) => {
      if (value === true) {
        // return {
        //   companyId: value,
        // };
        // todo: lanjutin ini
      }

      return null;
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
