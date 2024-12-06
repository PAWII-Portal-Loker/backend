import BaseMongoService from "@base/mongoService";
import CompanyService from "@company/services/company.service";
import { vacancyMapper } from "@mapper/vacancy.mapper";
import { DataFilter, Pagination, ServiceError } from "@types";
import { isIdEquals } from "@utils/compare";
import { StatusBadRequest, StatusNotFound } from "@utils/statusCodes";
import { VacancyDto } from "@vacancy/dtos/vacancy.dto";
import { VacancyCreateDto } from "@vacancy/dtos/vacancyCreate.dto";
import { VacancyResDto } from "@vacancy/dtos/vacancyRes.dto";
import { VacancyUpdateDto } from "@vacancy/dtos/vacancyUpdate.dto";
import { VacancyUpdateStatusDto } from "@vacancy/dtos/vacancyUpdateStatus.dto";
import { VacancyModel } from "@vacancy/models/vacancy.model";
import { isValidObjectId } from "mongoose";

class VacancyService extends BaseMongoService<VacancyDto> {
  private companyService = new CompanyService();

  constructor() {
    super(VacancyModel);
  }

  public async getAllVacancies(
    filters: DataFilter,
    paginator?: Pagination,
  ): Promise<VacancyResDto[] | ServiceError> {
    const vacancies = await this.find(filters, paginator);
    if (!vacancies) {
      return this.throwError("Error getting vacancies", StatusBadRequest);
    }

    const companyIds = vacancies.map((vac) => vac.companyId);

    const companies = await this.companyService.find({
      query: { _id: { $in: companyIds } },
    });
    if (!companies) {
      return this.throwError("Error getting companies", StatusBadRequest);
    }

    return vacancies.map((vacancy) => {
      return vacancyMapper(
        vacancy,
        companies.find((c) => isIdEquals(c._id, vacancy.companyId))!,
      );
    });
  }

  public async getVacancyById(
    id: string,
  ): Promise<VacancyResDto | ServiceError> {
    if (!isValidObjectId(id)) {
      return this.throwError("Invalid vacancy ID", StatusBadRequest);
    }

    const vacancy = await this.findOne({ _id: id });
    if (!vacancy) {
      return this.throwError("vacancy not found", StatusNotFound);
    }

    const company = await this.companyService.findOne({
      _id: vacancy.companyId,
    });
    if (!company) {
      return this.throwError("Error getting company", StatusBadRequest);
    }

    return vacancyMapper(vacancy, company);
  }

  public async createVacancy(
    data: Partial<VacancyCreateDto>,
    userId: string,
  ): Promise<string | ServiceError> {
    const company = await this.companyService.findOne({ userId });
    if (!company) {
      return this.throwError("Company not found", StatusNotFound);
    }

    const createVacancyPayload = {
      companyId: company._id,
      jobType: data.jobType,
      incomeType: data.incomeType,
      position: data.position,
      thumnailUrl: data.thumnailUrl ?? undefined,
      description: data.description,
      is_closed: false,
      applied_count: 0,
    };

    const newVacancy = await this.create(createVacancyPayload);
    if (!newVacancy) {
      return this.throwError("Error creating vacancy", StatusBadRequest);
    }

    return newVacancy._id as string;
  }

  public async updateVacancyStatus(
    vacancyId: string,
    data: VacancyUpdateStatusDto,
  ): Promise<string | ServiceError> {
    if (!isValidObjectId(vacancyId)) {
      return this.throwError("Invalid vacancy ID", StatusBadRequest);
    }

    const updatedVacancy = await this.update(
      { _id: vacancyId },
      { isClosed: data.isClosed },
    );
    if (!updatedVacancy) {
      return this.throwError("Error updating vacancy status", StatusBadRequest);
    }

    return updatedVacancy._id as string;
  }

  public async updateVacancy(
    vacancyId: string,
    data: VacancyUpdateDto,
  ): Promise<string | ServiceError> {
    if (!isValidObjectId(vacancyId)) {
      return this.throwError("Invalid vacancy ID", StatusBadRequest);
    }

    const updatedVacancy = await this.update(
      { _id: vacancyId },
      {
        jobType: data.jobType,
        incomeType: data.incomeType,
        position: data.position,
        thumnailUrl: data.thumnailUrl,
        description: data.description,
      },
    );
    if (!updatedVacancy) {
      return this.throwError("Error updating vacancy", StatusBadRequest);
    }

    return updatedVacancy._id as string;
  }
}

export default VacancyService;
