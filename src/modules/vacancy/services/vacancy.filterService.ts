import BaseFilter from "@base/filter";
import { DataFilter, ResLocals } from "@types";
import { VacancyReqDto } from "@vacancy/dtos/vacancyReq.dto";
import { isValidObjectId } from "mongoose";
import CompanyService from "@company/services/company.service";

class VacancyFilter extends BaseFilter {
  private companyService = new CompanyService();

  constructor() {
    super();
  }

  public async handleFilter(
    reqParam: VacancyReqDto,
    locals: ResLocals,
  ): Promise<DataFilter<VacancyReqDto>> {
    const query = {};

    await this.safelyAssign(
      query,
      "ownedBy",
      reqParam.ownedBy,
      async (props) => {
        if (isValidObjectId(props.value)) {
          return {
            companyId: props.value,
          };
        }

        return null;
      },
    );

    await this.safelyAssign(
      query,
      "ownedByMe",
      reqParam.ownedByMe,
      async (props) => {
        if (props.value === true) {
          return this.handleFilterOwnedByMe(locals.userId as string);
        }

        return null;
      },
    );

    this.safelyAssign(query, "position", reqParam.position);
    this.safelyAssign(query, "jobType", reqParam.jobType);
    this.safelyAssign(query, "incomeType", reqParam.incomeType);
    this.safelyAssign(query, "isClosed", reqParam.isClosed);

    const sortKey = ["position", "jobType", "incomeType"];
    const sorter = this.handleSorter(sortKey, reqParam?.sort, reqParam?.order);

    return { query, sorter };
  }

  private async handleFilterOwnedByMe(userId: string) {
    const company = await this.companyService.findOne({ userId });
    if (!company) {
      return null;
    }

    return {
      companyId: company._id,
    };
  }
}

export default VacancyFilter;
