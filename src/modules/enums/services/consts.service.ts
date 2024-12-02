import { COMPANY_TYPES } from "@enums/consts/companyTypes";
import { INCOME_TYPES } from "@enums/consts/incomeTypes";
import { JOB_TYPES } from "@enums/consts/jobTypes";
import { ROLES } from "@enums/consts/roles";

class ConstsService {
  constructor() {}

  public getAllCompanyTypes(keyword?: string): string[] {
    const result = COMPANY_TYPES;
    if (keyword) {
      return result.filter((companyType) =>
        companyType.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    return result;
  }

  public getAllIncomeTypes(keyword?: string): string[] {
    const result = INCOME_TYPES;
    if (keyword) {
      return result.filter((incomeType) =>
        incomeType.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    return result;
  }

  public getAllJobTypes(keyword?: string): string[] {
    const result = JOB_TYPES;
    if (keyword) {
      return result.filter((jobType) =>
        jobType.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    return result;
  }

  public getAllRoles(keyword?: string): string[] {
    const result = ROLES;
    if (keyword) {
      return result.filter((role) =>
        role.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    return result;
  }
}

export default ConstsService;
