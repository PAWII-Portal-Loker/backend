import BaseMongoService from "@base/mongoService";
import { ServiceError } from "@types";
import { StatusNotFound } from "@consts/statusCodes";
import { isValidObjectId } from "mongoose";
import { CompanyDto } from "@company/dtos/company.dto";
import { CompanyModel } from "@company/models/company.model";

class CompanySubservice extends BaseMongoService<CompanyDto> {
  constructor() {
    super(CompanyModel);
  }

  public async getCompanyIdByUserId(
    userId: string,
  ): Promise<CompanyDto["_id"] | ServiceError> {
    if (!userId || !isValidObjectId(userId)) {
      return this.throwError("Invalid user ID", StatusNotFound);
    }

    const company = await this.findOne({ userId });
    if (!company) {
      return this.throwError("Company not found", StatusNotFound);
    }

    return company._id;
  }
}

export default CompanySubservice;
