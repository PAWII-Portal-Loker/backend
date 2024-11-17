import { ServiceError, StatusCodes } from "@types";
import { Document, Model, FilterQuery, UpdateQuery } from "mongoose";

class BaseService<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  protected async create(data: Partial<T>): Promise<T | null> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async find(filter: FilterQuery<T> = {}): Promise<T[] | null> {
    try {
      return await this.model.find(filter).exec();
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter).exec();
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async update(
    filter: FilterQuery<T>,
    updateData: UpdateQuery<T>,
  ): Promise<T | null> {
    try {
      return await this.model
        .findOneAndUpdate(filter, updateData, { new: true })
        .exec();
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async delete(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndDelete(filter).exec();
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected throwError(message: string, statusCode: StatusCodes): ServiceError {
    return { error: true, message, statusCode };
  }

  private handleError(error: unknown): null {
    if (error instanceof Error) {
      console.error(new Error(error.message));
    } else {
      console.error(new Error("An error occurred"));
    }

    return null;
  }
}

export default BaseService;
