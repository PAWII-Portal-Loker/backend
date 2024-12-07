import RedisDatabase from "@config/databases/redis";
import { Response as DataResponse, Pagination, ServiceError } from "@types";
import { StatusBadRequest } from "@consts/statusCodes";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  RequestHandler,
} from "express";
import { Router } from "express";
import * as Yup from "yup";
import BasePagination from "./pagination";
import { baseErrorRes, baseSuccessRes } from "@consts";
import AuthMiddleware from "@config/router/middlewares/auth";
import Redis from "ioredis";
import { toSnakeCase } from "@utils/caseConvert";

class BaseController extends BasePagination {
  protected router = Router();
  protected redisClient: Redis;
  protected authMiddleware: AuthMiddleware;

  constructor() {
    super();
    this.redisClient = RedisDatabase.getInstance().getClient();
    this.authMiddleware = new AuthMiddleware(this.redisClient);
  }

  public getRouter(): Router {
    return this.router;
  }

  protected get mustAuthorized(): RequestHandler {
    return this.authMiddleware.mustAuthorized.bind(this.authMiddleware);
  }

  protected validate<T>(
    req: ExpressRequest,
    res: ExpressResponse,
    schema: Yup.Schema<T>,
    isQueryParam = false,
  ): T | null {
    const data = isQueryParam
      ? schema.cast(req.query, { stripUnknown: false })
      : req.body;

    try {
      schema.validateSync(data, { abortEarly: false });
    } catch (error) {
      if (!(error instanceof Yup.ValidationError)) {
        res
          .status(baseErrorRes.statusCode)
          .json(Object.assign({}, baseErrorRes, error));
        throw error;
      }

      const unknownParams =
        (error.inner[0].params?.unknown as string)?.split(", ") || [];

      const strictParamsErrors = unknownParams.map((param) => {
        return {
          field: toSnakeCase(param),
          message: `${param} is not allowed`,
        };
      });

      const schemaErrors = error.inner
        .filter((err) => err.path !== "")
        .map((err) => ({
          field: toSnakeCase(err.path as string),
          message: err.message,
        }));

      res.status(StatusBadRequest).json(
        Object.assign({}, baseErrorRes, {
          statusCode: StatusBadRequest,
          message: "Validation Error",
          errors: [...strictParamsErrors, ...schemaErrors],
        }),
      );
      return null;
    }

    return data;
  }

  protected validateQuery<T>(
    req: ExpressRequest,
    res: ExpressResponse,
    schema: Yup.Schema<T>,
  ): T | null {
    return this.validate(req, res, schema, true);
  }

  protected handleSuccess(
    res: ExpressResponse,
    data: Partial<DataResponse>,
    pagination?: Pagination,
  ): void {
    res
      .status(data.statusCode ?? baseSuccessRes.statusCode)
      .json(Object.assign({}, baseSuccessRes, data, { pagination }));
  }

  protected handleError(
    res: ExpressResponse,
    data: Partial<ServiceError>,
  ): void {
    res.status(data.statusCode ?? baseErrorRes.statusCode).json(
      Object.assign({}, baseErrorRes, {
        statusCode: data.statusCode,
        message: data.message ?? "Internal Server Error",
      }),
    );
  }

  protected isServiceError(
    res: ExpressResponse,
    data: unknown | ServiceError,
  ): data is ServiceError {
    const isError = (data as ServiceError)?.error !== undefined;

    if (isError) {
      this.handleError(res, data as ServiceError);
    }

    return isError;
  }
}

export default BaseController;
