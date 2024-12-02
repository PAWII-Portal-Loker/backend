import { orderByMap } from "@consts";
import { DataFilter, Pagination } from "@types";
import { Document, Model, FilterQuery, UpdateQuery } from "mongoose";
import BaseService from "./service";

class BaseMongoService<T extends Document> extends BaseService {
  private model: Model<T>;

  constructor(model: Model<T>) {
    super();
    this.model = model;
  }

  public async create(data: Partial<T>): Promise<T | null> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async find(
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

      const sorter = filter?.sorter;
      if (sorter) {
        query
          .sort({ [sorter.sort]: orderByMap[sorter.order] })
          .collation({ locale: "en", caseLevel: true });
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

  public async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter).exec();
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async update(
    filter: FilterQuery<T>,
    updateData: UpdateQuery<T>,
  ): Promise<T | null> {
    try {
      return await this.model
        .findOneAndUpdate(filter, updateData, { new: false })
        .exec();
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async delete(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndDelete(filter).exec();
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default BaseMongoService;
