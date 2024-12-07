import BaseMongoService from "@base/mongoService";
import CompanyService from "@company/services/company.service";
import { ServiceError } from "@types";
import { isIdEquals } from "@utils/compare";
import { StatusNotFound } from "@consts/statusCodes";
import { VacancyDto } from "@vacancy/dtos/vacancy.dto";
import { VacancyModel } from "@vacancy/models/vacancy.model";

class VacancySubservice extends BaseMongoService<VacancyDto> {
  private companyService = new CompanyService();

  constructor() {
    super(VacancyModel);
  }

  public async isUserVacancyOwner(
    userId: string,
    vacancyId: string,
  ): Promise<boolean | ServiceError> {
    const company = await this.companyService.findOne({ userId });
    if (!company) {
      return this.throwError("Company not found", StatusNotFound);
    }

    const vacancy = await this.findOne({ _id: vacancyId });
    if (!vacancy) {
      return this.throwError("Vacancy not found", StatusNotFound);
    }

    return isIdEquals(company._id, vacancy.companyId);
  }
}

export default VacancySubservice;
