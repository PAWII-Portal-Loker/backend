import { orderByMap } from "@consts";
import { DataFilter, Pagination, ServiceError, StatusCodes } from "@types";
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

  protected async find(
    filter: DataFilter<T> = { query: {}, sorter: null },
    paginator?: Pagination,
  ): Promise<T[] | null> {
    try {
      const query = this.model.find(filter.query);
      if (paginator) {
        query
          .limit(paginator.limit)
          .skip(paginator.limit * (paginator.page - 1));
      }

      const sorter = filter.sorter;
      if (sorter) {
        query.sort({ [sorter.sort]: orderByMap[sorter.order] });
      }

      return await query.exec();
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async count(filter: DataFilter<T>): Promise<number | null> {
    try {
      return await this.model.find(filter.query).countDocuments();
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
