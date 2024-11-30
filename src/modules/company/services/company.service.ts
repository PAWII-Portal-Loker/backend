import BaseMongoService from "@base/mongoService";
import { DataFilter, Pagination, ServiceError } from "@types";
import {
  StatusBadRequest,
  StatusConflict,
  StatusNotFound,
} from "@utils/statusCodes";
import { isValidObjectId } from "mongoose";
import { CompanyModel } from "../models/company.model";
import { CompanyDto } from "../dtos/company.dto";
import { CompanyResDto } from "../dtos/companyRes.dto";
import { companyMapper } from "src/mapper/company.mapper";
import UserService from "@user/services/user.service";
import { isIdEquals } from "@utils/compare";
import { CompanyCreateDto } from "../dtos/companyCreate.dto";
import moment from "moment";

class CompanyService extends BaseMongoService<CompanyDto> {
  private userService = new UserService();

  constructor() {
    super(CompanyModel);
  }

  public async getAllCompanies(
    filters: DataFilter,
    paginator?: Pagination,
  ): Promise<CompanyResDto[] | ServiceError> {
    const companies = await this.find(filters, paginator);
    if (!companies) {
      return this.throwError("Error getting companies", StatusBadRequest);
    }

    const userIds = companies.map((company) => company.userId);

    const users = await this.userService.find({
      query: { _id: { $in: userIds } },
    });
    if (!users) {
      return this.throwError("Error getting users", StatusBadRequest);
    }

    return companies.map((company) => {
      return companyMapper(
        company,
        users.find((u) => isIdEquals(u._id, company.userId))!,
      );
    });
  }

  public async getCompanyById(
    id: string,
  ): Promise<CompanyResDto | ServiceError> {
    if (!isValidObjectId(id)) {
      return this.throwError("Invalid company ID", StatusBadRequest);
    }

    const company = await this.findOne({ _id: id });
    if (!company) {
      return this.throwError("User not found", StatusNotFound);
    }

    const user = await this.userService.findOne({ _id: company.userId });
    if (!user) {
      return this.throwError("Error getting user", StatusBadRequest);
    }

    return companyMapper(company, user);
  }

  public async createCompany(
    data: Partial<CompanyCreateDto>,
    userId: string,
  ): Promise<string | ServiceError> {
    const company = await this.findOne({ userId });
    if (company) {
      return this.throwError("Company already registered", StatusConflict);
    }

    const newCompany = await this.create({
      companyType: data.companyType,
      companyName: data.companyName,
      foundingDate: moment(data.foundingDate).toDate(),
      employeeTotal: data.employeeTotal,
      earlyWorkingHour: data.earlyWorkingHour,
      endWorkingHour: data.earlyWorkingHour,
    });
    if (!newCompany) {
      return this.throwError("Error creating company", StatusBadRequest);
    }

    return newCompany._id as string;
  }
}

export default CompanyService;
